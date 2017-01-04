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

//======================================================================================================

var mouseX = 0;
var mouseY = 0;

//Track Mouse
document.oncontextmenu = function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
};

//Message Passing from Background
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {		
		onRenderMap(request.selectionText);

		sendResponse({});
	}
);

// Unique ID to differentiate this content script from the rest of the web. 
// or use the extension id from @@__extension_id__, I recall there was a bug, haven't
// checked if it got resolved though. 
var UNIQUE_MAP_VIEWER_ID = 'whereisthis_iframe'; 
var latitude = -1;
var longitude = -1;

//Here is where you want to render a latitude and longitude. We create an iframe so we
//we can inject it. We just want to maintain a single instance of it though.
function onRenderMap(selectedText) {
  var mapViewerDOM = document.getElementById(UNIQUE_MAP_VIEWER_ID);
  if (mapViewerDOM) {
     mapViewerDOM.parentNode.removeChild(mapViewerDOM);
  }

  mapViewerDOM = document.createElement('iframe');
  mapViewerDOM.setAttribute('id', UNIQUE_MAP_VIEWER_ID);
  mapViewerDOM.setAttribute('src', chrome.extension.getURL('map_viewer.html'));
  mapViewerDOM.setAttribute('frameBorder', '0');
  mapViewerDOM.setAttribute('width', '99.90%');
  mapViewerDOM.setAttribute('height', '100%');
  mapViewerDOM.setAttribute('style', 'position: absolute;' +
							'top: ' + mouseY + 'px;' +
							'left: ' + mouseX + 'px;' +
							'width: 40vh;' +
							'height: 40vh;' +
							'overflow: hidden; z-index: 99999');

  //Message Posting to IFrame
  mapViewerDOM.onload = function(e) {
	mapViewerDOM.contentWindow.postMessage(
	{ "selectedText": selectedText, "mouseX":mouseX, "mouseY":mouseY }, "*");
  }
  
  document.body.appendChild(mapViewerDOM);
}

//TODO: Just hide map to make it more lightweight?
// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
	var mapViewerDOM = document.getElementById(UNIQUE_MAP_VIEWER_ID);
	if (mapViewerDOM) {
		mapViewerDOM.parentNode.removeChild(mapViewerDOM);
	}
}, false);
