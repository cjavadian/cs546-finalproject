var map;

var locations = { '{"longitude":"-73.9884469","latitude":"40.734917"}': 
   [ 'http://concerts.livenation.com/event/000054CCE2606B95',
     'http://concerts.livenation.com/event/00005510EB8FE5E0',
     'http://concerts.livenation.com/event/00005507B4EC8A05',
     'http://concerts.livenation.com/event/00005527D1A9FAD8' ],
  '{"longitude":"-73.987498","latitude":"40.728188"}': 
   [ 'https://www.ticketmaster.com/stomp-ny-new-york-new-york-11-09-2018/event/3000532CE74A2592',
     'https://www.ticketmaster.com/stomp-ny-new-york-new-york-11-08-2018/event/3000532CE7462590',
     'https://www.ticketmaster.com/stomp-ny-new-york-new-york-11-07-2018/event/3000532CE742258C',
     'https://www.ticketmaster.com/stomp-ny-new-york-new-york-11-11-2018/event/3000532CE85B2631',
     'https://www.ticketmaster.com/stomp-ny-new-york-new-york-11-10-2018/event/3000532CE74E2594',
     'https://www.ticketmaster.com/stomp-ny-new-york-new-york-11-11-2018/event/3000532CE7F925FC' ],
  '{"longitude":"-73.99179455","latitude":"40.72922383"}': 
   [ 'https://www.ticketmaster.com/blue-man-group-at-the-astor-new-york-new-york-11-10-2018/event/0300542CDA0C3FF9',
     'https://www.ticketmaster.com/blue-man-group-at-the-astor-new-york-new-york-11-10-2018/event/0300542CDB284088',
     'https://www.ticketmaster.com/blue-man-group-at-the-astor-new-york-new-york-11-08-2018/event/0300542CDDBD4621',
     'https://www.ticketmaster.com/blue-man-group-at-the-astor-new-york-new-york-11-10-2018/event/0300542CDA8F4033',
     'https://www.ticketmaster.com/blue-man-group-at-the-astor-new-york-new-york-11-11-2018/event/0300542CDBDB40FB',
     'https://www.ticketmaster.com/blue-man-group-at-the-astor-new-york-new-york-11-11-2018/event/0300542CDB2E408C',
     'https://www.ticketmaster.com/blue-man-group-at-the-astor-new-york-new-york-11-07-2018/event/0300542CDDB54619' ],
  '{"longitude":"-73.989098","latitude":"40.731602"}': 
   [ 'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2441786',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2433322',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2441787',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2415959',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2415938',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2436927',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2441785',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2441784',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2441782',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2437848',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2506686',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2415937',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2415957',
     'http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=2415958' ],
  '{"longitude":"-73.989443","latitude":"40.735318"}': 
   [ 'https://www.ticketmaster.com/gloria-a-life-new-york-new-york-11-10-2018/event/300054CCF22548F1',
     'https://www.ticketmaster.com/gloria-a-life-new-york-new-york-11-07-2018/event/300054CCF04047EE',
     'https://www.ticketmaster.com/gloria-a-life-new-york-new-york-11-11-2018/event/300054CCF1464870',
     'https://www.ticketmaster.com/gloria-a-life-new-york-new-york-11-07-2018/event/300054CCF21C48ED',
     'https://www.ticketmaster.com/gloria-a-life-new-york-new-york-11-09-2018/event/300054CCF04747F0',
     'https://www.ticketmaster.com/gloria-a-life-new-york-new-york-11-10-2018/event/300054CCF04F47F3' ] }

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.7589, lng: -73.9851},
		zoom: 13
	});

	getPoints();
}

function getPoints(){
	var infowindow = new google.maps.InfoWindow({
		maxWidth: 300
	})
	Object.keys(locations).forEach(k => {
		coords = JSON.parse(k)
		var contentString = '';
		locations[k].forEach(eventURL =>{
			contentString += '<li><p><a href=' + eventURL + '>' + eventURL +'</a></p></li>'
		})
		// var infowindow = new google.maps.InfoWindow({
	 //        content: "<h2>Events at this location</h2>" + '<ol>' + contentString + '</ol>'
	 //    });
		var marker = new google.maps.Marker({
	        position: new google.maps.LatLng(coords['latitude'], coords['longitude']),
	        title: String(locations[k].length) + ' Events Found',
	        map: map,
    	});
    	marker.addListener('click', function() {
    		infowindow.setContent("<h2>Events at this location</h2>" + '<ol>' + contentString + '</ol>')
			infowindow.open(map, marker);
		});
	})
	map.addListener('click', function() {
		infowindow.close();
	})
	// for (point in locations){
	// 	// dataPoints[point] = {location: new google.maps.LatLng(	locations[point][Object.keys(locations[point])[0]]['latitude'],
	// 	//  														locations[point][Object.keys(locations[point])[0]]['longitude'])}

	// 	marker = new google.maps.Marker({
	//         position: new google.maps.LatLng(	locations[point][Object.keys(locations[point])[0]]['latitude'],
	//         									locations[point][Object.keys(locations[point])[0]]['longitude']),
	//         title: String(Object.keys(locations[point])[0]),
	//         map: map,
 //    	});
}


$(document).ready(function() {
});