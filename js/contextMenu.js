// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
	var title = "Where Is This?";
	var context = "selection";
	var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
	//Send Selected Text to context page
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {"selectionText": info.selectionText}, function(response) {
			//alert("Success");
		});
	});
};