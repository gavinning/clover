define(['zepto', 'page'], function($, Page){
	var page = new Page;
	// var isAnimating = false;

	page.extend({
		id: 'pageId',

		init: function(){
			console.log('enter '+ this.id +' page.', 123)
		},

		bind: function(){

		},

		render: function(){

		}
	})

	return page;
})