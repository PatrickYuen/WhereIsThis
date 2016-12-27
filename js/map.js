function initMap() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var currPos = {lat: position.coords.latitude, lng: position.coords.longitude};
			var map = new google.maps.Map(document.getElementById('map'), {
			  zoom: 15,
			  center: currPos
			});
			var marker = new google.maps.Marker({
			  position: currPos,
			  map: map
			});
		});
	} else {
		console.log("GeoLocation not supported by browser.");
	}
}