const express = require("express");
const router = express.Router();
var path = require('path');
var request = require('request-promise');
var moment = require('moment');


router.get("/", async (req, res) => {

	var test = 'https://app.ticketmaster.com/discovery/v2/events?apikey=2fy7Z6sBixoc7pkl5aPzRL4AVWNVmtyF&postalCode=10003&startDateTime=2018-11-08T23:06:00Z&endDateTime=2018-11-13T23:06:00Z&size=200&countryCode=US'
	var requestURL = 'https://app.ticketmaster.com/discovery/v2/events'
	var queryParameters = { apikey:'2fy7Z6sBixoc7pkl5aPzRL4AVWNVmtyF', radius: '20', unit: 'miles', geoPoint: 'dr5rsqgm', startdateTime: '2018-11-08T23:06:00Z', endDateTime: '2018-11-13T23:06:00Z', size: '200' };
	var locations = []
	try{
		var response = await request({url: requestURL, qs: queryParameters})
		// console.log(response)
		response = JSON.parse(response)
		var resEvents = response['_embedded']['events']
		var payload = {}
		resEvents.forEach(function(e){
			var eventObj = {}
			eventObj['url'] = e['url']
			eventObj['eventName'] = e['name']
			eventObj['venue'] = e['_embedded']['venues'][0]['name']
			eventObj['dateTime'] = moment(new Date(e['dates']['start']['dateTime'])).format('MMMM Do YYYY, h:mm a')
			if (payload.hasOwnProperty(JSON.stringify(e['_embedded']['venues'][0]['location']))) {
				payload[JSON.stringify(e['_embedded']['venues'][0]['location'])].push(eventObj)
			} else {
				payload[JSON.stringify(e['_embedded']['venues'][0]['location'])] = [eventObj];
			}
		})
		console.log(payload)
	}catch(e){
		console.log(e)
	}
		
	res.render('map')
});

module.exports = router;