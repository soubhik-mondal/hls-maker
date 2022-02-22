'use strict';

const AWS = require('aws-sdk');
const fs = require('fs').promises;

module.exports = function (
	inBucket,
	outBucket,
	folderInPath,
	s3OutPath
) {
	const S3 = new AWS.S3();

	// S3 URL should point to a single object, not a folder
	const download = inputS3URL =>
		S3.getObject({
			Bucket: inBucket,
			Key: inputS3URL,
		})
			.promise()
			.then(({ Body }) =>
				fs.writeFile(`${folderInPath}/${inputS3URL.split('/').reverse()[0]}`, Body)
			)
			.then(() => `${folderInPath}/${inputS3URL.split('/').reverse()[0]}`);

	// folderPath should point to a folder containing only
	// files, not a file or folder containing folders or links
	//
	// dont add trailing slash
	const upload = folderPath =>
		fs
			.readdir(folderPath)
			.then(fileList =>
				Promise.all(
					fileList.map(file =>
						fs.readFile(`${folderPath}/${file}`).then(body =>
							S3.putObject({
								Bucket: outBucket,
								Key: `${s3OutPath}/${folderPath.split('/').reverse()[0]}/${file}`,
								Body: body,
							}).promise()
						)
					)
				)
			)
			.then(() => `${s3OutPath}/${folderPath.split('/').reverse()[0]}/master.m3u8`);

	return {
		download,
		upload,
	};
};
