const express = require("express");
const { write } = require("fs");
const https = require("https");
const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const app = express();
const fs = require("fs");
const request = require("request");
// const fetch = require("node-fetch");
// var encoding = require('encoding-japanese');
// var fileBuffer = fs.readFileSync('app.js');
// console.log(encoding.detect(fileBuffer))
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
//Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
	const randomAyah = Math.floor(Math.random() * 6232) + 1;
	const url = "https://api.alquran.cloud/v1/ayah/" + randomAyah + "/editions/quran-uthmani,en.asad,en.pickthall,ar.muyassar,ar.alafasy";
	let options = { json: true };
	request(url, options, (error, response, body) => {
		if (error) {
			return console.log(error);
		}

		if (!error && res.statusCode == 200) {
			// do something with JSON, using the 'body' variable
			const ayahText = body.data[0].text;
			const ayahNum = body.data[1].numberInSurah;
			const surah = body.data[1].surah.name;
			const juz = body.data[1].juz;
			const pageNum = body.data[1].page;
			const tafsirText = body.data[3].text;
			const audio = body.data[4].audio;
			res.render("home", {
				ayahText: ayahText,
				ayahNumber: ayahNum,
				surah: surah,
				juz: juz,
				pageNumber: pageNum,
				tafsir: tafsirText,
				audio: audio,
			});
		}
	});
	// let ayahText = quranData.data[0].text;
	// res.render("home", { ayahText: ayahText });
	// https.get(url, function (response) {
	// 	res.on("data", function (data) {
	// 		const quranData = JSON.parse(data);
	// 		const ayahText = quranData.data[0].text;
	// 		console.log(ayahText);
	// 		const surah = quranData.data[1].surah.name;
	// 		const ayahNum = quranData.data[1].numberInSurah;
	// 		const juz = quranData.data[1].juz;
	// 		const pageNum = data[1].page;
	// 		res.render("home", { ayahText: ayahText });
	// 	});
	// });
});
// app.post("/", function (req, res) {
// 	// https.get(url, function (response) {
// 	// 	console.log(response.statusCode);
// 	// 	response.on("data", function (data) {
// 	// 		res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
// 	// 		res.write(" <p>" + ayahText + "</p>", "utf-8");
// 	// 		res.send();
// 	// 	});
// 	// });
// });

app.listen(process.env.PORT || 3000, function () {
	console.log("server is running ON Port 3000");
});
