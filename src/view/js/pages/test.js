define(['zepto', 'page', 'view'], function($, Page, view){
	var page = new Page;

	page.onload(function(){

		
		view.render('#test');





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

	return page;
});