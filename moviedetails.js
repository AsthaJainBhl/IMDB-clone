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
});
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
