var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		// center: {lat: 40.7589, lng: -73.9851},
		zoom: 13
	});
}

var markerArr = []
function getPoints(locations){
    if(!locations) { alert('No Events Found!'); return; }
    // Show map after users presses submit
    if(!map) {
        document.getElementById('hideMap').style.display = 'block'; 
        initMap(); 
    }
    // Clear all previous markers existing on the map
    if(markerArr){
        for (var i = 0; i < markerArr.length; i++ ) {
            markerArr[i].setMap(null);
        }
        markerArr = []
    }
    map.panTo(new google.maps.LatLng(JSON.parse(Object.keys(locations)[0])['latitude'], JSON.parse(Object.keys(locations)[0])['longitude'] ))
	var infowindow = new google.maps.InfoWindow({
		maxWidth: 300
	})
	Object.keys(locations).forEach(k => {
		coords = JSON.parse(k)
		var contentString = '';
		locations[k].forEach(eventObj =>{
			contentString += '<li><p><a target="_blank" href=' + eventObj['url'] + '>' + eventObj['eventName'] + ' - ' + eventObj['dateTime'] + '</a></p></li>'
		})
        var eventChecker = (locations[k].length == 1 ? "Event Found at " : "Events Found at ")
		var marker = new google.maps.Marker({
	        position: new google.maps.LatLng(coords['latitude'], coords['longitude']),
	        title: locations[k].length.toString() + ' ' + eventChecker + locations[k][0]['venue'],
	        map: map,
    	});
        markerArr.push(marker)
    	marker.addListener('click', function() {
    		infowindow.setContent("<div class='title'>" + eventChecker + locations[k][0]['venue'] + ":</div>" + '<ol>' + contentString + '</ol>')
			infowindow.open(map, marker);
		});
	})
	map.addListener('click', function() {
		infowindow.close();
	})
}


$(document).ready(function() {
});