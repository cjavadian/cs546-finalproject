const express = require("express");
const router = express.Router();
var path = require('path');
var request = require('request-promise');
var moment = require('moment');
var geohash = require('ngeohash');
var mid = require('../middleware/validateMapForm');
var config = require('../config/dev');

router.get("/", async (req, res) => {
	res.render('map')
});

router.post("/", mid.validateMapForm, async (req, res) =>{
	try{
		var payload = {}
		var warnings = {}
		//Make request to googlemaps geocoding api to get lat lng from a zip code
		var requestURL = 'https://maps.googleapis.com/maps/api/geocode/json'
		var queryParameters = { key: config.google.PLACES_API_KEY, 
								address: req.body['Payload']['postalCode'] };
		var googlePlacesResponse = await request({url: requestURL, qs: queryParameters})
		googlePlacesResponse = JSON.parse(googlePlacesResponse)
		var centerLat = googlePlacesResponse['results'][0]['geometry']['location']['lat']
		var centerLng = googlePlacesResponse['results'][0]['geometry']['location']['lng']

		//convert lat lng to geohash
		var geohashFromLatLng = geohash.encode(centerLat , centerLng, 9)

		//make request to ticketmaster api to retrieve events
		requestURL = 'https://app.ticketmaster.com/discovery/v2/events'
		queryParameters = { apikey: config.ticketMaster.API_KEY, 
							geoPoint: geohashFromLatLng,
							radius: req.body['Payload']['radius'],
							unit: req.body['Payload']['unit'],
							startDateTime: req.body['Payload']['startDateTime'], 
							endDateTime: req.body['Payload']['endDateTime'], 
							size: '200' };
		var response = await request({url: requestURL, qs: queryParameters, timeout: 5000})
		response = JSON.parse(response)
		// if rate limit was exceeding, create a warning to show the user
		if(response['page']['totalElements'] >= 1000) warnings['rateLimit'] = 'API Limits Exceeded: Only the first 1000 events are shown'

		//if events were found, take the data we need and format it
		if(response['page']['totalElements'] > 0){
			var resEvents = response['_embedded']['events']
			// loop through all pages in the request
			while(response["_links"]['next'] && response['page']['number'] < 4) {
				requestURL = "https://app.ticketmaster.com" + response['_links']['next']['href']
				queryParameters = {apikey: config.ticketMaster.API_KEY}
				response = await request({url: requestURL, qs: queryParameters, timeout: 5000})
				response = JSON.parse(response)
				// append new events onto original array of events
				Array.prototype.push.apply(resEvents, response['_embedded']['events'])
			}
			// loop through each event found in the ticket master response
			resEvents.forEach(function(e){
				// create an object with all the event details we want
				var eventObj = {}
				eventObj['url'] = e['url']
				eventObj['eventName'] = e['name']
				eventObj['venue'] = e['_embedded']['venues'][0]['name']
				eventObj['dateTime'] = moment(e['dates']['start']['dateTime'], moment.ISO_8601).format('MMMM Do YYYY, h:mm a')
				if(eventObj['dateTime'] === 'Invalid date') eventObj['dateTime'] = 'Check website for times'
				if (payload.hasOwnProperty(JSON.stringify(e['_embedded']['venues'][0]['location']))) {
					payload[JSON.stringify(e['_embedded']['venues'][0]['location'])].push(eventObj)
				} else{
					payload[JSON.stringify(e['_embedded']['venues'][0]['location'])] = [eventObj];
				}
			})
			payload = sortEvents(payload)
			var result = {"locations": payload, "center": {"lat": centerLat, "lng": centerLng}, "warnings": warnings}
			//send data to front end via AJAX 
			res.send({'Result': result})
			// console.log(payload)
		}else{
			payload['Error'] = 'No Events Found'
			res.status(404).send({'Result': payload})
		}
	}catch(e){
		console.log(e)
		payload['Error'] = 'Unexpected Error Occured'
		res.status(500).send({'Result': payload})
	}
});

function sortEvents(unsortedPayload){
	var sortedPayload = {}
	Object.keys(unsortedPayload).forEach(location => {
	sortedPayload[location] = unsortedPayload[location].sort((a, b) => {
			return moment(a['dateTime'], 'MMMM Do YYYY, h:mm a').diff(moment(b['dateTime'], 'MMMM Do YYYY, h:mm a'))
		});
	});
	return sortedPayload

	// return eventArray.sort((a, b) => {
	// 	return moment.parse(a['dateTime'], 'MMMM Do YYYY, h:mm a').diff(moment.parse(b['dateTime'], 'MMMM Do YYYY, h:mm a'))
	// })
}

module.exports = router;