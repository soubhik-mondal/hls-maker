'use strict';

if (!process.env._HANDLER) {
	require('dotenv').config();
}

const s3 = require('./s3')(
	process.env.INPUT_S3_BUCKET,
	process.env.OUTPUT_S3_BUCKET,
	process.env.INPUT_FOLDER_PATH,
	process.env.OUTPUT_S3_PATH
);

const ffmpeg = require('./ffmpeg')(process.env.OUTPUT_FOLDER_PATH);

exports.handler = async event => {
	console.log(new Date().toISOString(), 'event', event.Records[0]);
	
	let inputFileLocation = await s3.download(event.Records[0].body);
	console.log(new Date().toISOString(), 'inputFileLocation', inputFileLocation);
	
	let outputFileLocation = await ffmpeg.processVideo(inputFileLocation);
	console.log(new Date().toISOString(), 'outputFileLocation', outputFileLocation);
	
	let outputS3URL = await s3.upload(outputFileLocation);
	console.log(new Date().toISOString(), 'outputS3URL', outputS3URL);
};
