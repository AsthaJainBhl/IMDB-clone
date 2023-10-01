// OMDB API Key
const apiKey = '7cc2e66b';

// Handle the form submission
document.getElementById('movieForm').addEventListener('submit', function (event) {
    event.preventDefault();
});

// Handle the input field value changes
document.getElementById('title').addEventListener('input', async function (event) {
    const search = event.target.value;

    if (search.trim() === '') {
        clearResults();
        return;
    }

    // Fetch and display movie search results
    const searchResults = await fetchMovies(search);

    if (searchResults && searchResults.Search) {
        displaySearchResults(searchResults.Search);
    } else {
        clearResults();
    }
});

//function to fetch movie details from OMDB API
async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?s=${search}&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// Function to display search results as movie tiles
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = ''; // Clear previous results

    results.forEach((movie) => {
        const movieTile = document.createElement('div'); // Use an anchor tag
        movieTile.className = 'col-md-4 movie-tile';

        // Check if the movie has a poster, or use a placeholder image
        const posterUrl = movie.Poster === 'N/A' ? 'placeholder-image.jpg' : movie.Poster;

        // Create an anchor tag for the movie title
        const movieDetailsLink = document.createElement('a');
        movieDetailsLink.href = `movie.html?title=${encodeURIComponent(movie.Title)}`;
        movieDetailsLink.textContent = movie.Title;

        movieTile.innerHTML = `
            <img src="${posterUrl}" alt="${movie.Title}" class="movie-poster">
            <h2>${movieDetailsLink.outerHTML}</h2>
            <p>Year: ${movie.Year}</p>
            <button class="btn btn-primary add-to-favorites" data-title="${movie.Title}">Add to Favorites</button>
        `;

        searchResultsContainer.appendChild(movieTile);
    });

    // Add click event listeners to the "Add to Favorites" buttons
    const addToFavoritesButtons = document.querySelectorAll('.add-to-favorites');
    addToFavoritesButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const title = button.getAttribute('data-title');
            addToFavorites(title);
        });
    });
}


// Function to clear search results
function clearResults() {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';
}

// Function to add a movie to favorites and store in localStorage
function addToFavorites(title) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(title)) {
        favorites.push(title);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${title} has been added to your favorites!`);
    } else {
        alert(`${title} is already in your favorites!`);
    }
    console.log('Favorites:', favorites); // Add this line for debugging
}
