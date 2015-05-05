require.config({
	baseUrl : './js',

	paths : {
		// 功能模块，与业务无关
		jq 			: 'libs/jquery.min',
		app 		: 'libs/class',
		package 	: 'libs/package',
		guid 		: 'libs/guid',
		page 		: 'libs/page',
		dragDom 	: 'libs/dom-drag',
		cssFormat	: 'libs/cssbeautify',
		mtpl		: 'libs/mtpl',
		dragInpage 	: 'libs/drag',
		parser 		: 'libs/parser',
		parserCss 	: 'libs/parserCss',
		listen 		: 'libs/listen',
		timeline	: 'libs/axisAnimation',
		args 		: 'libs/args',

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
		'jq': { 
			exports: 'jQuery'
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
