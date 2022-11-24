require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/route");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", router);

app.use(express.static(path.join(__dirname, "./build")));
app.use("*", (req, res) => {
	res.sendFile(path.join(__dirname, "./build/index.html"));
});

app.listen(process.env.PORT, function () {
	console.log("app is working...");
});
