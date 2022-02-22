'use strict';

module.exports = function () {
	const knownAspectRatios = {
		// 4:3
		'320x240': {
			w: '320',
			h: '240',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '200K',
			v_maxrate: '200K',
			v_minrate: '200K',
			v_bufsize: '200K',
			a_ar: '44100',
			a_b: '64k',
			ac: '2',
			lower_res: ['320x240'],
		},
		'480x360': {
			w: '480',
			h: '360',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '400K',
			v_maxrate: '400K',
			v_minrate: '400K',
			v_bufsize: '400K',
			a_ar: '44100',
			a_b: '64k',
			ac: '2',
			lower_res: ['480x360', '320x240'],
		},
		'640x480': {
			w: '640',
			h: '480',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '800K',
			v_maxrate: '800K',
			v_minrate: '800K',
			v_bufsize: '800K',
			a_ar: '44100',
			a_b: '96k',
			ac: '2',
			lower_res: ['640x480', '480x360', '320x240'],
		},
		'800x600': {
			w: '800',
			h: '600',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '1M',
			v_maxrate: '1M',
			v_minrate: '1M',
			v_bufsize: '1M',
			a_ar: '44100',
			a_b: '96k',
			ac: '2',
			lower_res: ['800x600', '640x480', '480x360', '320x240'],
		},
		'960x720': {
			w: '960',
			h: '720',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '1.2M',
			v_maxrate: '1.2M',
			v_minrate: '1.2M',
			v_bufsize: '1.2M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: ['960x720', '800x600', '640x480', '480x360', '320x240'],
		},
		'1024x768': {
			w: '1024',
			h: '768',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '1.3M',
			v_maxrate: '1.3M',
			v_minrate: '1.3M',
			v_bufsize: '1.3M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: ['960x720', '800x600', '640x480', '480x360', '320x240'],
		},
		'1280x960': {
			w: '1280',
			h: '960',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '1.6M',
			v_maxrate: '1.6M',
			v_minrate: '1.6M',
			v_bufsize: '1.6M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [/* '1280x960', */ '960x720', '800x600', '640x480', '480x360', '320x240'],
		},
		'1400x1050': {
			w: '1400',
			h: '1050',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '2M',
			v_maxrate: '2M',
			v_minrate: '2M',
			v_bufsize: '2M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1400x1050', '1280x960', */ '960x720',
				'800x600',
				'640x480',
				'480x360',
				'320x240',
			],
		},
		'1440x1080': {
			w: '1440',
			h: '1080',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '3M',
			v_maxrate: '3M',
			v_minrate: '3M',
			v_bufsize: '3M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1440x1080', '1280x960', */ '960x720',
				'800x600',
				'640x480',
				'480x360',
				'320x240',
			],
		},
		'1600x1200': {
			w: '1600',
			h: '1200',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '3.5M',
			v_maxrate: '3.5M',
			v_minrate: '3.5M',
			v_bufsize: '3.5M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1440x1080', '1280x960', */ '960x720',
				'800x600',
				'640x480',
				'480x360',
				'320x240',
			],
		},
		'1856x1392': {
			w: '1856',
			h: '1392',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '4M',
			v_maxrate: '4M',
			v_minrate: '4M',
			v_bufsize: '4M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1440x1080', '1280x960', */ '960x720',
				'800x600',
				'640x480',
				'480x360',
				'320x240',
			],
		},
		'1920x1440': {
			w: '1920',
			h: '1440',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '4.5M',
			v_maxrate: '4.5M',
			v_minrate: '4.5M',
			v_bufsize: '4.5M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1440x1080', '1280x960', */ '960x720',
				'800x600',
				'640x480',
				'480x360',
				'320x240',
			],
		},
		'2048x1536': {
			w: '2048',
			h: '1536',
			ratio: '4:3',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '5M',
			v_maxrate: '5M',
			v_minrate: '5M',
			v_bufsize: '5M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1440x1080', '1280x960', */ '960x720',
				'800x600',
				'640x480',
				'480x360',
				'320x240',
			],
		},

		// 16:9
		'320x180': {
			w: '320',
			h: '180',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '200K',
			v_maxrate: '200K',
			v_minrate: '200K',
			v_bufsize: '200K',
			a_ar: '44100',
			a_b: '64k',
			ac: '2',
			lower_res: ['320x180'],
		},
		'480x270': {
			w: '480',
			h: '270',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '300K',
			v_maxrate: '300K',
			v_minrate: '300K',
			v_bufsize: '300K',
			a_ar: '44100',
			a_b: '64k',
			ac: '2',
			lower_res: ['480x270', '320x180'],
		},
		'640x360': {
			w: '640',
			h: '360',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '500K',
			v_maxrate: '500K',
			v_minrate: '500K',
			v_bufsize: '500K',
			a_ar: '44100',
			a_b: '96k',
			ac: '2',
			lower_res: ['640x360', '480x270', '320x180'],
		},
		'960x540': {
			w: '960',
			h: '540',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '1M',
			v_maxrate: '1M',
			v_minrate: '1M',
			v_bufsize: '1M',
			a_ar: '44100',
			a_b: '96k',
			ac: '2',
			lower_res: ['960x540', '640x360', '480x270', '320x180'],
		},
		'1024x576': {
			w: '1024',
			h: '576',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '1.2M',
			v_maxrate: '1.2M',
			v_minrate: '1.2M',
			v_bufsize: '1.2M',
			a_ar: '44100',
			a_b: '96k',
			ac: '2',
			lower_res: ['960x540', '640x360', '480x270', '320x180'],
		},
		'1152x648': {
			w: '1152',
			h: '648',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '1.5M',
			v_maxrate: '1.5M',
			v_minrate: '1.5M',
			v_bufsize: '1.5M',
			a_ar: '44100',
			a_b: '96k',
			ac: '2',
			lower_res: ['1152x648', '960x540', '640x360', '480x270', '320x180'],
		},
		'1280x720': {
			w: '1280',
			h: '720',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '2M',
			v_maxrate: '2M',
			v_minrate: '2M',
			v_bufsize: '2M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: ['1280x720', '960x540', '640x360', '480x270', '320x180'],
		},
		'1366x768': {
			// dicey
			w: '1366',
			h: '768',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '2.2M',
			v_maxrate: '2.2M',
			v_minrate: '2.2M',
			v_bufsize: '2.2M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: ['1280x720', '960x540', '640x360', '480x270', '320x180'],
		},
		'1600x900': {
			w: '1600',
			h: '900',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '3M',
			v_maxrate: '3M',
			v_minrate: '3M',
			v_bufsize: '3M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [/* '1600x900', */ '1280x720', '960x540', '640x360', '480x270', '320x180'],
		},
		'1920x1080': {
			w: '1920',
			h: '1080',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '4M',
			v_maxrate: '4M',
			v_minrate: '4M',
			v_bufsize: '4M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1920x1080', '1600x900', */ '1280x720',
				'960x540',
				'640x360',
				'480x270',
				'320x180',
			],
		},
		'2560x1440': {
			w: '2560',
			h: '1440',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '7.7M',
			v_maxrate: '7.7M',
			v_minrate: '7.7M',
			v_bufsize: '7.7M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1920x1080', '1600x900', */ '1280x720',
				'960x540',
				'640x360',
				'480x270',
				'320x180',
			],
		},
		'3840x2160': {
			w: '3840',
			h: '2160',
			ratio: '16:9',
			profile: 'high',
			level: '4',
			preset: 'slow',
			g: '48',
			sc_threshold: '0',
			keyint_min: '48',
			v_b: '8M',
			v_maxrate: '8M',
			v_minrate: '8M',
			v_bufsize: '8M',
			a_ar: '44100',
			a_b: '128k',
			ac: '2',
			lower_res: [
				/* '1920x1080', '1600x900', */ '1280x720',
				'960x540',
				'640x360',
				'480x270',
				'320x180',
			],
		},
	};

	const knownResolutions = {
		'4:3': [
			'320x240',
			'480x360',
			'640x480',
			'800x600',
			'960x720',
			'1024x768',
			'1280x960',
			'1400x1050',
			'1440x1080',
			'1600x1200',
			'1856x1392',
			'1920x1440',
			'2048x1536',
		],
		'16:9': [
			'320x180',
			'480x270',
			'640x360',
			'960x540',
			'1024x576',
			'1152x648',
			'1280x720',
			'1366x768', // dicey
			'1600x900',
			'1920x1080',
			'2560x1440',
			'3840x2160',
		],
	};

	return {
		knownAspectRatios,
		knownResolutions,
	};
};
