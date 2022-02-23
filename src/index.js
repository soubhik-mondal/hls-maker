'use strict';

const s3 = require('./s3')(
	process.env.INPUT_S3_BUCKET,
	process.env.OUTPUT_S3_BUCKET,
	process.env.INPUT_FOLDER_PATH,
	process.env.OUTPUT_S3_PATH
);

const ffmpeg = require('./ffmpeg')(process.env.OUTPUT_FOLDER_PATH);

const webhook = require('./webhook')(
	process.env.WEBHOOK_URL,
	process.env.WEBHOOK_METHOD
);

exports.handler = async event => {
	console.log(new Date().toISOString(), 'event', event.Records[0]);

	let inputFileLocation = await s3.download(event.Records[0].body);
	console.log(new Date().toISOString(), 'inputFileLocation', inputFileLocation);

	let outputFileLocation = await ffmpeg.processVideo(inputFileLocation);
	console.log(new Date().toISOString(), 'outputFileLocation', outputFileLocation);

	let outputS3URL = await s3.upload(outputFileLocation);
	console.log(new Date().toISOString(), 'outputS3URL', outputS3URL);

	let response = await webhook.request(outputS3URL);
	console.log(new Date().toISOString(), 'response', response);
};
