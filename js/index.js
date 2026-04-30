// Get DOM Elements
const comicElementIDs = ['comic1', 'comic2', 'comic3'];
const comicElements = comicElementIDs.map(id=>document.getElementById(id));


// Update images
async function updateImages() {
    // Get comics
    const comics = await getPublishedComics();

    // Find 3 most recent comics
    const recentComics = comics.slice(0,comicElements.length)

    // Assign images to comics
    for (let i = 0; i < comicElements.length; i++) {
        const comicElement = comicElements[i];
        const comicData = recentComics[i];

        // Apply src and alt
        comicElement.src = R2RetriveImage(comicData.id);
        comicElement.alt = "McCauley Comic: " + comicData.title;
    }
    
}
updateImages();