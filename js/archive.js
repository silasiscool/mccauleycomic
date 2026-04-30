// DOM Elements
const yearSelect = document.getElementById('year-select');
const weekSelect = document.getElementById('week-select');

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

    years.forEach(year => {
        // Create year button with appropriate properties
        const yearButton = document.createElement('button');
        yearButton.innerText = year;
        yearButton.classList.add('select-button');
        yearButton.classList.add('year-select-button');
        
        // Add button to DOM
        yearSelect.appendChild(yearButton);
    });

}