define(['jq', 'app', 'mtpl', 'guid'], function($, App, mtpl, guid){
	var Package = new App;

	// 开放api
	Package.fn.extend({
		// HTML存储位置
		dom: '',

		// CSS存储位置
		css: '',

		// 检查组件是否准备好，默认为false
		isReady: false,

		// 组件初始化方法，不包含事件初始化，渲染到页面
		init: function(selector, data){
			this.check(selector, data);
			this.mustEvent();
		},

		// 组件初始化方法，包含事件初始化
		reg: function(selector, data){
			this.check(selector, data);
			this.mustEvent();
			this.Event();
		},

		// 初始化事件，此方法在组件js内定义
		Event: function(){
			// extend in instance
		},

		// 初始化必须事件
		mustEvent: function(){
			// extend in instance
		},
		
		// 根据用户传递的selector进行渲染
		render: function(selector, data){
			data = Package.parseData(data);
			this.id = data.id;
			$(selector).append(mtpl(this.dom, data));
		},

		// 返回数据由用户自由渲染
		html: function(data){
			data = Package.parseData(data);
			this.id = data.id;
			return $(mtpl(this.dom, data));
		},

		// 编译并渲染dom到指定的selector
		load: function(selector, data){
			// 检查是否存在selector，默认为body
			selector = selector || document.body;
			// 检查selector
			$.isPlainObject(selector) ? this.render('body', selector) : this.render(selector, data);

			// 通知组件已准备好
			this.isReady = true;
			return this.isReady;
		},

		// 检查dialog是否已准备好，可以充当初始化方法
		check: function(selector, data){
			if(this.arguments){
				this.dom = this.arguments[0];
				this.css = this.arguments[1];
			};

			return this.isReady ? this.isReady : this.load(selector, data);
		},

		// 用于组件位置设定，由组件js定义
		position: function(){
			// extend in instance
		},

		// 显示组件
		show: function(){
			this.check();
			this.element().show();
			this.position();
		},

		// 隐藏组件
		hide: function(){
			this.element().hide();
		},

		// 返回组件对象
		element: function(){
			return $('#' + this.id);
		},

		// 自定义事件功能，在initEvent方法内定义开放的自定义事件
		on: function(type, fn){
			this.element().on(type, fn);
		}

	});

	// 私有api
	Package.extend({
		parseData: function(data){
			$.isPlainObject(data) ? '' : data = {};
			data.id = data.id || 'cloverjs-' + guid();
			return data;
		}
	});

	return Package;
});