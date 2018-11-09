const express = require("express");
const router = express.Router();
var path = require('path');
var request = require('request-promise');


router.get("/", async (req, res) => {

	var test = 'https://app.ticketmaster.com/discovery/v2/events?apikey=2fy7Z6sBixoc7pkl5aPzRL4AVWNVmtyF&postalCode=10003&startDateTime=2018-11-08T23:06:00Z&endDateTime=2018-11-13T23:06:00Z&size=200&countryCode=US'
	var requestURL = 'https://app.ticketmaster.com/discovery/v2/events'
	var queryParameters = { apikey:'2fy7Z6sBixoc7pkl5aPzRL4AVWNVmtyF', postalCode: '10003', startdateTime: '2018-11-08T23:06:00Z', endDateTime: '2018-11-13T23:06:00Z', size: '200' };
	var locations = []
	try{
		var response = await request({url: requestURL, qs: queryParameters})
		// console.log(response)
		response = JSON.parse(response)
		var resEvents = response['_embedded']['events']
		var i = 0;
		// resEvents.forEach(function(e){
		// 	i +=1
		// 	var point = {}
		// 	// prevLat = e['_embedded']['venues'][0]['location']['latitute']
		// 	// prevLon = e['_embedded']['venues'][0]['location']['longitute']

		// 	point[e.id] =  e['_embedded']['venues'][0]['location']
		// 	locations.push(point)
		// })
		
		var test = {}
		resEvents.forEach(function(e){
			// i +=1
			// var point = {}
			// prevLat = e['_embedded']['venues'][0]['location']['latitute']
			// prevLon = e['_embedded']['venues'][0]['location']['longitute']
			
			if (test.hasOwnProperty(JSON.stringify(e['_embedded']['venues'][0]['location']))) {
				test[JSON.stringify(e['_embedded']['venues'][0]['location'])].push(e['url'])
			} else {
				test[JSON.stringify(e['_embedded']['venues'][0]['location'])] = [];
			}
			//point[e.id] =  e['_embedded']['venues'][0]['location']
			//locations.push(point)
		})
		console.log(test)
	}catch(e){
		console.log(e)
	}
		
	res.render('map')
});

module.exports = router;