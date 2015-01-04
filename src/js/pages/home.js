define(['zepto', 'parser', 'guid'], function($, Parser, guid){
var tags, ia, cache, clover;
var parser = new Parser;

clover = {
	name: 'clover',
	author: 'gavinning',
	homepage: 'http://www.ilinco.com',
	github: 'https://github.com/gavinning/clover',
	exports: {}
}

// 缓存动画相关数据
cache = {

	// 占坑
	animate: {},

	// 原始动画参数
	inputValue: {},

	tmp: {}
}



// 缓存数据模型
/*
cache = {

	inputValue: {

		animateGuid: {
			init: {
				width: String,
				height: String,
				opacity: Number
			},

			cssInput: String,

			base: {
				className: String,
				count: Number,
				delay: String,
				time: String,
				name: 'clover' + guid,
				mode: String
			},
			
			frames: {
				process|'0%': {
					opacity: Number,
					rotate: String
				}
			}
		}
	}

}
*/





// 页面对象
tags = {

	// 输入框
	input: function(sign){
		return $('.forms').find('.animate-input[sign="'+sign+'"]')
	},

	// 动画输入对象
	animateInput: function(){
		return $('.forms').find('.animate-input')
	},

	// 动画过程输入对象
	processInput: function(){
		return $('.forms').find('.process-input')
	},

	// 动画停驻状态
	mode: function(){
		return this.input('mode')
	},

	// 动画次数
	count: function(){
		return this.input('count')
	},

	// 动画时间
	time: function(){
		return this.input('time')
	},

	// 延迟时间
	delay: function(){
		return this.input('delay')
	},

	// 动画轨迹
	fn: function(){
		return this.input('function')
	},

	// 透明度
	opacity: function(){
		return this.input('opacity')
	},

	// 旋转
	rotate: function(){
		return this.input('rotate')
	},

	// 缩放
	scale: function(){
		return this.input('scale')
	},

	// 位移
	translate3d: function(){
		return this.input('translate3d')
	},

	// 保存并预览
	saveView: function(){
		return $('#btnView')
	},

	// 新建项目
	createProject: function(){
		return $('#createProject')
	},

	// 新建页面
	createPage: function(){
		return $('#createPage')
	},

	// 新增动画过程
	addProcess: function(){
		return $('#addProcess')
	},

	// 动画过程
	process: function(){
		return $('.animate-process').find('.btn')
	},

	// 当前帧
	currentProcess: function(){
		return $('.animate-process').find('.selected')
	},

	// 第一帧
	firstProcess: function(){
		return $('.animate-process').find('.first')
	},

	// 最后一帧
	lastProcess: function(){
		return $('.animate-process').find('.last')
	},

	// 画布
	canvas: function(){
		return $('#dragCanvas')
	},

	// 当前动画元素
	currentElement: function(){
		return this.canvas().find('.selected')
	},

	// 所有动画元素
	animateElements: function(){
		return this.canvas().find('.ap')
	},

	guid: function(guid){
		return this.canvas().find('[guid='+ guid +']')
	}
};

// UI事件绑定
clover.bind = function(){
	$.each(clover.events, function(){
		this()
	});
};


// 界面交互相关
ia = {

	// 获取所有帧
	getAllProcess: function(){
		var process = [];
		tags.process().each(function(i, item){
			process.push(item.getAttribute('value'))
		})
		return process
	},

	// 清空动画输入对象
	clearAnimateInput: function(){
		tags.animateInput().val('')
	},

	// 清空动画过程输入对象
	clearProcessInput: function(){
		tags.processInput().val('')
	},

	// 重播输入对象数据
	// 对所有动画表单生效
	replayAnimateInput: function(){
		var data = cache.inputValue[clover.current.guid()];

		if(!data.base || $.isEmptyObject(data.base)) return;

		// 清空所有动画表单
		this.clearAnimateInput();

		// 重播数据
		$.each(data.base || {}, function(key, value){
			value.toString() ? tags.input(key).val(value) : '';
		});

		// 重播帧动画表单数据
		this.replayProcessInput();
	},

	// 重播输入对象数据
	// 只对帧动画表单部分生效
	replayProcessInput: function(){
		var data = cache.inputValue[clover.current.guid()];
		var process = clover.current.process();

		// 清空帧动画表单
		this.clearProcessInput();

		// 重播数据
		$.each(data.frames[process] || {}, function(key, value){
			value.toString() ? tags.input(key).val(value) : '';
		})
	},

	// 获取当前选中元素动画对象
	getElementAnimate: function(){
		return clover.current.animate() || this.createElementAnimate();
	},

	// 创建新动画对象
	createElementAnimate: function(guid){
		guid = guid || clover.current.guid();
		// 创建原始数据存储对象
		cache.inputValue[guid] = this.createAnimateObject(guid);
		return cache.inputValue[guid];
	},

	// 创建动画对象原型 
	createAnimateObject: function(guid){
		return {guid: guid, init: {}, base: {}, frames: {}}
	},

	// 播放动画
	play: function(){
		var tag, css;

		// 检查当前页面动画对象是否为空，为空则返回
		if($.isEmptyObject(clover.cache.inputValue)) return;

		tag = tags.animateElements();
		css = parser.render(cache.inputValue);

		// 添加样式到dom树
		this.appendAnimate(css)

		// 执行动画
		tag.removeClass('fadeIn').reflow().addClass('fadeIn')
	},

	// 添加动画相关样式到dom树
	appendAnimate: function(data){
		var css = $('<style id="cloverViewStyle" type="text/css"></style>');
		$('#cloverViewStyle').remove();
		css.append(data);
		$(document.head).append(css)
	},

	// 计算动画元素位移位置信息
	calcTranslate3d: function(){
		var animate, tag, x, y, z;

		animate = clover.cache.inputValue[clover.current.guid()];
		tag = clover.current.element();

		x = tag.css('left').replace('px', '') - animate.init.left.replace('px', '');
		y = tag.css('top').replace('px', '') - animate.init.top.replace('px', '');
		z = 0;

		return {x: x, y: y, z: z}
	}
};

// 返回当前环境变量
clover.current = {

	// 返回当前动画对象guid
	guid: function(){
		return tags.currentElement().attr('guid')
	},

	// 返回当前动画对象动画数据
	animate: function(){
		return cache.inputValue[this.guid()]
	},

	// 返回动画对象动画帧
	process: function(){
		return tags.currentProcess().attr('value')
	},

	// 返回当前动画对象元素
	element: function(){
		return tags.currentElement();
	}
};

// 页面事件，所有事件将会在页面初始化之后绑定
clover.events = {

	// 动画过程交互
	animateProcess: function(){
		tags.process().click(function(){

			// 检查当前动画
			if(!clover.current.guid()){
				return alert('请选择或上传一个动画对象')
			};

			// 切换帧时，更新动画数据
			clover.data.save();
			// 切换到下一帧
			$(this).addClass('selected').siblings('.selected').removeClass('selected');
			// 清空动画过程参数
			ia.clearProcessInput();

			// 重播记录的原始数据
			ia.replayProcessInput();
		})
	},

	// 预览并保存动画
	viewAnimate: function(){
		tags.saveView().click(function(){
			// 存储当前状态数据
			clover.data.save();
			ia.play();
		})
	},

	// 动画元素
	animateElements: function(){
		tags.animateElements().click(function(){
			// 存储当前状态数据
			if(clover.current.guid()){
				clover.data.save();
			}

			// 交互界面状态切换
			this.classList.add('selected')
			$(this).siblings('.selected').removeClass('selected')

			// 获取当前动画对象
			ia.getElementAnimate();

			// 重播记录的原始数据
			ia.replayAnimateInput();

		})
	},

	// 参数输入控件事件绑定
	effectInput: function(){
		$('.effect-label').delegate('input[type="range"]', 'input', function(){
			var value, algorithm, unit;

			// 获取倍数
			algorithm = this.getAttribute('algorithm') || 1;
			// 获取单位
			unit = this.getAttribute('unit') || '';
			// 获取最终结果
			value = (this.value * algorithm).toString().slice(0, 4) + unit;

			$(this).prev('input[type="text"]').val(value)
		})
	},


	test: function(){
		$('#btnTest').click(function(){
			clover.data.save();

			// console.log(currentAnimate)
			
			ia.calcTranslate3d()

			console.log(cache)
		})
	}
};

// 数据存储
clover.data = {

	// 保存当前动画
	save: function(){
		var guid = clover.current.guid();

		// 检查动画对象是否存在
		ia.getElementAnimate();

		if(!guid) return;

		// 存储原始数据
		cache.inputValue[guid].base = {
			className: '.fadeIn[guid="'+ guid +'"]',
			name: clover.name + guid,
			count: tags.count().val() || 1,
			mode: tags.mode().val() || 'forwards',
			time: tags.time().val() || '1s',
			delay: tags.delay().val().toString() || 0,
			function: tags.fn().val().toString() || 'ease'
		}

		this.saveFrame(guid)
	},

	// 保存当前动画过程
	saveFrame: function(guid){
		var process = clover.current.process();
		var inputs = clover.tags.processInput();
		var sign, frame, element;

		// 检查frame对象是否存在
		cache.inputValue[guid].frames[process] = cache.inputValue[guid].frames[process] || {};
		frame = cache.inputValue[guid].frames[process];

		// 存储相关数据
		inputs.each(function(){
			sign = this.getAttribute('sign');
			frame[sign] = tags.input(sign).val().toString();
		});

		// 存储初始化数据
		if(process === '0%'){
			element = clover.current.element();
			$.extend(cache.inputValue[guid].init, {
				top: element.css('top'),
				left: element.css('left')
			});
		};

		// 存储位移位置信息
	}

	// 格式化单位
	// parseUnit: function(tag){
	// 	var value = tag.val();
	// 	return value ?
	// 		value + (tag.attr('unit') || ''):
	// 		value;
	// }
};


clover.tags = tags;
clover.ia = ia;
clover.cache = cache;

window.clover = clover;

return clover;
});




