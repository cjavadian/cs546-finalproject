const express = require("express");
const router = express.Router();
const Events = require("../data").events
const Users = require("../data").users


router.get("/", async (req, res) => {
    try {
        const savedEvents = await Events.getEventsByIDs(req.authedUser.savedEvents);
        console.log(savedEvents);
        res.render("profile", {savedEvents: savedEvents});
    } catch (e) {
        console.log(e);
        res.render("profile", {error: "Could not retrieve saved/shared events"})
    }
})

router.post("/save", async (req, res) =>{
    try{
        console.log(req.body)
        // make a new object unless i find a better way to rename
        // and remove fields
        let eventToSave = {
            _id: req.body.id,
            url: req.body.url,
            eventName: req.body.eventName,
            venue: req.body.venue,
            dateTime: req.body.dateTime
        }

        // save event and add to user's saved event list
        const savedEvent = await Events.saveEvent(eventToSave);
        await Users.saveEvent(req.authedUser._id, savedEvent._id);
        res.json('done')
    }catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.post("/unsave", async (req, res) =>{
    try{
        console.log(req.body)
        // Should we switch this to use Events.findEventByID?
        // Remove the event from the user's saved list. We aren't removing
        // the event from the DB because other users can still have that event saved
        await Users.unsaveEvent(req.authedUser._id, req.body.id);
        res.json('done')
    }catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

module.exports = router;