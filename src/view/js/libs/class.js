/*

@name class.js
@description 用于生成类
@author gavinning
@homepage http://ilinco.com http://cloverjs.cc

@example 插件功能使用示例
var Person = new App(parent);
Person.fn.extend({});			// 扩展类公开api
Person.extend({});				// 扩展类私有api
var person = new Person;		// 类实例化
person.extend({});				// 扩展实例
person.export(name, fn|| {});	// 为实例扩展插件
person.app[name];				// app为插件命名空间，person.app[name]访问插件

@date 2015-04-08

 */

define(['jq'], function($){

	// 父类
	var App = function(parent) {
		var app, child;

		// 子类
		app = function() {
			this.args.apply(this, arguments);
			// 插件命名空间
			this.app = new Object();
			// 基础插件
			this.app.base = {

				// 用于item切换
				slideItem: function(obj){
					$(obj).addClass('selected').siblings('.selected').removeClass('selected');
				},

				removeItem: function(obj){
					$(obj).removeClass('selected');
				},

				// 专用于动画ap属性切换
				slideAp: function(obj){
					$(obj).attr('ap', 'selected').siblings('[ap="selected"]').attr('ap', 'ap');
				},

				delay: function(time, fn){
					if(typeof time === 'function'){
						fn = time;
						time = 0;
					};
					return setTimeout(fn, time);
				}
			};
		};

		// 是否存在需要继承的对象
		if(parent){
			child = function(){};
			child.prototype = parent.prototype;
			app.prototype = new child;
		};

		// prototype别名
		app.fn = app.prototype;

		// 子类参数传递
		app.fn.args = function(){
			arguments.length ? this.arguments = arguments : '';
		};

		// 扩展方法，核心方法
		app.extend = app.fn.extend = function(){
			return arguments.length === 1 ?
				$.extend(this, arguments[0]):
				$.extend.apply(this, [].slice.call(arguments, 0));
		};

		// 扩展插件
		app.fn.extend({
			// 类实例公有 环境变量方法
			current: {},

			// 插件入口
			exports: function(id, fn){
				var obj = {};

				obj.extend = this.extend;

				// 当id为匿名函数，返回运行结果
				if($.isFunction(id)){
					obj.id = null;
					obj.type =  null;
					return id.call(obj)
				}

				if(typeof id === 'string'){
					obj.id = id;
					obj.type = id;
					$.type(fn) === 'function' ? this.app[id] = fn.call(obj) : this.app[id] = fn;
				}
			}

		});

		return app;
	};

	
	return App;
});