define(['zepto'], function($){

	function Page() {
		var page = this;
		var lincoapp = {};
		var onloadList = [];

		this.extend = function(target, deep){
			return deep ?
				$.extend.apply(this, [].slice.call(arguments, 0)):
				$.extend(this, target);
		};

		this.extend({
			app: {},

			init: function(){},

			bind: function(){},

			render: function(){},

			reg: function(){
				// 第一步 执行onload列表
				lincoapp.perform(onloadList);
				// 第二步 渲染页面
				this.render();
				// 第三步 执行页面初始化
				this.init();
				// 第四步 绑定事件
				this.bind();
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
			},

			// 插件入口
			exports: function(id, fn){
				$.type(fn) === 'function' ? this.app[id] = fn.call({extend: this.extend}) : this.app[id] = fn;
			}
		});

		this.extend(lincoapp, {

			perform: function(array){
				array.forEach(function(item){
					item.call(page)
				})
			}

		});
	};

	return Page;

	// typeof define !== 'undefined' && typeof defined === 'function' ?
	// 	define(function(){ return Page }):
	// 	window.Page = Page;

});