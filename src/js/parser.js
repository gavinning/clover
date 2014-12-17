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
			var str1 = [data.name, data.time, data.count, data.function, data.delay, data.mode].join(' ')
			var str2 = [data.className, '{ -webkit-animation:', str1, '}'].join(' ')
			return str2
		},

		buildFrame: function(data) {
			var frame, frames = [];
			var obj = data.frames;

			for(var i in obj){
				frames.push(i + ' {' + obj[i].join(';') + '}')
			}

			// 格式化 keyframes
			frame = ['@-webkit-keyframes', data.name, '{', frames.join(' '), '}'].join(' ')

			return frame
		},

		buildAnimate: function(data) {
			return this.buildStyle(data) + this.buildFrame(data)
		},

		view: function(animates) {
			return this.parseArguments(animates)
		}

	})

	return this;
}

var parser = new Parser;

// console.log(parser)







window.Parser = Parser;
})(); // end