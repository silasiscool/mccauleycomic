const fileInput = document.getElementById('file-input');
const dateInput = document.getElementById('date-input');
const titleInput = document.getElementById('title-input');
const submitButton = document.getElementById('submit-button');

// Await submit
submitButton.addEventListener('click', (e) => {

    // Check for valid file and date input, else alert & exit
    if (!fileInput.value || !dateInput.value) {
        window.alert("Missing valid file or date");
        return
    }

    // Get date and title from inputs, using date as title if none specified
    let dateObject = new Date(dateInput.value);
    let date = dateObject.toISOString().split('T')[0];
    let title = titleInput.value;
    title = title ? title : dateObject.toLocaleDateString();

    // Select file
    let file = fileInput.files[0];
    if (!file) {
        window.alert("Bad File");
        return
    }

    // Set up file reader
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64Str = e.target.result;
        eel.dataReceive(date, title, base64Str)
    }

    // Read file
    reader.readAsDataURL(file)

})