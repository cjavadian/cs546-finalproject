const express = require("express");
const router = express.Router();
const Events = require("../data").events
const Users = require("../data").users
const moment = require("moment");

// get shared events info - need to attach users to events also
async function getSharedEventInfo(sharedEvents) {
    const eventIDs = sharedEvents.map(e => e.eventID);

    let events = await Events.getEventsByIDs(eventIDs);

    console.log(events);
    sharedEvents.forEach(saved => {
        let eventIndex = events.findIndex(e => e._id === saved.eventID);

        if (!events[eventIndex].users) {
            events[eventIndex].users = [saved.username];
        } else {
            events[eventIndex].users.push(saved.username)
        }
    })

    console.log(events);
    return events;
}

function formatDates(events) {
    events.forEach(e => {
        const formattedDate = moment(e.dateTime).format('MMMM Do YYYY, h:mm a');
        if (e === "Invalid Date") {
            e.dateTime = "Check website for times";
        } else {
            e.dateTime = formattedDate;
        }
    })

    return events;
}

router.get("/", async (req, res) => {
    try {
        let savedEvents = await Events.getEventsByIDs(req.authedUser.savedEvents);
        let sharedEvents = await getSharedEventInfo(req.authedUser.sharedEvents);

        savedEvents = formatDates(savedEvents);
        sharedEvents = formatDates(sharedEvents);

        res.render("profile", {savedEvents: savedEvents, sharedEvents: sharedEvents});
    } catch (e) {
        console.log(e);
        res.render("profile", {error: "Could not retrieve saved/shared events"})
    }
})

router.post("/save", async (req, res) =>{
    try{
        // make a new object unless i find a better way to rename
        // and remove fields
        let eventToSave = {
            _id: req.body.id,
            url: req.body.url,
            eventName: req.body.eventName,
            venue: req.body.venue,
            dateTime:  moment(req.body.dateTime, "MMMM Do YYYY, h:mm a").toDate(),
            type: req.body.type,
            location: req.body.location
        }

        // save event and add to user's saved event list
        const savedEvent = await Events.saveEvent(eventToSave);
        await Users.saveEvent(req.authedUser._id, savedEvent._id);
        res.json('done')
    }catch(e){
        console.log(e)
        res.status(500).json("An unexpected error occurred");
    }
});

router.post("/unsave", async (req, res) =>{
    try{
        // Remove the event from the user's saved list. We aren't removing
        // the event from the DB because other users can still have that event saved
        await Users.unsaveEvent(req.authedUser._id, req.body.id);
        res.json('done')
    }catch(e){
        console.log(e);
        res.status(500).json("An unexpected error occurred");
    }
});

router.post("/share", async (req, res) => {
    try {
        // share the event
        await Users.shareEvent(req.authedUser.username, req.body.toUser, req.body.eventID);
        res.json("done");
    } catch (e) {
        // send userful error text
        if (e === "Error: No user found") {
            return res.status(404).json("No user found");
        } else if (e === "Error: Can't share with yourself") {
            return res.status(403).json("You can't share with yourself");
        }
        console.log(e);
        return res.status(500).json("An unexpected error occurred");
    }
});

router.post("/unshare", async (req, res) => {
    try {
        await Users.removeSharedEvent(req.authedUser._id, req.body.eventID, req.body.username);
        res.json("done");
    } catch (e) {
        console.log(e);
        return res.status(500).json("An unexpected error occurred");
    }
})

module.exports = router;