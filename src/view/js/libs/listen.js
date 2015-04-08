/*
 * @name listen
 * @description 消息订阅发布
 * @example-listen listen.on('login', fn)
 * @example-listen listen.on('user.login', fn)
 * @example-fire listen.fire('user.login')
 * @date 2015-03-11
 */

define(function(){
	function Listen() {
		var map = {};
		var defaultStatus = 'defaultStatus';

		this.on = function(id, fn){
			var name, status, arr;

			// 拆分订阅id
			arr = id.split('.');
			// 订阅的消息命名空间
			name = arr[0];
			// 订阅的消息状态
			status = arr[1] || defaultStatus;

			// 检查是否已存在订阅信息
			// 不存在则创建订阅Map
			if(!map[name]){
				map[name] = {};
				map[name].events = {};
				map[name].events[status] = [];
			};

			// 检查当前状态监听信息
			// 如果是首次监听则初始化监听数组
			map[name].events[status] ? '' : map[name].events[status] = [];

			// 检查当前订阅信息状态，如果已有消息，则分发
			map[name].status === status ? fn() : '';

			// 添加订阅信息
			map[name].events[status].push(fn);
		};

		this.off = function(){
			console.log('listen.off 尚未开发，请联系作者')
		};

		this.fire = function(id){
			var arr, name, status, args;

			arr = id.split('.');
			name = arr[0];
			status = arr[1] || defaultStatus;
			args = [].slice.call(arguments, 1);

			// 检查是否有订阅者
			if(!map[name]) return;

			// 执行消息分发
			map[name].events[status].forEach(function(item){
				item.apply(null, args);
			});
			// 更新订阅状态
			map[name].status = status;
		};

	};
	return Listen;
});


/*

Map数据模型

var map = {
	
	nameSpace: {

		status: String,

		events: {
			login: [fn],
			logout: [fn]
		}
	}
}

*/
