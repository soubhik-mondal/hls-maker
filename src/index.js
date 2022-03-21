'use strict';

// require('dotenv').config();

const s3 = require('./s3')(
	process.env.INPUT_S3_BUCKET,
	process.env.OUTPUT_S3_BUCKET,
	process.env.INPUT_FOLDER_PATH,
	process.env.OUTPUT_S3_PATH
);

const ffmpeg = require('./ffmpeg')(process.env.OUTPUT_FOLDER_PATH);

const webhook = require('./webhook')(process.env.WEBHOOK_URL, process.env.WEBHOOK_METHOD);

exports.handler = async event => {
	console.log('event', event.Records[0]);

	let inputFileLocation = null;
	try {
		inputFileLocation = await s3.download(event.Records[0].body);
	} catch (e) {
		if (e.name === 'NoSuchKey') { // File doesn't exist on S3
			console.log('ERROR', e.name, e.message, event.Records[0].body);
			return;
		} else {
			throw e;
		}
	}
	console.log('inputFileLocation', inputFileLocation);

	let fsStatOutput = null;
	try {
		fsStatOutput = await fs.stat(inputFileLocation);
	} catch (e) {
		if (e.message.startsWith('ENOENT')) { // File failed to download
			console.log('ERROR', e.name, e.message, event.Records[0].body);
			return;
		} else {
			throw e;
		}
	}
	if (fsStatOutput.size === 0) { // File is empty
		console.log('ERROR', 'File is empty', event.Records[0].body);
		return;
	}

	let outputFileLocation = await ffmpeg.processVideo(inputFileLocation);
	console.log('outputFileLocation', outputFileLocation);

	// let outputFileLocation = '/tmp/out/5fbb4c73-5d3c-44de-9cba-9a7c32e1a222';

	let outputS3URL = await s3.upload(outputFileLocation); // test/videos/5fbb4c73-5d3c-44de-9cba-9a7c32e1a222/master.m3u8
	console.log('outputS3URL', outputS3URL);

	let responseWebhook = await webhook.request(outputS3URL);
	console.log('responseWebhook', responseWebhook);
};

// exports.handler({
// 	Records: [
// 		{
// 			body: 'test/uploads/5fbb4c73-5d3c-44de-9cba-9a7c32e1a222'
// 		}
// 	]
// });
