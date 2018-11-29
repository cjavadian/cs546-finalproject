const express = require("express");
const router = express.Router();
var mid = require('../middleware/validateMapForm');


router.get("/", async (req, res) => {
    res.render("profile");
})

router.post("/profile/save", async (req, res) =>{
    try{
        console.log(req.body)
        // req.body['saved'] = !req.body['saved']
        res.json('done')
    }catch(e){
        console.log(e)
    }
});

router.post("/profile/unsave", async (req, res) =>{
    try{
        console.log(req.body)
        // req.body['saved'] = !req.body['saved']
        res.json('done')
    }catch(e){
        console.log(e)
    }
});

module.exports = router;