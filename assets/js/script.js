document.addEventListener('DOMContentLoaded', function(event) {
	const xhttp = new XMLHttpRequest();
	xhttp.open("GET", "assets/json/upcoming.json");
	xhttp.send();
	xhttp.onload = function() {
			let response = JSON.parse(this.responseText);
			console.log(response);
	}
});