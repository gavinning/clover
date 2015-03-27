require.config({
	baseUrl : './js',
	paths : {
		zepto 		: 'libs/zepto.min',
		dragDom 	: 'libs/dom-drag',
		cssFormat	: 'libs/cssbeautify',

		dragInpage 	: 'mods/drag',
		guid 		: 'mods/guid',
		parser 		: 'mods/parser',
		pm 			: 'mods/pm',
		page 		: 'mods/page',
		cache 		: 'mods/cache',
		listen 		: 'mods/listen',
		timeline	: 'mods/axisAnimation',
		args 		: 'mods/args',

		home		: 'pages/home',
		animate 	: 'pages/animate'
	},
	shim:{
		'zepto': { 
			exports: 'Zepto'
		}
	},
	// no cache
	urlArgs: "bust=" +  (new Date()).getTime()
});
