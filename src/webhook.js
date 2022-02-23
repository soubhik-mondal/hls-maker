'use strict';

const fetch = require('node-fetch');

module.exports = function (url, method) {
	const request = async body => {
		const response = await fetch(url, {
			method,
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});
		return await response.text();
	};

	return {
		request,
	};
};
