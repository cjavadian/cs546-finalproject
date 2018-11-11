var map;

// function to initialze the map
function initMap() {
	//initializes map
	map = new google.maps.Map(document.getElementById('map'), {
		// center: {lat: 40.7589, lng: -73.9851},
		zoom: 13
	});
}

//marker array that will hold all markers created and allow for deletion of them
var markerArr = []

// function to display data points on map
function getPoints(locations, center){ 
    if(!locations || !center) return;
    // Show map after user presses Find Events, then initialize the map
    document.getElementById('hideMap').style.display = 'block';
    if(!map) initMap(); 

    // Clear all previous markers existing on the map
    if(markerArr){
        for (var i = 0; i < markerArr.length; i++ ) {
            markerArr[i].setMap(null);
        }
        markerArr = []
    }
    // Pan map to the center of the postal code provided in the form
    map.panTo(new google.maps.LatLng(center.lat, center.lng))

    //allows for an info window when a user clicks on a marker
	var infowindow = new google.maps.InfoWindow({
		maxWidth: 300
	})
	// loop through each location returned by our backend
	Object.keys(locations).forEach(k => {
		//get the coordinates of each location
		coords = JSON.parse(k)

		// set an empty contentString to allow for dynamic appending
		var contentString = '';

		// loop through each event found at a location
		locations[k].forEach(eventObj =>{
			// append an ordered list of event names and times that has a url associated with each
			contentString += '<li><p><a target="_blank" href=' + eventObj['url'] + '>' + eventObj['eventName'] + ' - ' + eventObj['dateTime'] + '</a></p></li>'
		})

		// change grammar based on number of events found
        var eventPluralizer = (locations[k].length == 1 ? "Event Found at " : "Events Found at ")

        // add a marker for each location
		var marker = new google.maps.Marker({
			// set the position of the marker
	        position: new google.maps.LatLng(coords['latitude'], coords['longitude']),
	        // set a tooltip for the marker
	        title: locations[k].length.toString() + ' ' + eventPluralizer + locations[k][0]['venue'],
	        // map which will have markers be displayed on it
	        map: map,
    	});

    	// push all markers into an array
        markerArr.push(marker)

        // add an onClick listener to each marker that will display info regarding each location
    	marker.addListener('click', function() {
    		//content to be displayed within info window
    		infowindow.setContent("<div class='title'>" + eventPluralizer + locations[k][0]['venue'] + ":</div>" + '<ol>' + contentString + '</ol>')
    		// open infowindow on click
			infowindow.open(map, marker);
		});
	})
	// click anywhere on the map to close a currently opened infowindow
	map.addListener('click', function() {
		infowindow.close();
	})
}


$(document).ready(function() {
});