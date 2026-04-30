const fileInput = document.getElementById('file-input');
const dateInput = document.getElementById('date-input');
const titleInput = document.getElementById('title-input');
const submitButton = document.getElementById('submit-button');
const currentFileList = document.getElementById('current-file-list')

// Handle return on submit
submitButton.addEventListener('click', (e) => {

    // Check for valid file and date input, else alert & exit
    if (!fileInput.value || !dateInput.value) {
        window.alert("Missing valid file or date");
        return
    }

    // Setup metadata for return
    let metadata = {};

    // Get date and title from inputs
    let dateObject = new Date(dateInput.value);
    metadata.date = dateObject.toISOString().split('T')[0];
    metadata.title = titleInput.value ? titleInput.value : dateObject.toLocaleDateString();

    // Generate unique id using current timestamp in base 36
    metadata.id = Date.now().toString(36);

    // Select file
    let file = fileInput.files[0];
    if (!file) {
        window.alert("Bad File");
        return
    }

    // Set up file reader
    let reader = new FileReader();
    reader.onload = (e) => {
        // Read file
        let base64Str = e.target.result;

        let fileData = {
            "id":metadata.id,
            "base64Str":base64Str
        }

        // Return data to main python script
        eel.dataReturn(metadata, fileData);
    }

    // Disable inputs
    fileInput.disabled = true;
    dateInput.disabled = true;
    titleInput.disabled = true;
    submitButton.disabled = true;

    // Read file
    reader.readAsDataURL(file);

    // Add filename to list in window
    let newListItem = document.createElement('li');
    newListItem.innerText = fileInput.files[0].name;
    currentFileList.appendChild(newListItem);
})

// Ask and handle if the user wishes to submit more files
function checkSubmitAgain() {
    // Ask user
    let response = window.confirm(`File recieved. Add more files?

    Click OK to add another file
    Click Cancel to upload files`);


    if (response) { // If submit again, reset inputs and reenable
        fileInput.value = "";
        dateInput.value = "";
        titleInput.value = "";

        fileInput.disabled = false;
        dateInput.disabled = false;
        titleInput.disabled = false;
        submitButton.disabled = false;
    } else { // If upload, run python function
        eel.uploadFiles();
    }
}
eel.expose(checkSubmitAgain);

// Function to allow python script to close window when complete
function closeApp() {
    window.close();
    return "Window Clossed"
}
eel.expose(closeApp);

// Function to allow python script to send alerts to user
function messageUser(string) {
    window.alert(string);
}
eel.expose(messageUser);