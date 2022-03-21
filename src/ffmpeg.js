'use strict';

module.exports = function (outputPath) {
	const exec = require('util').promisify(require('child_process').exec);

	function log(o) {
		console.log(JSON.stringify(o, null, 2));
		return o;
	}

	// length of each video chunk in seconds
	const chunkLength = 2;

	// list of accepted aspect ratios
	const aspectRatios = [
		[1, 1],
		[5, 4],
		[4, 3],
		[16, 9],
	];

	// list of accepted resolutions
	const resolutions = [
		[360, 360], //   1:1 =  360 * 360 * 30 * 2 * 0.07 =  544320 = 600K
		[480, 480], //   1:1 =  480 * 480 * 30 * 2 * 0.07 =  967680 =   1M
		[600, 600], //   1:1 =  600 * 600 * 30 * 2 * 0.07 = 1512000 = 1.5M
		[720, 720], //   1:1 =  720 * 720 * 30 * 2 * 0.07 = 2177280 = 2.2M
		[450, 360], //   5:4 =  450 * 360 * 30 * 2 * 0.07 =  680400 = 700K
		[600, 480], //   5:4 =  600 * 480 * 30 * 2 * 0.07 = 1209600 = 1.2M
		[750, 600], //   5:4 =  750 * 600 * 30 * 2 * 0.07 = 1890000 = 1.9M
		[900, 720], //   5:4 =  900 * 720 * 30 * 2 * 0.07 = 2721600 = 2.7M
		[480, 360], //   4:3 =  480 * 360 * 30 * 2 * 0.07 =  725760 = 750K
		[640, 480], //   4:3 =  640 * 480 * 30 * 2 * 0.07 = 1290240 = 1.3M
		[800, 600], //   4:3 =  800 * 600 * 30 * 2 * 0.07 = 2016000 =   2M
		[960, 720], //   4:3 =  960 * 720 * 30 * 2 * 0.07 = 2903040 = 2.9M
		[640, 360], //  16:9 =  640 * 360 * 30 * 2 * 0.07 =  967680 =   1M
		[960, 540], //  16:9 =  960 * 540 * 30 * 2 * 0.07 = 2177280 = 2.2M
		[1280, 720], // 16:9 = 1280 * 720 * 30 * 2 * 0.07 = 3870720 =   4M
	];

	// list of accepted resolutions for each aspect ratio
	const resolutionsPerAspectRatio = {
		'1:1': [
			[360, 360],
			[480, 480],
			[600, 600],
			[720, 720],
		],
		'5:4': [
			[450, 360],
			[600, 480],
			[750, 600],
			[900, 720],
		],
		'4:3': [
			[480, 360],
			[640, 480],
			[800, 600],
			[960, 720],
		],
		'16:9': [
			[640, 360],
			[960, 540],
			[1280, 720],
		],
	};

	// list of accepted profiles
	const profiles = ['baseline', 'main', 'extended', 'high'];

	// list of ffmpeg parameters for each accepted resolution
	const parameters = {
		'360x360': {
			w: '360',
			h: '360',
			raio: '1:1',
			resolutions: ['360x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '600K',
			bufsize: '600K',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'480x480': {
			w: '480',
			h: '480',
			raio: '1:1',
			resolutions: ['480x480', '360x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '1M',
			bufsize: '1M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'600x600': {
			w: '600',
			h: '600',
			raio: '1:1',
			resolutions: ['600x600', '480x480', '360x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '1.5M',
			bufsize: '1.5M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'720x720': {
			w: '720',
			h: '720',
			raio: '1:1',
			resolutions: ['720x720', '600x600', '480x480', '360x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '2.2M',
			bufsize: '2.2M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'450x360': {
			w: '450',
			h: '360',
			raio: '5:4',
			resolutions: ['450x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '700K',
			bufsize: '700K',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'600x480': {
			w: '600',
			h: '480',
			raio: '5:4',
			resolutions: ['600x480', '450x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '1.2M',
			bufsize: '1.2M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'750x600': {
			w: '750',
			h: '600',
			raio: '5:4',
			resolutions: ['750x600', '600x480', '450x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '1.9M',
			bufsize: '1.9M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'900x720': {
			w: '900',
			h: '720',
			raio: '5:4',
			resolutions: ['900x720', '750x600', '600x480', '450x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '2.7M',
			bufsize: '2.7M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'480x360': {
			w: '480',
			h: '360',
			raio: '4:3',
			resolutions: ['480x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '750K',
			bufsize: '750K',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'640x480': {
			w: '640',
			h: '480',
			raio: '4:3',
			resolutions: ['640x480', '480x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '1.3M',
			bufsize: '1.3M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'800x600': {
			w: '800',
			h: '600',
			raio: '4:3',
			resolutions: ['800x600', '640x480', '480x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '2M',
			bufsize: '2M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'960x720': {
			w: '960',
			h: '720',
			raio: '4:3',
			resolutions: ['960x720', '800x600', '640x480', '480x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '2.9M',
			bufsize: '2.9M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'640x360': {
			w: '640',
			h: '360',
			raio: '16:9',
			resolutions: ['640x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '1M',
			bufsize: '1M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'960x540': {
			w: '960',
			h: '540',
			raio: '16:9',
			resolutions: ['960x540', '640x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '2.2M',
			bufsize: '2.2M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
		'1280x720': {
			w: '1280',
			h: '720',
			raio: '16:9',
			resolutions: ['1280x720', '960x540', '640x360'],
			profile: 'high',
			level: '4',
			preset: 'veryslow',
			tune: 'zerolatency',
			maxrate: '4M',
			bufsize: '4M',
			a_ar: '44100',
			a_b: '128000',
			a_ac: '2',
		},
	};

	// return the calculated aspect ratio (CAR) for a given width and height
	// order of width and height DOESN'T matter
	function getAspectRatio([w, h]) {
		let n = h;
		while (n > 1) {
			if (w % n === 0 && h % n === 0) {
				w /= n;
				h /= n;
			}
			n--;
		}
		return [w, h];
	}

	// return the closest matching aspect ratio (CMAR) for a given width and height
	// order of width and height DOES matter: width >= height
	function getClosestMatchingAspectRatio([w, h]) {
		return aspectRatios
			.map(each => ({
				r: each,
				d: Math.abs(each[0] / each[1] - w / h),
			}))
			.sort((a, b) => a.d - b.d)[0].r;
	}

	// return the closest matching resolution (CMR) SMALLER than a given width and height
	// order of width and height DOES matter: width >= height
	// it is expected that aspect ratio ar is from list of accepted aspect ratios
	// it is expected that resolution [w,h ] is having the aspect ratio ar
	function getClosestMatchingResolution(ar, [w, h]) {
		// 1. get the accepted resolutions for the given aspect ratio ar
		let resolutions = resolutionsPerAspectRatio[ar];
		for (let i = 0; i < resolutions.length; i++) {
			// 2. if the given resoltuion is exactly matching the accepted resolution
			if (resolutions[i][0] === w) {
				return resolutions[i];
			}
			// 3. if the given resoltuion is smaller than the accepted resolution
			if (resolutions[i][0] > w) {
				// 4. if the accepted resolution is the first one in the list, then the given resolution is too small
				// in that case, simply return the given resolution
				if (i === 0) {
					return [w, h];
				}
				// 5. otherwise, return the previous accepted resolution in the list (closest match)
				return resolutions[i - 1];
			}
		}
		// 6. if list is over and no match is found, then return the last item in the list (closest match)
		return resolutions[resolutions.length - 1];
	}

	// // returns the estimated bitrate for a given width w, height h, frame rate r, and motion factor f
	// function kushGauge(w, h, r, f) {
	// 	return parseInt(w * h * (r || 30) * (f || 2) * 0.07);
	// }

	// function isAspectRatioMismatch(metadata) {
	// 	if (!metadata.display_aspect_ratio) {
	// 		return false;
	// 	}
	// 	let ar = metadata.display_aspect_ratio.split(':');
	// 	ar[0] = parseInt(ar[0]);
	// 	ar[1] = parseInt(ar[1]);
	// 	if (
	// 		(metadata.width > metadata.height && ar[0] > ar[1]) ||
	// 		(metadata.width < metadata.height && ar[0] < ar[1]) ||
	// 		(metadata.width === metadata.height && ar[0] === ar[1])
	// 	) {
	// 		return false;
	// 	}
	// 	return true;
	// }

	// check if width is smaller than height
	function isFlipped([width, height]) {
		if (width >= height) {
			return false;
		} else {
			return true;
		}
	}

	// makes sure that width is always greater than height
	function flip([width, height]) {
		if (width >= height) {
			return [width, height];
		} else {
			return [height, width];
		}
	}

	function getClosestEnclosingRectangle(ar, [w, h]) {
		let [ar_w, ar_h] = ar.split(':');
		ar_w = parseInt(ar_w);
		ar_h = parseInt(ar_h);
		let new_h = h - (h % ar_h) + ar_h;
		let new_w = (new_h / ar_h) * ar_w;
		if (new_h % 2 !== 0) {
			new_h += 1;
		}
		if (new_w % 2 !== 0) {
			new_w += 1;
		}
		return [new_w, new_h];
	}

	const ffprobe = path =>
		exec(`/opt/bin/ffprobe -hide_banner -v panic -print_format json -show_streams ${path}`).then(
			output => (output.stderr ? Promise.reject(output.stderr) : JSON.parse(output.stdout))
		);

	const extractMetadata = metadata => {
		let video = metadata.streams.find(whose => whose.codec_type === 'video');
		let audio = metadata.streams.find(whose => whose.codec_type === 'audio');

		if (!video) {
			throw new Error('Video stream not found!');
		}

		let videoMetadata = {
			codec_name: video.codec_name,
			profile: video.profile.toLowerCase(),
			width: video.width,
			height: video.height,
			display_aspect_ratio: video.display_aspect_ratio,
			level: video.level,
			avg_frame_rate: video.avg_frame_rate,
			bit_rate: video.bit_rate,
			calculated_aspect_ratio: getAspectRatio([video.width, video.height]),
			rotation_tag:
				(video.tags.hasOwnProperty('rotate') && video.tags.rotate) ||
				(video.tags.hasOwnProperty('rotation') && video.tags.rotation),
		};

		let audioMetadata = null;
		if (audio) {
			audioMetadata = {
				codec_name: audio.codec_name,
				profile: audio.profile.toLowerCase(),
				sample_rate: audio.sample_rate,
				channels: audio.channels,
				bit_rate: audio.bit_rate,
			};
		}

		return {
			video: videoMetadata,
			audio: audioMetadata,
		};
	};

	const prepareParameters = metadata => {
		let video = metadata.video;
		// 1. make sure that width >= height for all calculations
		// 2. find the closest matching aspect ratio -
		let ar = getClosestMatchingAspectRatio(flip([video.width, video.height])); console.log('ar', ar);
		// 3. find the closest matching resolution for closest matching aspect ratio -
		let res = getClosestMatchingResolution(ar.join(':'), flip([video.width, video.height])); console.log('res', res);
		// 4. find the ffmpeg parameters for the closest matching resolution
		let options = parameters[res.join('x')]; console.log('options', options);
		// 5. if the resolution is too small, then no matching resolution may be found
		if (!options) {
			// 6. simply use the parameters of the smallest resolution of the aspect ratio
			// in that case, it is going to be the only resolution for HLS
			options = [parameters[resolutionsPerAspectRatio[ar.join(':')][0].join('x')]]; console.log('options', options);
			// 7. in order to minimize the padding, calculate the closest enclosing rectangle around the frame for the aspect ratio
			let [new_w, new_h] = getClosestEnclosingRectangle(
				ar.join(':'),
				flip([video.width, video.height])
			); console.log('new_w', new_w, 'new_h', new_h);
			options[0].w = new_w;
			options[0].h = new_h; console.log('options', options);
		} else {
			// 8. if matching parameters are found, then add each smaller resolution parameters to the list
			options = options.resolutions.map(each => parameters[each]); console.log('options', options);
		}
		// 9. modify the selected options
		options = options.map(each => { console.log('options before', each);
			// 10. if video is flipped, then interchange the width and height
			if (isFlipped([video.width, video.height])) { console.log('is flipped');
				let t_w = each.w;
				let t_h = each.h;
				each.w = t_h;
				each.h = t_w;
			}

			// set the -g, -keyint_min, and -sc_threshold
			let framerate = 30;
			if (video.avg_frame_rate) {
				let t = video.avg_frame_rate.split('/');
				if (t.length > 1) {
					framerate = Math.round(parseInt(t[0]) / parseInt(t[1]));
				} else {
					framerate = Math.round(t[0]);
				}
			}
			each.g = framerate * chunkLength;
			each.keyint_min = framerate * chunkLength;
			each.sc_threshold = 0;

			console.log('options after', each);

			return each;
		});
		return {
			rotate: video.rotation_tag,
			list: options,
			hasAudio: !!metadata.audio,
		};
	};

	const buildCommand = (path, rotate, list, hasAudio) => {
		// set up the command
		let command = `/opt/bin/ffmpeg -i ${path} -y`;

		// complex filter
		command += ' -filter_complex "[0:v]';
		command += rotate ? 'transpose=1,' : '';
		command += `split=${list.length}${list.map((e, i) => `[v${i}]`).join('')};`;
		command += list
			.map(
				(e, i) =>
					`[v${i}]scale=w=${e.w}:h=${e.h}:flags=lanczos:force_original_aspect_ratio=decrease,pad=${
						e.w
					}:${e.h}:(ow-iw)/2:(oh-ih)/2:0x00000000${rotate ? ',transpose=2' : ''}[v${i}o]`
			)
			.join(';');
		command += '"';

		// map each video stream and process it
		command += list
			.map(
				(e, i) =>
					` -map [v${i}o]` +
					` -c:v:${i} libx264` +
					' -x264-params "nal-hrd=cbr:force-cfr=1"' +
					// ' -crf 20' +
					` -profile:v:${i} ${e.profile}` +
					` -level:v:${i} ${e.level}` +
					` -preset ${e.preset}` +
					` -tune ${e.tune}` +
					` -g ${e.g}` +
					` -sc_threshold ${e.sc_threshold}` +
					` -keyint_min ${e.keyint_min}` +
					// ` -b:v:${i} ${e.v_b}` +
					` -maxrate:v:${i} ${e.maxrate}` +
					// ` -minrate:v:${i} ${e.v_minrate}` +
					` -bufsize:v:${i} ${e.bufsize}`
			)
			.join('');

		if (hasAudio) {
			// map each audio stream and process it
			command += list
				.map((e, i) => ` -map a:0 -c:a:${i} aac -ar ${e.a_ar} -b:a:${i} ${e.a_b} -ac ${e.a_ac}`)
				.join('');
		}

		// HLS settings and output
		command +=
			' -f hls' +
			` -hls_time ${chunkLength}` +
			' -hls_playlist_type vod' +
			' -hls_flags split_by_time' +
			' -hls_segment_type mpegts' +
			' -hls_segment_filename stream_%v_data%02d.ts' +
			' -master_pl_name master.m3u8' +
			` -var_stream_map "${list
				.map((e, i) => (hasAudio ? `v:${i},a:${i}` : `v:${i}`))
				.join(' ')}"` +
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
			.then(log)
			.then(output => extractMetadata(output))
			.then(log)
			.then(metadata => prepareParameters(metadata))
			.then(log)
			.then(({ rotate, list, hasAudio }) => buildCommand(path, rotate, list, hasAudio))
			.then(log)
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
