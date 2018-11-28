const mainRoutes = require("./main");
const saveRoutes = require("./save");
const unsaveRoutes = require("./unsave");
const authRoutes = require("./auth");

const constructorMethod = app => {
    app.use("/", mainRoutes);
	app.use("/save", saveRoutes);
	app.use("/unsave", unsaveRoutes);
    app.use("/auth", authRoutes);

  	app.use("*", (req, res) => {
    	res.status(404).json({ error: "Not found" });
  	});
};

module.exports = constructorMethod;