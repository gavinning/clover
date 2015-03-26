// Linco.clover Parser

define(['zepto'], function($){

var Parser;

Parser = function(){
	var self = this;

	this.extend = function(obj){
		$.extend(this, obj)
	}

	this.extend({
		// 开始编译css样式
		parseArguments: function(obj) {
			var css = [];
			$.each(obj, function(key, value){
				css.push(self.buildAnimate(value))
			})
			return css.join('');
		},

		// 编译初始化css
		buildInit: function(data){
			var style = ['[guid="', data.guid, '"]{'];
			var css = [];
			$.each(data.init, function(key, value){
				css.push(key + ':' + value);
			});

			style.push(css.join(';'));
			style.push('}');

			return style.join('');
		},

		// 编译css
		buildStyle: function(data) {
			var base = data.base;
			var str1 = [base.name, base.time, base.count, base.function, base.delay, base.mode].join(' ');
			var str2 = [base.className, '{ -webkit-animation:', str1, '}'].join(' ');
			return str2;
		},

		// 编译key-frames
		buildFrame: function(data) {
			var frame, frames = [];
			var obj = data.frames;

			for(var i in obj){
				frames.push(i + ' {' + obj[i].join(';') + '}')
			}

			// 格式化 keyframes
			frame = ['@-webkit-keyframes', data.base.name, '{', frames.join(' '), '}'].join(' ')

			return frame
		},

		// 编译动画数据为css
		buildAnimate: function(data) {
			return this.buildInit(data) + this.buildStyle(data) + this.buildFrame(data)
		},

		// 编译器入口
		render: function(data){
			var obj = {};

			// 分段格式化动画数据
			$.each(data, function(key, value){
				obj[key] = self.compile(value)
			})

			return this.parseArguments(obj)
		},

		// 格式化单个动画对象
		compile: function(data){
			var res = {frames: {}};
			var cssFunction = 'rotate rotateX rotateY rotateZ scale translate3d translate translateZ'.split(' ');

			res.guid = data.guid;
			res.base = data.base;
			res.init = data.init;

			// 编译frames对象里的动画过程
			$.each(data.frames, function(processId, css){
				var arr = [];
				var transform = [];
				var process = css.value;

				// 编译动画过程
				$.each(css, function(key, value){
					// 跳过不需要处理的属性
					if(key === 'value') return;

					// 检查transform属性
					if(cssFunction.indexOf(key) >= 0){
						self.parseFunction(key, value) ?
							transform.push(self.parseFunction(key, value)):'';

					// 检查普通样式
					} else {
						self.parseStyle(key, value) ?
							arr.push(self.parseStyle(key, value)):'';
					}
				})
				
				// 合成transform
				self.parseTransform(transform) ? arr.push(self.parseTransform(transform)) : '';
				// 合成动画帧
				res.frames[process] = arr;
			});

			return res;

			/* res 数据结构
			
				res = {
					guid, String,

					base{
						time: String,
						delay: String
						// key: value
					},

					frames: {
						'0%': ['opacity: 0', 'rotate(0)'],
						'100%': ['opacity: 1', 'rotate(360deg)']
					}
				}

			*/
		},

		// 格式化普通样式
		parseStyle: function(key, value) {
			return value ?
				key + ':' + value : '';
		},

		// 格式化Function样式
		parseFunction: function(key, value) {
			return value ?
				key + '('+ value +')' : '';
		},

		// 格式化Transform样式
		parseTransform: function (arr) {
			return arr.length ?
				'-webkit-transform: ' + arr.join(' ') : '';
		}


	});

	return this;
}



return Parser;
}); // end
