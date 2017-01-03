//Initialize Map
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

//Create Popups
// Add bubble to the top of the page.
var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);

var mouseX = 0;
var mouseY = 0;

//Track Mouse
document.oncontextmenu = function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
};

//Message Passing
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {

		//Render Map at that location
		renderBubble(mouseX, mouseY, request.selectionText);
		
		sendResponse({});
	}
);

// Close the bubble when we mouse off on the screen.
//document.addEventListener('mousedown', function (e) {
//  bubbleDOM.style.visibility = 'hidden';
//}, false);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
	bubbleDOM.innerHTML = selection;
	bubbleDOM.style.top = mouseY + 'px';
	bubbleDOM.style.left = mouseX + 'px';
	bubbleDOM.style.visibility = 'visible';
	console.log(document.body);
}