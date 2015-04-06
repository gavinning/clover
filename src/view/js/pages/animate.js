define(['zepto', 'page', 'parser', 'db'], function($, Page, Parser, db){
	var page = new Page;
	var parser = new Parser;

	var lib = $('.clover-animate-lib');
	var thisAnimate = $('#thisAnimate');
	var isAnimating = false;

	page.extend({
		id: 'animate',

		init: function(){
			console.log('enter animate page.', 123)
		},

		bind: function(){
			lib.delegate('.u-lib', 'click', function(){
				if(this.innerText !== 'test' && !isAnimating){
					thisAnimate.addClass(this.innerText).addClass('fadeIn');
					isAnimating = true;
				}
			});

			// 动画播放完成动作
			thisAnimate.get(0).addEventListener('webkitAnimationEnd', function(){
				// 注销入场动画
				setTimeout(function(){
					// 清理动画类
					thisAnimate.attr('class', '');
					// 重置动画状态
					isAnimating = false;
				}, 200)

			}, false);

		},

		insert: function(data){
			var btn = $('<button class="u-lib"></button>');
			var style = $('<style></style>');

			btn.attr('guid', data.guid).text(data.name).appendTo(lib);
			style.attr('data-id', 'clover-' + data.guid).html(parser.one(data.animate)).appendTo('head');
		},

		render: function(){
			var animate = db.get('animate');
			$.each(animate, function(key, value){
				page.insert(value);
			})
		}
	});

	return page;
});