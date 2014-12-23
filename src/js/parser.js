// Linco.clover Parser

;(function(){

var Parser;

Parser = function(){

	this.extend = function(obj){
		$.extend(this, obj)
	}

	this.extend({

		parseArguments: function(obj) {
			var self = this;
			var css = [];
			$.each(obj, function(key, value){
				css.push(self.buildAnimate(value))
			})
			return css;
		},

		buildStyle: function(data) {
			var str1 = [data.base.name, data.base.time, data.base.count, data.base.function, data.base.delay, data.base.mode].join(' ')
			var str2 = [data.base.className, '{ -webkit-animation:', str1, '}'].join(' ')
			return str2
		},

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

		buildAnimate: function(data) {
			return this.buildStyle(data) + this.buildFrame(data)
		},

		view: function(animates) {
			return this.parseArguments(animates)
		},

		compile: function(data){
			var self = this;
			var res = {frames: {}};
			var cssFunction = 'rotate rotateX rotateY rotateZ scale translate3d translate translateZ'.split(' ');

			res.guid = data.guid;
			res.base = data.base;
			// 编译动画时间参数
			res.base.time = this.parseTime(data.base.time);
			res.base.delay = this.parseTime(data.base.delay);

			console.log(data.base.time, this.parseTime(data.base.time), 1234)

			// 编译frames对象里的动画过程
			$.each(data.frames, function(process, css){
				var arr = [];
				var transform = [];

				// 编译动画过程
				$.each(css, function(key, value){

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
					time: String,
					delay: String,

					frames: {
						'0%': ['opacity: 0', 'rotate(0)'],
						'100%': ['opacity: 1', 'rotate(360deg)']
					}
				}

			*/
		},

		parseTime: function(time) {
			time = time || 0;
			if(Number(time) === 0 || String(time).indexOf('s') >=0){
				return time;
			}
			return time + 's';
		},

		parseStyle: function(key, value) {
			return value ?
				key + ':' + value : '';
		},

		parseFunction: function(key, value) {
			return value ?
				key + '('+ value +')' : '';
		},

		parseTransform: function (arr) {
			return arr.length ?
				'-webkit-transform: ' + arr.join(' ') : '';
		}


	})

	return this;
}



window.Parser = Parser;
})(); // end