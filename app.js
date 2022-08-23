const express = require("express");
const { write } = require("fs");
const https = require("https");
const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const app = express();
const fs = require("fs");
const request = require("request");
var path = require("path");
const { url } = require("inspector");
const ejsLint = require("ejs-lint");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
//Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, "public"))); //  "public" off of current is root

app.get("/", function (req, res, next) {
	var context = req.cookies["context"];
	var url;
	res.clearCookie("context", { httpOnly: true });
	if (context) {
		url =
			"https://api.alquran.cloud/v1/ayah/" +
			context +
			"/editions/quran-uthmani,en.asad,en.pickthall,ar.muyassar,ar.alafasy";
	} else {
		const randomAyah = Math.floor(Math.random() * 6232) + 1;
		url =
			"https://api.alquran.cloud/v1/ayah/" +
			randomAyah +
			"/editions/quran-uthmani,en.asad,en.pickthall,ar.muyassar,ar.alafasy";
	}
	let options = { json: true };
	request(url, options, (error, response, body) => {
		if (error || body.code != 200) {
			console.log(error);
			next(error);
		}
		if (!error && res.statusCode == 200) {
			// do something with JSON, using the 'body' variable
			const ayahText = body.data[0].text;
			const ayahNumber = body.data[1].numberInSurah;
			const surah = body.data[1].surah.name;
			const juz = body.data[1].juz;
			const pageNumber = body.data[1].page;
			const tafsir = body.data[3].text;
			const audio = body.data[4].audio;
			surahLinks().then((surahLinks) => {
				res.render("home", {
					ayahText,
					ayahNumber,
					surah,
					juz,
					pageNumber,
					tafsir,
					audio,
					surahLinks: surahLinks.data,
				});
			});
		}
	});
});
app.post("/", (req, res) => {
	let chosenAyah = req.body.ayahNumber;
	res.cookie("context", chosenAyah, { httpOnly: true });
	res.redirect("/");
});
app.get("/surah/:choosenSurah", (req, res, next) => {
	let choosenSurah = req.params.choosenSurah.trim();
	let url = `https://api.alquran.cloud/v1/surah/${choosenSurah}/editions/quran-uthmani,ar.muyassar,ar.alafasy`;
	let options = { json: true };
	request(url, options, (error, response, body) => {
		if (error || body.code != 200) {
			console.log(body.data[0]);
			next(body.data[0]);
		}
		if (!error && res.statusCode == 200) {
			const surahArray = body.data[0].ayahs;
			const surahText = surahArray?.map((i) => {
				return i.text;
			});
			const surah = body.data[0].name;
			const juz = body.data[0].ayahs[0].juz;
			const numberInQuran = body.data[0].number;
			const tafsirArray = body.data[1].ayahs;
			const tafsir = tafsirArray?.map(function (i) {
				return i.text;
			});
			const numberOfAyahs = body.data[2].numberOfAyahs;
			const audioObject = body.data[2].ayahs;
			const audioArray = audioObject?.map((i) => {
				return i.audio;
			});
			surahLinks().then((surahLinks) => {
				res.render("surah", {
					surahText,
					surah,
					juz,
					numberInQuran,
					tafsir,
					audioArray,
					surahLinks: surahLinks.data,
					numberOfAyahs,
				});
			});
		}
	});
});
app.post("/search", async (req, res, next) => {
	const searchQuery = req.body.searchQuery;
	let url = `http://api.alquran.cloud/v1/search/${searchQuery}/all/quran-simple-clean`;
	url = encodeURI(url);
	const options = { json: true };
	await request(url, options, (error, response, body) => {
		if (error) {
			console.log(error);
			next(error);
		}
		if (!error && res.statusCode == 200) {
			if (body) {
				const { count, matches } = body.data;
				surahLinks().then((surahLinks) => {
					res.render("search", { matches, surahLinks: surahLinks.data });
				});
			} else {
				res.redirect("/");
			}
		}
	});
});
var surahLinks = require("./apifetch");
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});
// error handlers - these take err object.
// these are per request error handlers.  They have two so in dev
// you get a full stack trace.  In prod, first is never setup

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		surahLinks().then((surahLinks) => {
			console.log(err);
			res.render("error", { surahLinks: surahLinks.data, error: err });
		});
	});
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	surahLinks().then((surahLinks) => {
		console.log(err);
		res.render("error", { surahLinks: surahLinks.data, error: err });
	});
});
app.listen(process.env.PORT || 3000, function () {
	console.log("server is running ON Port 3000");
});
