// DOM Elements
const yearSelect = document.getElementById('year-select');
const weekSelect = document.getElementById('week-select');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const imgDisplay = document.getElementById('img-display');

// Image display button callbacks
prevButton.addEventListener('click', ()=>updateImageIndex(-1));
nextButton.addEventListener('click', ()=>updateImageIndex(1));

// Image update callback
function updateImageIndex(n) {
    // Update imgIndex
    imgDisplay.dataset.imgIndex = parseInt(imgDisplay.dataset.imgIndex) + n;

    // Store dataset values as vars
    let imgIndex = imgDisplay.dataset.imgIndex;
    let maxIndex = imgDisplay.dataset.maxIndex;

    // Check for low index
    if (imgIndex <= 0) {
        imgDisplay.dataset.imgIndex = 0;
        imgIndex = 0;
        prevButton.classList.add('hidden');
    } else {
        prevButton.classList.remove('hidden');
    }

    // Check for high index
    if (imgIndex >= maxIndex) {
        imgDisplay.dataset.imgIndex = maxIndex;
        imgIndex = maxIndex;
        nextButton.classList.add('hidden');
    } else {
        nextButton.classList.remove('hidden');
    }
    
    // Get Image Elements
    const imgs = imgDisplay.querySelectorAll('img')
    if (imgs.length == 0)
        return

    // Add Needed src
    if (imgs[imgIndex].src == "")
        imgs[imgIndex].src = R2RetriveImage(imgs[imgIndex].dataset.id)

    // Update display
    imgs.forEach(img=>img.classList.remove('show'));
    imgs[imgIndex].classList.add('show');
}

// updateImageIndex(0);

// Initialize page
setupYearSelect();

// Add year buttons to year select
async function setupYearSelect() {
    // Get comics list
    const comics = await getPublishedComics();

    // Get published time
    const metadata = await getMetadata();
    const publishTimeUTC = metadata.settings.publishTimeUTC;

    // let years = new Set()
    const comicPubDates = comics.map(comic => new Date(`${comic.date}T${publishTimeUTC}Z`));
    let years = comicPubDates.map(date => date.getFullYear());
    years = new Set(years);
    
    // Clear year select field
    yearSelect.innerHTML = "";

    // Setup each year button
    years.forEach(year => {
        // Create year button with appropriate properties
        const yearButton = document.createElement('button');
        yearButton.innerText = year;
        yearButton.classList.add('select-button');
        yearButton.classList.add('year-select-button');
        
        // Add button to DOM
        yearSelect.appendChild(yearButton);

        // Add callback to button
        yearButton.addEventListener('click', () => {
            // Do nothing if already selected
            if (yearButton.classList.contains('selected'))
                return

            // Set all selected year buttons to unselected
            document.querySelectorAll('.year-select-button.selected').forEach(item => item.classList.remove('selected'));
            
            // Select new year button
            yearButton.classList.add('selected');

            // Setup week buttons based on year
            setupWeekSelect(year);
        })
    });

    yearSelect.classList.remove('hidden');
}

// Add week buttons to week select
async function setupWeekSelect(year) {
    weekSelect.classList.add('hidden');

    // Get comics list
    const comics = await getPublishedComics();

    // Get published time
    const metadata = await getMetadata();
    const publishTimeUTC = metadata.settings.publishTimeUTC;

    // Get all sunday dates
    let sundays = new Set()
    comics.forEach(comic=>{
        const comicPubDate = new Date(`${comic.date}T${publishTimeUTC}Z`);
        if (comicPubDate.getFullYear() != year) 
            return
        
        // Add each Sunday date to set as time
        sundays.add(getSunday(comicPubDate).getTime())
    })

    // Convert sundays to date objects
    sundays = Array.from(sundays).map(num => new Date(num))
    
    // Create button strings array as ranges from sunday date to saturday date
    const weeks = Array.from(sundays).map(date => 
        date.toLocaleDateString(undefined, {month: "numeric", day: "numeric"}) 
        + ' - ' 
        + getSaturday(date).toLocaleDateString(undefined, {month: "numeric", day: "numeric"})
    );

    // Clear week select field
    weekSelect.innerHTML = "";

    // Setup each week button
    weeks.forEach((week, i) => {
        // Create year button with appropriate properties
        const weekButton = document.createElement('button');
        weekButton.innerText = week;
        weekButton.classList.add('select-button');
        weekButton.classList.add('week-select-button');

        // Add button to DOM
        weekSelect.appendChild(weekButton);

        // Add callback to button
        weekButton.addEventListener('click', () => {
            // Do nothing if already selected
            if (weekButton.classList.contains('selected'))
                return

            // Set all selected week buttons to unselected
            document.querySelectorAll('.week-select-button.selected').forEach(item => item.classList.remove('selected'));

            // Select new week button
            weekButton.classList.add('selected');

            // Setup comic display based on week
            displayWeekComics(sundays[i].toISOString())
        })
    })


    weekSelect.classList.remove('hidden');
}

// Show comic display for given week
async function displayWeekComics(sundayISODate) {
    // Get sunday date as date object
    const sundayDate = new Date(sundayISODate)

    // Get comics list
    const comics = await getPublishedComics();

    // Get published time
    const metadata = await getMetadata();
    const publishTimeUTC = metadata.settings.publishTimeUTC;

    // Filter for comics in selected week
    const weekComics = comics.filter(comic => {
        const comicPubDate = new Date(`${comic.date}T${publishTimeUTC}Z`);
        const comicSundayDate = getSunday(comicPubDate);
        return comicSundayDate.getTime() == sundayDate.getTime()
    })

    // Invert order of weekComics to follow date order
    weekComics.reverse()

    // Clear img display
    imgDisplay.innerHTML = "";
    imgDisplay.dataset.imgIndex = 0;
    imgDisplay.dataset.maxIndex = weekComics.length - 1;

    // Create image elements
    weekComics.forEach(comic => {
        // Create image element, waiting to add src until view
        const image = document.createElement('img');
        image.dataset.id = comic.id
        image.alt = "McCauley Comic: " + comic.title;

        // Add image object
        imgDisplay.appendChild(image);
    })

    // Update display and index
    updateImageIndex(0)
}
