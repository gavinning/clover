/*

@name linco.app
@description 用于插件扩展类

@example1 直接实例使用
var lib = new App;
lib.extend({});					// 扩展lib
lib.export(name, fn|| {});		// 为lib扩展插件
lib.app[name];					// app为插件命名空间，用下面方法访问插件

@example2 作为父类使用
var Person = new className(App);
Person.fn.extend({});			// 扩展类公开api
Person.extend({});				// 扩展类私有api
var person = new Person;		// 实例化 - 用法同上
person.extend({});				// 扩展person
person.export(name, fn|| {});	// 为person扩展插件
person.app[name];				// app为插件命名空间，用下面方法访问插件

@date 2015-04-09

 */ 

define(['zepto', 'class'], function($, className){
	var app = new className;

	app.fn.extend({
		name: 'linco.app',

		// 插件入口
		app: {},

		// 插件入口
		exports: function(id, fn){

			// 当id为匿名函数，返回运行结果
			if($.isFunction(id)){
				return id()
			}

			if(typeof id === 'string'){
				$.type(fn) === 'function' ? this.app[id] = fn.call({extend: this.extend}) : this.app[id] = fn;
			}
		}

	});
	
	// 公共方法模块定义
	app.fn.exports('base', {

		// 用于item切换
		slideItem: function(obj){
			$(obj).addClass('selected').siblings('.selected').removeClass('selected');
		},

		removeItem: function(obj){
			$(obj).removeClass('selected');
		},

		delay: function(time, fn){
			return setTimeout(fn, time);
		}
	});

	return app;
});