document.addEventListener('DOMContentLoaded', function(event) {
    let movieId;
    let urlPathForSearchByID = "https://imdb-api.com/en/API/Title/k_cjzbh809/";
    let urlPathForSearchByMovieName = "https://imdb-api.com/en/API/SearchMovie/k_cjzbh809/";
    let movieData;
    let errorMessages = ["Enter Movie Name"];
    let searchResults = [];

    let main = document.querySelector("main");
    let movieDetails = main.querySelector(".movie-details");
    let searchAndResults = main.querySelector(".search-and-results");
    let form = searchAndResults.querySelector("form");
    let inputSearch = form["movie-search"];
    let errorMessageHTML = searchAndResults.querySelector(".error-message");
    let searchResultsDiv = searchAndResults.querySelector(".search-results-div");
    let searchResultsHTML = searchAndResults.querySelector(".search-results");

    if(sessionStorage.getItem("movie-id")) {
        movieId = sessionStorage.getItem("movie-id");
        getMovieDataAndDisplayIt();
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let searchValue = inputSearch.value;
        if(searchValue == "") {
            errorMessageHTML.innerText = errorMessages[0];
            errorMessageHTML.classList.remove("display-none");
        }
        else {
            errorMessageHTML.classList.add("display-none");
            getSearchResultsAndDisplayThem(searchValue);
        }
    });

    function getMovieDataAndDisplayIt() {
        const xhttp = new XMLHttpRequest();
		xhttp.open("GET", urlPathForSearchByID+movieId);
		xhttp.send();
		xhttp.onload = function() {
            let response = JSON.parse(this.responseText);
            if(response.errorMessage == "") {
                movieData = response;
                movieDetails.innerHTML = "";

                movieDetails.innerHTML = `
                    <h3>Movie Details</h3>
                    <span><small>Title: </small>${movieData.title}</span>
                    <span><small>Year: </small>${movieData.year}</span>
                    <span><small>Release Date: </small>${movieData.releaseDate}</span>
                    <figure>
                        <img src="${movieData.image}" alt="${movieData.title} Promo Poster">
                    </figure>
                    <span><small>Plot: </small>${movieData.plot}</span>
                    <span><small>Directors: </small>${movieData.directors}</span>
                    <span><small>Writers: </small>${movieData.writers}s</span>
                    <span><small>Stars: </small>${movieData.stars}</span>
                    <h4>Actor List:</h4>
                    <ul class="actors">
                    </ul>
                    <span><small>Genres: </small>${movieData.genres}</span>
                    <span><small>Companies: </small>${movieData.companies}</span>
                    <span><small>Countries: </small>${movieData.countries}</span>
                    <span><small>Languages: </small>${movieData.languages}</span>
                `;

                let actorListData = movieData.actorList;
                let actors = movieDetails.querySelector(".actors");
                for(let i = 0; i < actorListData.length; i++) {
                    let li = document.createElement("li");
                    li.innerHTML = `
                        <p>${actorListData[i].name} as <span>${actorListData[i].asCharacter}</span></p>
                    `;
                    actors.append(li);
                }

                movieDetails.classList.remove("display-none");
            }
		}
    }

    function getSearchResultsAndDisplayThem(searchValue) {
        const xhttp = new XMLHttpRequest();
		xhttp.open("GET", urlPathForSearchByMovieName+searchValue);
		xhttp.send();
		xhttp.onload = function() {
            let response = JSON.parse(this.responseText);
            if(response.errorMessage == "") {
                searchResults = response.results;
            }
            searchResultsHTML.innerHTML = "";
            
            for(let i = 0; i < searchResults.length; i++) {
                let li = document.createElement("li");
                li.innerHTML = `
                    <span title="${searchResults[i].title}" data-id="${i+1}">${searchResults[i].title} ${searchResults[i].description}</span>
                `;
                searchResultsHTML.append(li);
                let span = li.querySelector("span");
                span.addEventListener("click", function() {
                    let id = parseInt(this.getAttribute("data-id"));
                    movieId = searchResults[id-1].id;
                    getMovieDataAndDisplayIt();
                });
            }

            searchResultsDiv.classList.remove("display-none");
        }
    }
});