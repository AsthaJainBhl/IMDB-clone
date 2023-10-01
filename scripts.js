document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch movie details from OMDB API
    async function fetchMovieDetails(title) {
        const apiKey = '7cc2e66b';
        const url = `https://www.omdbapi.com/?t=${title}&apikey=${apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err);
            return { Response: 'False' };
        }
    }
    
    // Function to display movie details
    function displayMovieDetails(movieDetails, additionalImages) {
        // Populate movie details as before
        document.getElementById('title').textContent = movieDetails.Title;
        document.getElementById('year').textContent = movieDetails.Year;
        document.getElementById('genre').textContent = movieDetails.Genre;
        document.getElementById('imdbRating').textContent = movieDetails.imdbRating;
        document.getElementById('plot').textContent = movieDetails.Plot;

        // Set the movie poster
        const posterUrl = movieDetails.Poster === 'N/A' ? 'placeholder-image.jpg' : movieDetails.Poster;
        document.getElementById('poster').src = posterUrl;

        // Display additional images
        displayAdditionalImages(additionalImages);
    }

    // Function to display additional images
    function displayAdditionalImages(images) {
        const additionalImagesContainer = document.getElementById('additionalImages');
        additionalImagesContainer.innerHTML = '';

        images.forEach((imageUrl) => {
            const imageColumn = document.createElement('div');
            imageColumn.className = 'col-md-3';

            const image = document.createElement('img');
            image.src = imageUrl;
            image.className = 'img-fluid additional-image';

            imageColumn.appendChild(image);
            additionalImagesContainer.appendChild(imageColumn);
        });
    }

    const queryParams = new URLSearchParams(window.location.search);
    const movieTitle = queryParams.get('title');

    // Fetch movie details and display them
    fetchMovieDetails(movieTitle).then((movieDetails) => {
        if (movieDetails.Response === 'True') {
            displayMovieDetails(movieDetails);
        } else {
            // Handle the case where movie details are not found
            document.querySelector('.container').innerHTML = '<p>Movie details not found.</p>';
        }
    });

    // OMDB API Key
    const apiKey = '7cc2e66b';

    // Handle the form submission
    document.getElementById('movieForm').addEventListener('submit', function (event) {
        event.preventDefault();
    });

    // Handle the input field value changes for real-time search
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

    // Function to display search results as movie tiles
    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('searchResults');
        searchResultsContainer.innerHTML = ''; // Clear previous results

        results.forEach((movie) => {
            const movieTile = document.createElement('a'); // Use an anchor tag
            movieTile.className = 'col-md-4 movie-tile';
            movieTile.href = `movie.html?title=${encodeURIComponent(movie.Title)}`; // Set the href attribute

            movieTile.className = 'col-md-4 movie-tile';

            // Check if the movie has a poster, or use a placeholder image
            const posterUrl = movie.Poster === 'N/A' ? 'placeholder-image.jpg' : movie.Poster;

            movieTile.innerHTML = `
                <img src="${posterUrl}" alt="${movie.Title}" class="movie-poster">
                <h2>${movie.Title}</h2>
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
    
    // Handle myfavorites.html page load
    if (window.location.pathname.endsWith('/myfavorites.html')) {
        const favoritesList = document.getElementById('favoritesList');
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>No favorite movies added yet.</p>';
        } else {
            favoritesList.innerHTML = ''; // Clear previous content

            favorites.forEach((title) => {
                const movieTile = document.createElement('div');
                movieTile.className = 'col-md-4 movie-tile';
                const posterUrl = 'placeholder-image.jpg';
                const year = '2022'; // Replace with actual year if available

                movieTile.innerHTML = `
                    <img src="${posterUrl}" alt="${title}" class="movie-poster">
                    <h2>${title}</h2>
                    <p>Year: ${year}</p>
                    <button class="btn btn-danger remove-from-favorites" data-title="${title}">Remove from Favorites</button>
                `;

                favoritesList.appendChild(movieTile);

                // Add click event listener to the "Remove from Favorites" button
                const removeButton = movieTile.querySelector('.remove-from-favorites');
                removeButton.addEventListener('click', function () {
                    const titleToRemove = removeButton.getAttribute('data-title');
                    removeFromFavorites(titleToRemove, movieTile);
                });
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
});
