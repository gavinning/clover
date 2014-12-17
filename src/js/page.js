(function(){
var tags, ia, currentAnimate, cache, clover, inputs;

var parser = new Parser;

clover = {
	name: 'clover',
	author: 'gavinning',
	homepage: 'http://www.ilinco.com',
	github: 'https://github.com/gavinning/clover'
}

// 缓存动画相关数据
cache = {

	// 已格式化的动画参数
	animate: {},

	// 原始动画参数
	inputValue: {},

	tmp: {}
}


// var animateProcess = {
// 	className: '.testing.fadeIn',
// 	name: 'fadeIn',
// 	time: '1s',
// 	delay: '400ms',
// 	count: 1,
// 	function: 'ease',
// 	fillMode: 'forwards',
// 	frames: {
// 		'0%': ['opacity: 0'],
// 		'100%': ['opacity: 1']
// 	}
// }

/*
// 缓存数据模型

cache = {
	
	animate:{
	
		animateGuid: {
			time: tags.time.val(),
			delay: tags.time.val()
		}
	},

	inputValue: {
		
	}
}


*/

// Zepto扩展重绘
$.fn.reflow =  function (){
    this.each(function(){
        this.nodeType && this.nodeType==1 && getComputedStyle(this).zoom;
    }); 
    return this;
};


// 用于form表单数据重播
inputs = {

	lv1: 'time delay fn'.split(' '),

	lv2: 'opacity rotate scale translate3d'.split(' ')
};

// 页面对象
tags = {

	// 动画输入对象
	animateInput: function(){
		return $('.animate-data').find('.animate-input')
	},

	// 动画过程输入对象
	processInput: function(){
		return $('.animate-data').find('.process-input')
	},

	effectInput: function(name){
		return $('.animate-data').find('.process-input[effect='+name+']')
	},

	// 动画时间
	time: function(){
		return $('#aTime')
	},

	// 延迟时间
	delay: function(){
		return $('#aDealy')
	},

	// 动画轨迹
	fn: function(){
		return $('#aFunction')
	},

	// 透明度
	opacity: function(){
		return $('#aOpacity')
	},

	// 旋转
	rotate: function(){
		return $('#aRotate')
	},

	// 缩放
	scale: function(){
		return $('#aScale')
	},

	// 位移
	translate3d: function(){
		return $('#aTranslate3d')
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
}


// 界面交互相关
ia = {

	// 界面交互绑定
	bind: function(){
		$.each(clover.events, function(){
			this()
		})
	},

	// 生成guid，作为唯一标识对动画对象进行标记
	guid: function(){
		var time, random, id;

		time = (new Date()).getTime();

		random = function(){
			return Math.random()*Math.random()*time
		}

		id = function(){
			return ((time + random() * 0x10000) | 0).toString(16).slice(1)
		}

		return id() + id() + id()
	},

	// 获取当前帧
	getCurrentProcess: function(){
		return tags.currentProcess().attr('value')
	},

	// 获取所有帧
	getAllProcess: function(){
		var process = [];
		tags.process.each(function(i, item){
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

		// 清空所有动画表单
		this.clearAnimateInput()

		// 遍历缓存数据，重播表单缓存数据
		inputs.lv1.forEach(function(item){
			if(data[item]){
				tags[item]().val(data[item] || '')
			}
		})

		// 重播帧动画表单数据
		this.replayProcessInput();
	},

	// 重播输入对象数据
	// 只对帧动画表单部分生效
	replayProcessInput: function(){
		var data = cache.inputValue[clover.current.guid()];
		var process = clover.current.process();
		var processData;

		// 检查帧数据对象是否存在，不存在则创建
		data.frames[process] = data.frames[process] || {};
		processData = data.frames[process];

		// 清空帧动画表单
		this.clearProcessInput();

		// 遍历缓存数据，重播表单缓存数据
		inputs.lv2.forEach(function(item){
			if(processData[item]){
				tags[item]().val(processData[item] || '')
			}
		})
	},

	// 获取当前选中元素动画对象
	getElementAnimate: function(){
		// 获取当前动画对象
		currentAnimate = clover.current.animate();
		// 检查当前动画对象，不存在则新创建
		currentAnimate ? '' : this.createElementAnimate();
		// 开放全局接口
		clover.currentAnimate = currentAnimate;
	},

	// 创建新动画对象
	createElementAnimate: function(guid){
		guid = guid || clover.current.guid();
		// 创建动画数据存储对象
		cache.animate[guid] = currentAnimate = {guid: guid, frames: {}}
		// 创建原始数据存储对象
		cache.inputValue[guid] = {guid: guid, frames: {}}
	},

	play: function(){
		var element = $('[guid="'+ clover.current.guid() +'"]');
		var style = $('<style id="cloverViewStyle" type="text/css"></style>');

		cache.tmp[clover.current.guid()] = this.compile();
			
		if(element.hasClass('fadeIn')){
			element.removeClass('fadeIn').reflow().addClass('fadeIn')
		} else {
			style.append(parser.view(cache.tmp).join(''))
			$(document.head).append(style)
			element.addClass('fadeIn')
		}

		// this.compile()
		console.log(cache.animate)
		console.log(cache.tmp)
	},

	compile: function(){
		var data = cache.inputValue[clover.current.guid()];
		var newData = {frames: {}};

		var cssFunction = 'rotate scale translate3d'.split(' ');

		// 编译动画基础属性
		$.each(data, function(key, value){
			if(key === 'time' || key === 'delay'){
				newData[key] = parseTime(value);

			} else {
				newData[key] = value;
			}
		});

		// 编译frames对象里的动画过程
		$.each(data.frames, function(process, css){
			var arr = [];
			var transform = [];

			// 编译动画过程
			$.each(css, function(key, value){

				// 检查transform属性
				if(cssFunction.indexOf(key) >= 0){
					parseFunction(key, value) ?
						transform.push(parseFunction(key, value)):'';

				// 检查普通样式
				} else {
					parseStyle(key, value) ?
						arr.push(parseStyle(key, value)):'';
				}
			})
			
			// 合成transform
			parseTransform(transform) ? arr.push(parseTransform(transform)) : '';
			// 合成动画帧
			newData.frames[process] = arr;
		});

		return newData;

		function parseTime(time) {
			time = time || 0;
			if(Number(time) === 0 || time.indexOf('s')){
				return time;
			}
			return time + 's';
		}

		function parseStyle(key, value) {
			return value ?
				key + ':' + value : '';
		}

		function parseFunction(key, value) {
			return value ?
				key + '('+ value +')' : '';
		}

		function parseTransform(arr) {
			return arr.length ?
				'-webkit-transform: ' + arr.join(' ') : '';
		}
	}
}

// 返回当前环境变量
clover.current = {

	// 返回当前动画对象guid
	guid: function(){
		return tags.currentElement().attr('guid')
	},

	// 返回当前动画对象动画数据
	animate: function(){
		return cache.animate[this.guid()]
	},

	// 返回动画对象动画帧
	process: function(){
		return ia.getCurrentProcess()
	}
}

// 页面事件，所有事件将会在页面初始化之后绑定
clover.events = {

	// 动画过程交互
	animateProcess: function(){
		tags.process().click(function(){

			// 检查当前动画
			if(!clover.current.guid()){
				return alert('请选择或上传一个动画对象')
			}

			// 切换帧时，更新动画数据
			clover.data.save();
			// 切换到下一帧
			$(this).addClass('selected').siblings('.selected').removeClass('selected');
			// 清空动画过程参数
			ia.clearProcessInput()

			// 重播记录的原始数据
			ia.replayProcessInput();
		})
	},

	// 预览并保存动画
	viewAnimate: function(){
		tags.saveView().click(function(){
			clover.data.save();
			ia.play();
		})
	},

	// 动画元素
	animateElements: function(){
		tags.animateElements().click(function(){
			// 交互界面状态切换
			this.classList.add('selected')
			$(this).siblings('.selected').removeClass('selected')

			// 获取当前动画对象
			ia.getElementAnimate();

			// 重播记录的原始数据
			ia.replayAnimateInput();
		})
	},

	// 用于测试
	test: function(){
		$('#btnTest').click(function(){
			clover.data.save();

			// console.log(currentAnimate)
			
			console.log(parser.view(cache.animate).join(''))

			console.log(cache)
		})
	}
}

// 数据获取
clover.data = {

	// 保存当前动画
	save: function(){
		var guid = clover.current.guid();

		// 存储格式化数据
		currentAnimate.className	= '.fadeIn[guid="'+ guid +'"]';
		currentAnimate.name 		= guid;
		currentAnimate.count 		= 1;
		currentAnimate.mode 		= 'forwards';

		currentAnimate.time 		= clover.animates.time() || '1s';
		currentAnimate.delay 		= clover.animates.delay() || 0;
		currentAnimate.function 	= clover.animates.function() || 'ease';

		this.saveFrame(guid)

		// 存储原始数据
		cache.inputValue[guid].className	= '.fadeIn[guid="'+ guid +'"]';
		cache.inputValue[guid].name 		= guid;
		cache.inputValue[guid].count 		= 1;
		cache.inputValue[guid].mode 		= 'forwards';

		cache.inputValue[guid].time 		= tags.time().val();
		cache.inputValue[guid].delay		= tags.delay().val() || 0;
		cache.inputValue[guid].function 	= tags.fn().val() || 'ease';
	},

	// 保存当前动画过程
	saveFrame: function(guid){
		var process = clover.current.process();
		var frame, frames = cache.inputValue[guid].frames;

		// 存储格式化数据
		currentAnimate.frames[process] = clover.animates.getAnimate();

		// 存储原始数据
		frames[process] 	= frames[process] || {};
		frame 				= frames[process];
		frame.opacity 		= tags.opacity().val();
		frame.rotate 		= tags.rotate().val();
		frame.scale 		= tags.scale().val();
		frame.translate3d 	= tags.translate3d().val();
	}
}

// 动画参数相关
clover.animates = {

	opacity: function(){
		return this.getNormal('opacity')
	},

	transform: function(){
		return this.getTransform()
	},

	// --

	time: function(){
		return tags.time().val()
	},

	delay: function(){
		return tags.delay().val()
	},

	function: function(){
		return tags.fn().val()
	},

	// --

	// 获取动画相关参数
	getAnimate: function(arr, css){
		arr = [];
		css = [
			this.opacity(),
			this.transform()
		];

		css.forEach(function(arg){
			arg ? arr.push(arg) : '';
		})

		return arr;
	},

	// 获取普通样式
	getNormal: function(name){
		var res, args;

		args = tags.effectInput(name).val();
		args ? 
			res = name + ':' + args :
			res = '';

		return res;
	},

	// 获取transform相关属性的样式
	getTransform: function(){
		var res, args, transform = [];

		args = {
			rotate: tags.rotate().val(),
			translate3d: tags.translate3d().val()
		}

		args.rotate ? transform.push('rotate('+ args.rotate +')') : '';
		args.translate3d ? transform.push('translate3d('+ args.translate3d +')') : '';

		transform.length > 0 ? 
			res = '-webkit-transform:' + transform.join(' ') :
			res = '';

		return res;
	}
}


ia.bind()


clover.tags = tags;
clover.ia = ia;
clover.cache = cache;

window.clover = clover;

})() // end




