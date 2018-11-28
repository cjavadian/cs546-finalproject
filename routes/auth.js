const express = require("express");
const router = express.Router();

router.get("/login", async (req, res) => {
    res.render('login')
});

router.get("/signup", async (req, res) => {
    res.render('signup')
});

router.post("/signup" async (req, res) => {
    
})
module.exports = router;