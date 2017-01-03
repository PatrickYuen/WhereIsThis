var gmapsLoaded = false;

function renderMap() {
	gmapsLoaded = true;
}

//IFrame Listener
window.addEventListener('message', function(e) {
	// We only accept messages from ourselves
	
	//Hacky: Wait for gmaps to load
	while(!gmapsLoaded) {}
	
	console.log(e.data);

	navigator.geolocation.getCurrentPosition(function(position) {
		var mapDOM = document.getElementById('map_canvas');
		
		var currPos = {lat: position.coords.latitude, lng: position.coords.longitude};
		var map = new google.maps.Map( mapDOM , {
		  zoom: 15,
		  center: currPos
		});
		var marker = new google.maps.Marker({
		  position: currPos,
		  map: map
		});
		
		//Set window size
		mapDOM.style.width = "80vh";
		mapDOM.style.height = "80vw";
	});
});

