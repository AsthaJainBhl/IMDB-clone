const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const favoritesList = document.getElementById('favoritesList');

if (favorites.length === 0) {
    favoritesList.innerHTML = '<p>No favorite movies added yet.</p>';
} else {
    // Handle myfavorites.html page load
    if (window.location.pathname.endsWith('/myfavorites.html')) {
        const fetchMovieDetails = async (title) => {
            const apiKey = '7cc2e66b';
            const url = `https://www.omdbapi.com/?t=${title}&apikey=${apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch (err) {
                console.error(err);
                return null;
            }
        };

        favoritesList.innerHTML = ''; // Clear previous content

        const posterUrls = [];
        const movieDetailsPromises = favorites.map(async (title) => {
            const movieTile = document.createElement('div');
            movieTile.className = 'col-md-3 movie-tile';
            // Fetch movie details from OMDB API
            const movieDetails = await fetchMovieDetails(title);
            if (movieDetails) {
                // Check if the movie has a poster, or use a placeholder image
                const posterUrl = movieDetails.Poster === 'N/A' ? 'placeholder-image.jpg' : movieDetails.Poster;
                posterUrls.push(posterUrl);
                const year = movieDetails.Year;

                // Create an anchor tag for the movie title
                const movieDetailsLink = document.createElement('a');
                movieDetailsLink.href = `movie.html?title=${encodeURIComponent(title)}`;
                movieDetailsLink.textContent = title;

                movieTile.innerHTML = `
                    <img src="${posterUrl}" alt="${title}" class="movie-poster">
                    <h2>${movieDetailsLink.outerHTML}</h2>
                    <p>Year: ${year}</p>
                    <button class="btn btn-danger remove-from-favorites" data-title="${title}">Remove from Favorites</button>
                `;

                favoritesList.appendChild(movieTile);
                favoritesList.classList.add('flex-container');

                // Add click event listener to the "Remove from Favorites" button
                const removeButton = movieTile.querySelector('.remove-from-favorites');
                removeButton.addEventListener('click', function () {
                    const titleToRemove = removeButton.getAttribute('data-title');
                    removeFromFavorites(titleToRemove, movieTile);
                });
            }
        });

        // After fetching all movie details, display additional images
        Promise.all(movieDetailsPromises).then(() => {
            displayAdditionalImages(posterUrls);
        });
    }
}

// Function to remove a movie from favorites and update localStorage
function removeFromFavorites(title, movieTile) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter((movieTitle) => movieTitle !== title);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    movieTile.remove(); // Remove the movie entry from the DOM
}

// Function to display additional images
function displayAdditionalImages(imageUrls) {
    const additionalImagesContainer = document.getElementById('additionalImages');
    additionalImagesContainer.innerHTML = '';

    imageUrls.forEach((imageUrl) => {
        const imageColumn = document.createElement('div');
        imageColumn.className = 'col-md-3';

        const image = document.createElement('img');
        image.src = imageUrl;
        image.className = 'img-fluid additional-image';

        imageColumn.appendChild(image);
        additionalImagesContainer.appendChild(imageColumn);
    });
}
