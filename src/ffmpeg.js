'use strict';

const exec = require('util').promisify(require('child_process').exec);

const ffmpegParams = require('./ffmpeg-params')();

function ratio(w, h) {
	let n = h;
	while (n > 1) {
		if (w % n === 0 && h % n === 0) {
			w /= n;
			h /= n;
		}
		n--;
	}
	return `${w}:${h}`;
}

module.exports = function (outputPath) {
	const ffprobe = path =>
		exec(
			`/opt/bin/ffprobe -hide_banner -v panic -print_format json -show_streams -select_streams v:0 ${path}`
		).then(output => (output.stderr ? Promise.reject(output.stderr) : JSON.parse(output.stdout)));

	const extractSimplify = metadata => {
		if (!metadata.streams) {
			return Promise.reject('No streams found');
		}
		if (!metadata.streams.length) {
			return Promise.reject('Stream is empty');
		}
		// console.log(JSON.stringify(metadata.streams[0], null, 2));
		let output = {};
		output.width = metadata.streams[0].width;
		output.height = metadata.streams[0].height;
		output.rotate =
			(metadata.streams[0].tags.hasOwnProperty('rotate') && metadata.streams[0].tags.rotate) ||
			(metadata.streams[0].tags.hasOwnProperty('rotation') && metadata.streams[0].tags.rotation);
		output.ar = ratio(output.width, output.height);
		return output;
	};

	const prepareParameters = metadata => {
		// When to transpose ?
		// 1. Image W >= Image H and Aspect Ratio is matching -> NOP
		// 2. Image W >= Image H and Aspect Ratio is reversed -> transpose (ffmpeg handles it automatically)
		// 3. Image W <  Image H and Aspect Ratio is matching -> NOP
		// 4. Image W <  Image H and Aspect Ratio is reversed -> transpose (ffmpeg handles it automatically)
		// 5. Image has rotate tag ----------------------------> transpose (ffmpeg doesn't handle it automatically)
		//
		// Parameter selection -
		// 1. If WxH found in param list ----------------------------> use it
		// 2. If HxW found in param list ----------------------------> use it, but reverse the width and height
		// 3. If WxH NOT found in param list, but AR is 16:9 or 4:3 -> use H to find the closest matching H param smaller than it, and use it
		// 4. If WxH NOT found in param list, but AR is 9:16 or 3:4 -> use H to find the closest matching W param smaller than it, and use it
		// 5. Else --------------------------------------------------> don't process, give warning
		let list = [];
		let w = metadata.width,
			h = metadata.height,
			ar = metadata.ar;
		if (`${w}x${h}` in ffmpegParams.knownAspectRatios) {
			// console.log('prepareParameters 1');
			let mainParameter = ffmpegParams.knownAspectRatios[`${w}x${h}`];
			mainParameter.lower_res.forEach(each => list.push(ffmpegParams.knownAspectRatios[each]));
			metadata.list = list;
			return metadata;
		} else if (`${h}x${w}` in ffmpegParams.knownAspectRatios) {
			// console.log('prepareParameters 2');
			let mainParameter = ffmpegParams.knownAspectRatios[`${h}x${w}`];
			let w = mainParameter.w;
			let h = mainParameter.h;
			mainParameter.w = h;
			mainParameter.h = w;
			mainParameter.lower_res.forEach(each => {
				let w = each.w;
				let h = each.h;
				each.w = h;
				each.h = w;
				list.push(ffmpegParams.knownAspectRatios[each]);
			});
			metadata.list = list;
			return metadata;
		} else if (ar === '16:9' || ar === '4:3') {
			// console.log('prepareParameters 3');
			let resList = ffmpegParams.knownResolutions[ar];
			let selectedRes = null;
			for (let i = 0; i < resList.length; i++) {
				let res = resList[i];
				if (parseInt(res.split('x')[1]) > parseInt(h)) {
					if (i - 1 >= 0) {
						selectedRes = resList[i - 1];
					}
					break;
				} else if (i + 1 === resList.length) {
					selectedRes = resList[i];
				} else {
					continue;
				}
			}
			if (selectedRes) {
				let mainParameter = ffmpegParams.knownAspectRatios[selectedRes];
				mainParameter.lower_res.forEach(each => list.push(ffmpegParams.knownAspectRatios[each]));
				metadata.list = list;
				return metadata;
			} else {
				return Promise.reject(`Unable to handle this video - ${JSON.stringify(metadata)}`);
			}
		} else if (ar === '9:16' || ar === '3:4') {
			// console.log('prepareParameters 4');
			let resList = ffmpegParams.knownResolutions[ar.split(':').reverse().join(':')];
			let selectedRes = null;
			for (let i = 0; i < resList.length; i++) {
				let res = resList[i];
				if (parseInt(res.split('x')[0]) > parseInt(h)) {
					if (i - 1 >= 0) {
						selectedRes = resList[i - 1];
					}
					break;
				} else if (i + 1 === resList.length) {
					selectedRes = resList[i];
				} else {
					continue;
				}
			}
			if (selectedRes) {
				let mainParameter = ffmpegParams.knownAspectRatios[selectedRes];
				mainParameter.lower_res.forEach(each => list.push(ffmpegParams.knownAspectRatios[each]));
				metadata.list = list;
				return metadata;
			} else {
				return Promise.reject(`Unable to handle this video - ${JSON.stringify(metadata)}`);
			}
		} else {
			// console.log('prepareParameters 5');
			return Promise.reject(`Unable to handle this video - ${JSON.stringify(metadata)}`);
		}
	};

	const buildCommand = (path, rotate, list) => {
		// set up the command
		let command = `/opt/bin/ffmpeg -i ${path} -y`;

		// complex filter
		command += ' -filter_complex "[0:v]';
		command += rotate ? 'transpose=1,' : '';
		command += `split=${list.length}${list.map((e, i) => `[v${i}]`).join('')};`;
		command += list
			.map((e, i) => `[v${i}]scale=w=${e.w}:h=${e.h}${rotate ? ',transpose=2' : ''}[v${i}o]`)
			.join(';');
		command += '"';

		// map each video stream and process it
		command += list
			.map(
				(e, i) =>
					` -map [v${i}o]` +
					` -c:v:${i} libx264` +
					' -x264-params "nal-hrd=cbr:force-cfr=1"' +
					` -profile:v:${i} ${e.profile}` +
					` -level:v:${i} ${e.level}` +
					` -preset ${e.preset}` +
					` -g ${e.g}` +
					` -sc_threshold ${e.sc_threshold}` +
					` -keyint_min ${e.keyint_min}` +
					` -b:v:${i} ${e.v_b}` +
					` -maxrate:v:${i} ${e.v_maxrate}` +
					` -minrate:v:${i} ${e.v_minrate}` +
					` -bufsize:v:${i} ${e.v_bufsize}`
			)
			.join('');

		// map each audio stream and process it
		command += list
			.map(
				(e, i) =>
					` -map a:0 -c:a:${i} aac -ar ${e.a_ar} -b:a:${i} ${e.a_b} -ac ${e.ac}`
			)
			.join('');

		// HLS settings and output
		command +=
			' -f hls' +
			' -hls_time 2' +
			' -hls_playlist_type vod' +
			' -hls_flags independent_segments' +
			' -hls_segment_type mpegts' +
			' -hls_segment_filename stream_%v_data%02d.ts' +
			' -master_pl_name master.m3u8' +
			` -var_stream_map "${list.map((e, i) => `v:${i},a:${i}`).join(' ')}"` +
			' stream_%v.m3u8';

		// return the command string
		return command;
	};

	const ffmpeg = (command, inputFilePath) => {
		let filename = inputFilePath.split('/').reverse()[0];
		command = `mkdir -p ${outputPath}/${filename};cd ${outputPath}/${filename};` + command;
		return exec(command)
			.then(result => {
				if (result.stderr) {
					if (result.stderr.match(/error/i)) {
						return Promise.reject(result.stderr);
					} else {
						return null; // result.stderr; // ignore the verbose output
					}
				} else {
					return result.stdout;
				}
			})
			.then(output => {
				if (output) {
					console.error(output);
				}
				return `${outputPath}/${filename}`;
			});
	};

	const processVideo = path => {
		return ffprobe(path)
			.then(output => extractSimplify(output))
			.then(metadata => prepareParameters(metadata))
			.then(({ rotate, list }) => buildCommand(path, rotate, list))
			.then(command => ffmpeg(command, path));
	};

	return {
		processVideo,
	};
};

/*

Kush Gauge
----------

optimal_bitrate = width * height * frames_per_second * motion_factor * 0.07

motion_factor :

1 - Low motion is a video that has minimal movement. For example, a talking head in front of a camera while the camera itself and the background is not moving at all.
2 - Medium motion would be some degree of movement, but in a more predictable and orderly manner, which means some relatively slow camera and subject movements, but not many scene changes or cuts or sudden snap camera movements or zooms where the entire picture changes into something completely different instantaneously.
3 - Is not explained but is obvious a situation between 2 and 4.
4 - High motion would be something like the most challenging action movie trailer, where not only the movements are fast and unpredictable but the scenes also change very rapidly.

*/
