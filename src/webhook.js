'use strict';

const fetch = require('node-fetch');

module.exports = function (webhookUrl, webhookMethod) {
	const request = async videoUrl => {
		const response = await fetch(webhookUrl, {
			method: webhookMethod,
			body: JSON.stringify({ url: videoUrl }),
			headers: { 'Content-Type': 'application/json' },
		});
		return await response.text();
	};

	return {
		request,
	};
};
