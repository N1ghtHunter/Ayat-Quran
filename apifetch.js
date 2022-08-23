const request = require("request");
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let options = { json: true };

async function getNames() {
	try {
		const { data } = await axios.get("http://api.alquran.cloud/v1/surah");
		return data;
	} catch (err) {
		console.log(err);
	}
}
module.exports = getNames;
// names.then((res) => {
// 	console.log(res.data);
// 	module.exports = res.data;
// });
// exports.names = names;
// const suarhNames = request("http://api.alquran.cloud/v1/surah", options, (err, response, body) => {
// 	if (body) {
// 		// console.log(body.data);
// 		return body.data;
// 	} else {
// 		console.log("Something broke!");
// 	}
// });
//module.exports = suarhNames;
// getRequests(url, options)
// 	.then((d) => {
// 		firstData = d;
// 		return getRequests("http://api.alquran.cloud/v1/surah", options);
// 	})
// 	.then((d) => {
// 		secData = d;
// 	})
// 	.finally(() => {
// 		res.send(secData);
// 	});
// function getRequests(url, options) {
// 	return new Promise((resolve, reject) => {
// 		request(url, options, (err, response, data) => {
// 			if (err) {
// 				reject(err);
// 			}
// 			resolve(data);
// 		});
// 	});
// }
