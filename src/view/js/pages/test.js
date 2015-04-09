define(['zepto', 'page', 'package', 'options', 'view'], function($, Page, package, Options, view){
	var page = new Page;

	page.onload(function(){

		view.initEvent();

		var options = new Options;
		options.initEvent({list: ['123']});


		this.exports('view', function(){

		});
	});

	page.extend({
		id: 'test',

		init: function(){
			console.log('enter '+ this.id +' page.', 123)
		},

		bind: function(){

		},

		render: function(){

		}
	});

	page.view = view;
	window.page = page;
	return page;
});