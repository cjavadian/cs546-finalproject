const express = require("express");
const router = express.Router();
var mid = require('../middleware/validateMapForm');

router.post("/", async (req, res) =>{
	try{
		console.log(req.body)
		// req.body['saved'] = !req.body['saved']
		res.json('done')
	}catch(e){
		console.log(e)
	}
});

module.exports = router;