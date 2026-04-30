// Get query params
const queryString = window.location.search;
const params = new URLSearchParams(queryString);

// Constants
const metadataPath = 'data/comic_metadata.json';
const R2BaseURL = 'https://pub-462b7d3f2c6946928c075e6c0fc28b67.r2.dev'

// Function to get local metadata file
async function getMetadata() {
    const res = await fetch(metadataPath);
    const metadata = await res.json();
    return metadata
}

// Return comics sorted by date
async function dateSortedComics() {
    // Get comic metadata
    const metadata = await getMetadata();

    // Get sorted list of comics
    const comics = metadata.comics.sort((a,b) => {
        if (b.date !== a.date) { // If dates are different, sort them
            return b.date.localeCompare(a.date);
        }
        return 0; // If dates are identical, preserve order
    })

    return comics
}

// Get SRC for R2 image
function R2RetriveImage(id) {
    if (params.has('noloadimg'))
        return '/media/placeholdercomic.png'
    return `${R2BaseURL}/${id}.webp`
}