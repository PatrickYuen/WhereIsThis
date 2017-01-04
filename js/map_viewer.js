var gmapsLoaded = false;

function renderMap() {
	gmapsLoaded = true;
}

//IFrame Listener
window.addEventListener('message', function(e) {
	//TODO: We only accept messages from ourselves
	
	//Hacky: Wait for gmaps to load
	while(!gmapsLoaded) {}
	
	var mapDOM = document.getElementById('map_canvas');

	var map = new google.maps.Map( mapDOM, {
		mapTypeControlOptions: {
			mapTypeIds: []
		},
		mapTypeId: 'roadmap'
	});

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
	  searchBox.setBounds(map.getBounds());
	});

	var markers = [];
	
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {

		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		
		var place = places[0]; //Do the first one every time

		if (!place.geometry) {
			console.log("Returned place contains no geometry");
			return;
		}	
		
		var icon = {
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25)
		};

		// Create a marker for each place.
		markers.push(new google.maps.Marker({
			map: map,
			icon: icon,
			title: place.name,
			position: place.geometry.location
		}));

		if (place.geometry.viewport) {
			// Only geocodes have viewport.
			bounds.union(place.geometry.viewport);
		} else {
			bounds.extend(place.geometry.location);
		}

		map.fitBounds(bounds);
		
		//Set the address
		input.value = place.formatted_address;
		
		//Make visible: After everything is done
		document.getElementById('map_container').style.visibility = "visible";		
	});
	
	//Trigger SearchBox
	var request = {
        query: e.data.selectedText
    };
	
    new google.maps.places.PlacesService(map).textSearch(request, function(places) {
        //set the places-property of the SearchBox
        //places_changed will be triggered automatically
        searchBox.set('places', places || [])
    });
	
	//Set window size
	mapDOM.style.width = "90%";
	mapDOM.style.height = "90%";
	
	mapDOM.style.position = "absolute";
});

