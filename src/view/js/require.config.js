require.config({
	baseUrl : './js',

	paths : {
		// 功能模块，与业务无关
		zepto 		: 'libs/zepto.min',
		dragDom 	: 'libs/dom-drag',
		cssFormat	: 'libs/cssbeautify',
		mtpl		: 'libs/mtpl',
		class 		: 'libs/class',
		dragInpage 	: 'libs/drag',
		guid 		: 'libs/guid',
		parser 		: 'libs/parser',
		page 		: 'libs/page',
		listen 		: 'libs/listen',
		timeline	: 'libs/axisAnimation',
		args 		: 'libs/args',
		package 	: 'libs/package',

		// 业务模块，严重依赖业务，不可单独拆分使用
		db 			: 'mods/db',
		view 		: 'mods/view',
		dialog 		: 'mods/dialog',
		options 	: 'mods/options',

		// 页面模块
		home		: 'pages/home',
		test		: 'pages/test',
		animate 	: 'pages/animate',
		createP 	: 'pages/create-project',

		// 其他
		animateLib	: 'tmp/animateLib'
	},

	packages: [
		{
			name: 'clover-slide',
			location: '/Modules/clover/slide-options'
		},

		{
			name: 'clover-view',
			location: '/Modules/clover/view'
		},

		{
			name: 'clover-dialog',
			location: '/Modules/clover/dialog'
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
