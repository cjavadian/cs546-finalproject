const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require("express-handlebars");
const mainRoutes = require("./main");

const constructorMethod = app => {
	app.engine('hbs', exphbs({extname: 'hbs'}));
	app.set('view engine', 'hbs');
	app.use('/public', express.static(__dirname + '/../public'));
	app.use(cookieParser());
	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
	app.use("/", mainRoutes);

  	app.use("*", (req, res) => {
    	res.status(404).json({ error: "Not found" });
  	});
};

module.exports = constructorMethod;