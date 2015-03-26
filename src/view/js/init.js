require.config({
	baseUrl : './js',
	paths : {
		zepto 		: 'libs/zepto.min',
		dragDom 	: 'libs/dom-drag',

		dragInpage 	: 'mods/drag',
		guid 		: 'mods/guid',
		parser 		: 'mods/parser',
		pm 			: 'mods/pm',
		page 		: 'mods/page',
		cache 		: 'mods/cache',
		listen 		: 'mods/listen',
		timeline	: 'mods/axisAnimation',

		home		: 'pages/home'
	},
	shim:{
		'zepto': { 
			exports: 'Zepto'
		}
	}
});
require(['zepto', 'pm'], function($, pm){
	
	// Zepto扩展重绘
	$.fn.reflow =  function (){
	    this.each(function(){
	        this.nodeType && this.nodeType==1 && getComputedStyle(this).zoom;
	    }); 
	    return this;
	};

	pm.home();

});