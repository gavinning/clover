define(['jq', 'package', 'dragDom', 'text!coms/view.html'], function($, Package, dragDom, dom){
	var view = new Package(dom);
	var app = view.app;

	// Dom拖拽模块
	view.exports('dragDom', {
		// 绑定动画元素拖拽事件
		on: function(tag) {
			var x, xm, y, ym, left, top, canvas, ap;

			// 绑定拖拽事件
			ap = $(tag);
			canvas = $('#apContent');

			x = 0;
			y = 0;
			xm = x + canvas.width() - ap.width();
			ym = y + canvas.height() - ap.height();

			top = canvas.height()/2 - ap.height()/2;
			left = canvas.width()/2 - ap.width()/2;

			// 绑定拖动方法
			dragDom.init(document.querySelector(tag), null, x, xm, y, ym);
			// 可拖动元素居中对齐
			ap.css('left', left).css('top', top);
		},

		// 加载图片
		loadImg: function(src, callback){
			var img = new Image();
			img.src = src;
			img.onload = callback || function(){};
		}

	});

	view.extend({

		Event: function(){
			this.app.dragDom.on('#apElement');

			// todo: for test
			if(this.element().parent().get(0).tagName === 'BODY'){
				this.element().height(window.innerHeight);
			}
		},

		// apElement位置
		position: function(){
		}
	});

	return view;
});