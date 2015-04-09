define(['zepto', 'app', 'package', 'text!coms/options.html'], function($, App, Package , dom){
	var Options = new App(Package);

	Options.fn.dom = dom;

	return Options;
});