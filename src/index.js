'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const router = express.Router();

const s3 = require('./s3')(
	process.env.AWS_ACCESS_KEY_ID,
	process.env.AWS_SECRET_ACCESS_KEY,
	process.env.AWS_REGION,
	process.env.INPUT_S3_BUCKET,
	process.env.OUTPUT_S3_BUCKET,
	process.env.INPUT_FOLDER_PATH,
	process.env.OUTPUT_S3_PATH
);

const ffmpeg = require('./ffmpeg')(process.env.OUTPUT_FOLDER_PATH);

const log = o => {
	console.log(new Date().toISOString(), o);
	return o;
};

router.route('/process').get((req, res) => {
	if (!req.query.s3url) {
		return res.status(400).end();
	}
	// Send response to server before processing the file
	res.status(200).end();

	// Process the file
	Promise.resolve(req.query.s3url)
		.then(log)
		.then(inputS3URL => s3.download(inputS3URL))
		.then(log)
		.then(inputFileLocation => ffmpeg.processVideo(inputFileLocation))
		.then(log)
		.then(outputFileLocation => s3.upload(outputFileLocation))
		.then(log)
		.then(outputS3URL =>
			console.log(`Input S3 URL  - ${req.query.s3url}\nOutput S3 URL - ${outputS3URL}\n`)
		)
		.catch(console.error);
});

app.use('/api/v1', router);
app.listen(parseInt(process.env.PORT), () => console.log('Started'));
