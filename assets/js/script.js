document.addEventListener('DOMContentLoaded', function(event) {
	let upcomingMovies = [];
	let totalUpcomingMovies = 0;
	let currentItem = 1;

	let upcomingMoviesHTML = document.querySelector(".upcoming-movies");
	let previousButton = upcomingMoviesHTML.querySelectorAll(".carousel-buttons")[0];
	let nextButton = upcomingMoviesHTML.querySelectorAll(".carousel-buttons")[1];

	let ul = upcomingMoviesHTML.querySelector(".carousel");
	let carouselDotsUl = upcomingMoviesHTML.querySelector(".carousel-dots");

	let liList;
	let imgList;
	let carouselDotsArray;

	let popularMovies = [];
	let popularMoviesByPopularity = [];
	let popularMoviesByName = [];
	let popularMoviesByYear = [];
	let popularMoviesByIMDBRating = [];
	let totalPopularMovies = 0;
	let moviesPerPage = 25;
	let totalPages = 0;
	let currentPage = 1;

	let mostPopularMoviesHTML = document.querySelector(".most-popular-movies");
	let popularMoviesSortOptions = mostPopularMoviesHTML.querySelector(".sort-options");
	let popularMoviesPerPage = mostPopularMoviesHTML.querySelector(".movies-content");
	let popularMoviesPagination = mostPopularMoviesHTML.querySelector(".pagination");

	getJSONDataOfUpcomingMovies();
	getJSONDataOfMostPopularMovies();

	function getJSONDataOfUpcomingMovies() {
		const xhttp = new XMLHttpRequest();
		xhttp.open("GET", "assets/json/upcoming.json");
		xhttp.send();
		xhttp.onload = function() {
				let response = JSON.parse(this.responseText);
				if(response.errorMessage == "") {
					upcomingMovies = response.items;
					totalUpcomingMovies = upcomingMovies.length;
					addJSONDataInCarouselAndDots();
					addCarouselEventListeners();
				}
		}
	}

	function getJSONDataOfMostPopularMovies() {
		const xhttp = new XMLHttpRequest();
		xhttp.open("GET", "assets/json/most-popular.json");
		xhttp.send();
		xhttp.onload = function() {
				let response = JSON.parse(this.responseText);
				if(response.errorMessage == "") {
					popularMoviesByPopularity = response.items;
					popularMovies = popularMoviesByPopularity;
					totalPopularMovies = popularMovies.length;
					totalPages = Math.ceil(totalPopularMovies / moviesPerPage);
					console.log(popularMovies);
					displayPage(true, popularMoviesPerPage, 1);
					addEventListenersForPopularMovies();
					sortByName(popularMovies, popularMoviesByName);
				}
		}
	}

	function addJSONDataInCarouselAndDots() {
		ul.innerHTML = "";
		carouselDotsUl.innerHTML = "";
		for(let i = 0; i < totalUpcomingMovies; i++) {
			let li = document.createElement("li");
			if(i == 0) {
				li.classList.add("selected");
			}
			li.innerHTML = `
				<div class="left-side">
					<span>${upcomingMovies[i].title}</span>
					<span><small>Directed By: </small>${upcomingMovies[i].directors}</span>
					<span><small>Main Stars: </small>${upcomingMovies[i].stars}</span>
				</div>
				<figure>
					<img src="${upcomingMovies[i].image}" alt="${upcomingMovies[i].title} Promo Image">
				</figure>
				<div class="right-side">
					<span class="release-date">${upcomingMovies[i].releaseState}, ${upcomingMovies[i].year}</span>
					<span class="runtime">${upcomingMovies[i].runtimeStr}</span>
					<span class="genres">${upcomingMovies[i].genres}</span>
					<span class="content-rating">${upcomingMovies[i].contentRating}</span>
				</div>
			`;
			ul.append(li);

			let liCarouselDot = document.createElement("li");
			if(i == 0) {
				liCarouselDot.classList.add("selected");
			}
			liCarouselDot.innerHTML = `
				<span title="${upcomingMovies[i].title}" data-id="${i+1}">Dot 1</span>
			`;
			carouselDotsUl.append(liCarouselDot);
			upcomingMoviesHTML.classList.remove("display-none");
		}
	}

	function addCarouselEventListeners() {
		liList = upcomingMoviesHTML.querySelectorAll(".carousel > li");
		imgList = upcomingMoviesHTML.querySelectorAll(".carousel > li img");
		carouselDotsArray = upcomingMoviesHTML.querySelectorAll(".carousel-dots > li");

		let cloneOfFirst = liList[0].cloneNode(true);
		let cloneOfLast = liList[liList.length-1].cloneNode(true);

		ul.append(cloneOfFirst);
		ul.prepend(cloneOfLast);

		liList = upcomingMoviesHTML.querySelectorAll(".carousel li");

		// Scroll to Actual First Element(ie. 2nd Element in Array after cloning)
		ul.scrollLeft = liList[currentItem].offsetLeft-8;

		// Remove default drag of img behaviour
		for(let img of imgList) {
				img.addEventListener("dragstart", function(event) {
						event.preventDefault();
				});
		}

		// Scroll Slides on Mouse Drag Left/Right
		let startX, endX, diffX, minDiff = 100;
		ul.addEventListener("mousedown", function(event) {
				startX = parseInt(event.clientX);
		});

		ul.addEventListener("mouseup", function(event) {
				endX = parseInt(event.clientX);
				diffX = Math.abs(endX-startX);
				if(diffX >= minDiff) {
						if(endX > startX) {
								changeDisplayedItem(true, -1);
						}
						else {
								changeDisplayedItem(true, 1);
						}
				}
		});

		// Handle Browzer Resizing
		let timeout;
		window.addEventListener("resize", function(event) {
				clearTimeout(timeout);
				timeout = setTimeout(function() {
						ul.scrollLeft = liList[currentItem].offsetLeft;
						console.log("Resized");
				}, 300);
		});

		document.addEventListener("keydown", function(event) {
				if(event.key === "ArrowLeft") {
						changeDisplayedItem(true, -1);
				}
				else if(event.key === "ArrowRight") {
						changeDisplayedItem(true, 1);
				}
		});

		previousButton.addEventListener("click", function() {
				changeDisplayedItem(true, -1);
		});

		nextButton.addEventListener("click", function() {
				changeDisplayedItem(true, 1);
		});

		for(let carouselDot of carouselDotsArray) {
			let span = carouselDot.querySelector("span");
			span.addEventListener("click", function() {
					changeDisplayedItem(false, parseInt(this.getAttribute("data-id")));
			});
		}
	}
	
	function changeDisplayedItem(onNextPrevClick, number) {
			liList[currentItem].classList.remove("selected");
			carouselDotsArray[currentItem-1].classList.remove("selected");
			if(onNextPrevClick) {
					if(currentItem == 1 && number == -1) {
							currentItem = totalUpcomingMovies;
							horizontalScrollToElement(ul, liList[0].offsetLeft, 400, true);
					}
					else if((currentItem == totalUpcomingMovies) && (number == 1)) {
							currentItem = 1;
							horizontalScrollToElement(ul, liList[liList.length-1].offsetLeft, 400, true);
					}
					else {
							currentItem = currentItem + number;
							horizontalScrollToElement(ul, liList[currentItem].offsetLeft, 400);
					}
			}
			else {
					currentItem = number;
					horizontalScrollToElement(ul, liList[currentItem].offsetLeft, 400);
			}
			liList[currentItem].classList.add("selected");
			carouselDotsArray[currentItem-1].classList.add("selected");
	}

	function horizontalScrollToElement(scrollLayer, destination, duration, callback) {
			if (duration <= 0) {
					if(callback) {
							ul.scrollLeft = liList[currentItem].offsetLeft;
					}
					return;
			}
			const difference = destination - scrollLayer.scrollLeft;
			const perTick = (difference / duration) * 10;
	
			let timeout = setTimeout(function() {
					scrollLayer.scrollLeft = scrollLayer.scrollLeft + perTick;
					if (scrollLayer.scrollLeft === destination) {
							clearTimeout(timeout);
							if(callback) {
									ul.scrollLeft = liList[currentItem].offsetLeft;
							}
							return;
					}
					horizontalScrollToElement(scrollLayer, destination, duration - 10, callback);
			}, 10);
	}

	function addEventListenersForPopularMovies() {
		popularMoviesPagination.innerHTML = "";
		for(i = 0; i < totalPages; i++) {
			let pageLi = document.createElement("li");
			if(i == 0) {
				pageLi.classList.add("selected");
			}
			pageLi.innerHTML = `
				<span title="Page ${i+1}" data-id="${i+1}">${i+1}</span>
			`;
			popularMoviesPagination.append(pageLi);
		}

		let pageLis = popularMoviesPagination.querySelectorAll("li");
		for(i = 0; i < totalPages; i++) {
			let span = pageLis[i].querySelector("span");
			span.addEventListener("click", function() {
				let clickedPage = parseInt(this.getAttribute("data-id"));
				if(clickedPage != currentPage) {
					pageLis[currentPage-1].classList.remove("selected");
					pageLis[clickedPage-1].classList.add("selected");
					currentPage = clickedPage;
					displayPage(false, popularMoviesPerPage, clickedPage);
				}
			});
		}
	}

	function displayPage(appStart, ul, number) {
		ul.innerHTML = "";
		let start = (number-1) * moviesPerPage, end = number * moviesPerPage;

		for(let i = start; i < end; i++) {
			let li = document.createElement("li");
			if(popularMovies[i].imDbRating == "") {
				popularMovies[i].imDbRating = "Not Released";
			}
			li.innerHTML = `
				<span class="rank">#${i+1}</span>
				<figure>
					<img src="${popularMovies[i].image}">
				</figure>
				<div class="info">
					<span class="title">${popularMovies[i].title}</span>
					<span class="year"><small>Year: </small>${popularMovies[i].year}</span>
					<span class="rating"><small>IMDB Rating: </small>${popularMovies[i].imDbRating}</span>
				</div>
			`;
			ul.append(li);
		}
		if(appStart) {
			mostPopularMoviesHTML.classList.remove("display-none");
		}
	}

	function sortByName(array, newSortedArray) {
		if(newSortedArray.length == 0) {
			for(let i = 0; i < array.length; i++) {
				newSortedArray[i] = popularMovies[i];
			}
		}
		newSortedArray.sort(function(a, b) {
			if(a.title.toLowerCase() > b.title.toLowerCase()) {
				return 1;
			}
			else {
				return -1;
			}
		});
		console.log(popularMoviesByName);
	}
});