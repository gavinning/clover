define(['zepto', 'page'], function($, Page){
	var page = new Page;
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

		render: function(){
			var btn = $('<button class="u-lib">'+ localStorage.cloverAnimateId +'</button>');

			lib.append(btn)
			$('head').append('<style>'+ localStorage.cloverAnimateData +'</style>');
		}
	})

	return page;
})