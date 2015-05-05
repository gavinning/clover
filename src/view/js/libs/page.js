define(['jq', 'app'], function($, App){
	var page = new App;
	var onloadList = [];

	page.fn.extend({
		init: function(){},

		bind: function(){},

		render: function(){},

		reg: function(){
			// 第一步 执行onload列表
			page.perform(this, onloadList);
			// 第二步 渲染页面
			this.render();
			// 第三步 执行页面初始化
			this.init();
			// 第四步 绑定事件
			this.bind();
			// 呈现页面
			this.load();
		},

		load: function(){
			$('body').css('opacity', 1);
		},

		// 启用rem适配模式
		rem: function(){
			var baseFontSize = 10;
			var baseWidth = 320;
			var dpr = window.devicePixelRatio;
			var innerWidth = window.innerWidth; // Math.min(window.innerWidth, 640);
			var rem = innerWidth/baseWidth * baseFontSize + 'px';
			document.querySelector('html').style.fontSize = rem;
		},

		// 虚拟页入口
		onload: function(fn){
			onloadList.push(fn)
		}
	});

	page.extend({
		perform: function(obj, array){
			array.forEach(function(item){
				item.call(obj)
			})
		}
	});

	return page;
});