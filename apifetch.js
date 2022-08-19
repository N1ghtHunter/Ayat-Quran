const request = require("request");
let options = { json: true };
getRequests(url, options)
	.then((d) => {
		firstData = d;
		return getRequests("http://api.alquran.cloud/v1/surah", options);
	})
	.then((d) => {
		secData = d;
	})
	.finally(() => {
		res.send(secData);
	});
function getRequests(url, options) {
	return new Promise((resolve, reject) => {
		request(url, options, (err, response, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
}
