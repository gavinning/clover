require.config({
	baseUrl : './js',

	paths : {
		zepto 		: 'libs/zepto.min',
		dragDom 	: 'libs/dom-drag',
		cssFormat	: 'libs/cssbeautify',
		mtpl		: 'libs/mtpl',

		dragInpage 	: 'mods/drag',
		guid 		: 'mods/guid',
		parser 		: 'mods/parser',
		pm 			: 'mods/pm',
		page 		: 'mods/page',
		cache 		: 'mods/cache',
		listen 		: 'mods/listen',
		timeline	: 'mods/axisAnimation',
		args 		: 'mods/args',
		package 	: 'mods/package',

		home		: 'pages/home',
		animate 	: 'pages/animate',
		createP 	: 'pages/create-project'
	},

	packages: [
		{
			name: 'clover-slide',
			location: '/Modules/clover/slide-options'
		}
	],

	shim:{
		'zepto': { 
			exports: 'Zepto'
		}
	},

	// no cache
	urlArgs: "bust=" +  (new Date()).getTime()
});

String.prototype.toNumber = function(){
	return Number(this.replace('px', ''))
};

Number.prototype.toNumber = function(){
	return this
};
