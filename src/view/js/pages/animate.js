define(['zepto', 'page', 'parser', 'db', 'clover-view'], function($, Page, Parser, db, View){
	var page = new Page;
	var parser = new Parser;

	var lib = $('.clover-animate-lib');
	var thisAnimate = $('#thisAnimate');
	var isAnimating = false;

	// 触发动画播放的类
	// 播放动画除了需要添加动画本身的类，还需要添加此类
	var cloverjsAnimatePlay = 'cloverjs-animate-play';
	var _cloverjsAnimatePlay = '.cloverjs-animate-play';


	page.onload(function(){

		this.exports('view', function(){
			var view = new View;

			view.html({id: 'cloverPhoneView'}).appendTo('#cloverView');
			view.css().appendTo('head');
			$('#' + view.id).height(window.innerHeight - $('#cloverFooter').height());
		});
	});

	page.extend({
		id: 'animate',

		init: function(){
			console.log('enter animate page.', 123)
		},

		bind: function(){
			lib.delegate('.u-lib', 'click', function(){
				var data, guid;

				// 检查动画状态
				if(isAnimating) return;

				guid = this.getAttribute('guid');
				data = page.data[guid];

				thisAnimate.addClass(cloverjsAnimatePlay).addClass(data.className);
				isAnimating = true;
			});

			// 动画播放完成动作
			thisAnimate.get(0).addEventListener('webkitAnimationEnd', function(){
				// 注销入场动画
				setTimeout(function(){
					// 清理动画类
					thisAnimate.removeAttr('class');
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
			this.data = db.get('animate') || {};
			$.each(this.data, function(key, value){
				page.insert(value);
			});
		}
	});

	return page;
});