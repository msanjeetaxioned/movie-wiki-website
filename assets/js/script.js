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

	getJSONDataOfUpcomingMovies();

	function getJSONDataOfUpcomingMovies() {
		const xhttp = new XMLHttpRequest();
		xhttp.open("GET", "assets/json/upcoming.json");
		xhttp.send();
		xhttp.onload = function() {
				let response = JSON.parse(this.responseText);
				if(response.errorMessage == "") {
					console.log(response.items);
					upcomingMovies = response.items;
					totalUpcomingMovies = upcomingMovies.length;
					addJSONDataInCarouselAndDots();
					addCarouselEventListeners();
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
});