var gmapsLoaded = false;

function renderMap() {
	gmapsLoaded = true;
}

//IFrame Listener
window.addEventListener('message', function(e) {
	// We only accept messages from ourselves
	
	//Hacky: Wait for gmaps to load
	while(!gmapsLoaded) {}

	$.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json",
            type: "get",
            headers: {
				'Content-type': 'application/x-www-form-urlencoded',
				'Access-Control-Allow-Headers': 'x-requested-with' //Cross Domain Access
            },
			data: {
				"address": e.data.selectedText,
				"key": "AIzaSyBUK7HPpjNepqxtKAGLA0wPRk14NE0nZgQ"
			},
			cache: true,
            success: function (result) {
				if(result.results.length == 1) {
					console.log(result.results[0].geometry.location.lat);
					console.log(result.results[0].geometry.location.lng);
					
					var mapDOM = document.getElementById('map_canvas');
		
					var currPos = result.results[0].geometry.location;
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
				}
			},
            error: function (error) {
				console.log('Error');
                console.log(error.responseText);
            }
    });
});

