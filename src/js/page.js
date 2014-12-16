(function(){
var tags, ia, currentAnimate, cache = {}, clover;

clover = {
	name: 'clover',
	author: 'gavinning',
	homepage: 'http://www.ilinco.com',
	github: 'https://github.com/gavinning/clover'
}

// 缓存动画相关数据
cache.animate = {}


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
	}
}


*/

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
	replayAnimateInput: function(){
		this.clearAnimateInput()

		if(currentAnimate.frames[this.getCurrentProcess()]){

		}
	},

	// 重播输入对象数据
	replayProcessInput: function(){
		this.clearProcessInput()

		if(currentAnimate.frames[this.getCurrentProcess()]){

		}
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
		cache.animate[guid] = currentAnimate = {guid: guid, frames: {}}
	}
}

clover.current = {

	guid: function(){
		return tags.currentElement().attr('guid')
	},

	animate: function(){
		return cache.animate[this.guid()]
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
		})
	},

	// 预览并保存动画
	viewAnimate: function(){
		tags.saveView().click(function(){
			clover.data.save();
			console.log(currentAnimate)
			view([currentAnimate])
			$('.testing').addClass('fadeIn')
		})
	},

	// 动画元素
	animateElements: function(){
		tags.animateElements().click(function(){
			// 交互界面状态切换
			this.classList.add('selected')
			$(this).siblings('.selected').removeClass('selected')

			// 获取当前动画对象
			ia.getElementAnimate()
		})
	}
}

// 数据获取
clover.data = {

	// 保存当前动画
	save: function(){
		currentAnimate.className= '.testing.fadeIn';
		currentAnimate.name 	= 'fadeIn';
		currentAnimate.count 	= 1;
		currentAnimate.mode 	= 'forwards';

		currentAnimate.time 	= clover.animates.time() || '1s';
		currentAnimate.delay 	= clover.animates.delay() || 0;
		currentAnimate.function = clover.animates.function() || 'ease';

		this.saveFrame()
	},

	// 保存当前动画过程
	saveFrame: function(){
		currentAnimate.frames[ia.getCurrentProcess()] = clover.animates.getAnimate();
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
		arr = []
		css = [
			this.opacity(),
			this.transform()
		]

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




