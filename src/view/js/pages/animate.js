define(['zepto', 'page', 'parser', 'db', 'view'], function($, Page, Parser, db, view){
	var page = new Page;
	var parser = new Parser;

	var lib = $('.clover-animate-lib');
	var isAnimating = false;

	// 触发动画播放的类
	// 播放动画除了需要添加动画本身的类，还需要添加此类
	var cloverjsAnimatePlay = 'cloverjs-animate-play';
	var _cloverjsAnimatePlay = '.cloverjs-animate-play';


	page.onload(function(){
		var thisAnimate;

		this.exports('view', function(){

			// 初始化view模块
			view.initEvent('#cloverView');
			
			// 获取动画对象
			thisAnimate = $('#apElement');

			// 设置预览区域的高度
			$('#cloverView').height(window.innerHeight - $('#cloverFooter').height());

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

			// 绑定动画预览方法
			lib.delegate('.u-lib', 'click', function(){
				var data, guid;

				// 检查动画状态
				if(isAnimating) return;

				guid = this.getAttribute('guid');
				data = page.data[guid];

				thisAnimate.addClass(cloverjsAnimatePlay).addClass(data.className);
				isAnimating = true;
			});
		});








	});

	page.extend({
		id: 'animate',

		init: function(){

			console.log('enter animate page.', 123)
		},

		bind: function(){

		},

		insert: function(data){
			var btn = $('<button class="u-lib"></button>');
			var style = $('<style></style>');

			btn.attr('guid', data.guid);
			btn.text(data.name).appendTo(lib);
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