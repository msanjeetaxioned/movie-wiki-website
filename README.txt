Final FED Test Task Name: Movie Wiki Website

Ways to run project:
1. Open this Staging link: https://axionedstaging.com/trainee/sanjeet-dec-17/
2. If you want to run this project on your localhost then you will need to change the 2nd Page URL in 'script.js' file (line no. 59), to localhost url of 2nd page. eg. "http://127.0.0.1:5500/movie-details.html".

Note:
- 'IMDB API' only allows 100 requests a day and if you do everything on both pages it will take 5 API calls, so use them wisely. Once 100 requests are over no data is returned. So project will not work.
- More Info. on above point. 2 API calls are needed for 1st Page whereas 3 API calls are made on the 2nd Page. Details on API calls (If you want to read):
    1. First API call is made for 'coming-soon' Movies (the Carousel at the top of the page).
    2. Second API call is made for the 'Most Popular Movies' list.
    3. When the 'More-Info' button is clicked on Modal in the 1st Page an API request is made to get details of the clicked movie. The movie details are displayed on the 2nd page.
    4. If you 'Search' a movie in the 2nd page an API request is sent. This response sometimes takes a bit of time so please be patient.
    5. If you 'Click' on one of the returned Movies from the previous search then an API request is made to get details of the clicked movie (Similar to API request made in 3rd point).


Project Details:
    The task has 2 Pages.
    1st Page:
    - Has a 'Upcoming Movies' Carousel at the top. It contains the Movie image and basic related info eg. Movie-name &  it's release date. The Carousel can be scrolled with 'Left' & 'Right' arrow keys on keyboard as well as can be scrolled by using Mouse(Mouse Drag scroll left or right) and will adjust itself on Browser resizing.
    - The 'Popular Movies' has the 'Most Popular Movies' from IMDB API. The result is displayed on 4 pages(Pagination). 25 Movie titles per page. The 'Movie List' is also sortable by Movie-Name, Year of release and IMDB rating.
    - On Clicking individual 'Movie titles' a Modal is opened which gives a bit more info. about the clicked movie.
    - The Modal can be closed on clicking the 'Close' button in the Top-Right corner.
    - The Modal also has a "More Info." button which when clicked opens the 2nd Page.

    2nd Page:
    - The 2nd Page has full details of the Movie clicked from the Modal.
    - The 2nd Page also has a "Search Bar" at the Top for Searching Movie titles by Name.
    - Inputing a 'Movie name' and clicking on Search button will return 'Movie' titles with similar name.
    - These 'Movie titles' can then be clicked to give info. of that particular movie.

The Project has been tested on Chrome & Firefox for Desktop reolutions(1024px+) as mentioned in the mail. I don't have any Apple device so cannot test on Safari browser (Tejesh said fine with it).