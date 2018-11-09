const express = require("express");
const app = express();
const configRoutes = require("./routes/index");

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");

	if (process && process.send) process.send({done: true}); // ADD THIS LINE
});