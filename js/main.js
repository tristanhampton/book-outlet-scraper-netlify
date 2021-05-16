const options = {
	method: "POST",
	headers: {
		"Content-Type": "application/json; charset=utf-8"
	},
	body: JSON.stringify({
		pageToScreenshot: "https://bitsofco.de"
	})
};

fetch("/.netlify/functions/take-screenshot", options);