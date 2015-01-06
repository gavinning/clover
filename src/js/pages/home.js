define(['zepto', 'parser', 'guid', 'dragDom', 'dragInpage'], function($, Parser, createGuid, dragDom, dragInpage){
var tags, ia, cache, clover, isAnimate;
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

// 存储动画状态
isAnimate = {};
/*
isAnimate = {
	animateGuid: true
}
*/

// 缓存数据模型
/*
cache = {

	inputValue: {

		animateGuid: {
			init: {
				width: String,
				height: String,
				opacity: Number,
				top: String,
				left: String
			},

			// 记录帧位置信息
			place: {
				process|'0%': {
					left: String,
					top: String
				}
			},

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

	resetAnimate: function(){
		return $('#resetAnimate')
	},

	clearAnimate: function(){
		return $('#clearAnimate')
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

	// 动画过程父级
	processParent: function(){
		return $('.animate-process');
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
		// tags.animateInput().val('')
		tags.animateInput().each(function(){
			// 检查是否有默认值
			var dataValue = this.getAttribute('data-value');
			dataValue ?
				this.value = dataValue:
				this.value = '';
		})
	},

	// 清空动画过程输入对象
	clearProcessInput: function(){
		// tags.processInput().val('')
		tags.processInput().each(function(){
			// 检查是否有默认值
			var dataValue = this.getAttribute('data-value');
			dataValue ?
				this.value = dataValue:
				this.value = '';
		})
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

	// 重播当前动画元素当前帧位置信息
	replayProcessPlace: function(){
		var element = clover.current.element();
		var process = clover.current.process();
		var data = clover.current.animate().place[process] || {};

		// 还原上次记录当前帧位置信息
		element.css({left: data.left || 0, top: data.top || 0})
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
		return {guid: guid, place: {}, init: {}, base: {}, frames: {}}
	},

	// 重建动画对象
	reBuildAnimate: function(guid){
		guid = guid || clover.current.guid();
		clover.cache.inputValue[guid] = this.createAnimateObject(guid);
		return clover.cache.inputValue[guid];
	},

	// 播放动画
	play: function(guid){
		var tag, css, data = {};

		guid ?
			data[guid] = cache.inputValue[guid]:
			data = cache.inputValue;

		// 检查当前页面动画对象是否为空，为空则返回
		if($.isEmptyObject(clover.cache.inputValue)) return;

		tag = tags.animateElements();
		css = parser.render(data);

		// 添加样式到dom树
		this.appendAnimate(css);

		// 执行动画
		tag.removeClass('fadeIn').reflow().addClass('fadeIn');
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

		x = tag.css('left').replace('px', '') - animate.init.left.replace('px', '') + 'px';
		y = tag.css('top').replace('px', '') - animate.init.top.replace('px', '') + 'px';
		z = 0;

		// 赋值给位置表单，以便程序自动收集
		tags.input('translate3d').val([x,y,z].join(','));
	},

	// 清空拖拽生成的位置信息，返回动画元素起点
	// 1.动画开始前需要将动画元素还原到初始化位置开始做动画
	// 2.为了兼容drag-dom组件的原因，不能直接删掉元素行内left top的位置信息，否则拖拽将无法正常工作
	// 3.基于以上原因，初始化时，将位置信息更新为用户设定的初始化位置信息
	resetAnimatePlace: function(data){
		data = data || clover.current.animate();
		tags.animateElements().css({top: data.place['0%'].top || 0, left: data.place['0%'].left || 0})
	},

	// 清空动画状态，解决因translate3d位移引起的动画元素定位不准确的问题
	clearFadeIn: function(){
		tags.animateElements().removeClass('fadeIn')
	},

	// 使得动画元素行内样式的left top值停留在动画结束的位置
	goAnimateLast: function(data){
		data = data || clover.current.animate();
		clover.current.element().css({top: data.place['100%'].top || 0, left: data.place['100%'].left || 0})
	},

	// 格式化时间
	formatTime: function(time){
		return time.match(/ms/) ? time.replace('ms', '') : Number(time.replace('s', ''))*1000
	},

	// 只切换帧，不保存上一帧状态
	changeProcess: function(process){
		// 切换到下一帧
		tags.processParent().find('[value="'+process+'"]')
			.addClass('selected').siblings('.selected').removeClass('selected');

		// 清空动画过程参数
		ia.clearProcessInput();

		// 重播记录的原始数据
		ia.replayProcessInput();

		// 回归动画元素当前帧位置信息
		ia.replayProcessPlace();

		// 首次计算当前关键帧的位移信息
		// 选中当前帧时即开始计算，有时候最后一帧是初始位置
		// ia.calcTranslate3d();
	},

	// 切换动画元素
	changeElement: function(tag){
		// 清空动画过程参数
		ia.clearAnimateInput();

		// 重播记录的原始数据
		ia.replayAnimateInput();

		tags.canvas().find(tag).addClass('selected').siblings('.selected').removeClass('selected')
	},

	// 绑定动画元素拖拽事件
	drag: function(tag, src) {
		var x, xm, y, ym, canvas, ap;

		// 检查是否存在src
		// 如果有src则异步load图片
		// 图片加载完成之后绑定拖拽事件
		if(src){
			return this.loadImg(src, function(){
				ia.drag(tag);
			})
		};

		// 绑定拖拽事件
		ap = $(tag);
		canvas = tags.canvas();

		x = 0;
		y = 0;
		xm = x + canvas.width() - ap.width();
		ym = y + canvas.height() - ap.height();

		dragDom.init(document.querySelector(tag), null, x, xm, y, ym);
	},

	// 加载图片
	loadImg: function(src, callback){
		var img = new Image();
		img.src = src;
		img.onload = callback || function(){};
	}

};

// 返回当前环境变量
clover.current = {

	// 返回当前动画对象guid
	guid: function(){
		return this.element().attr('guid')
	},

	// 返回当前动画对象动画数据
	animate: function(){
		console.log(this.element())
		return cache.inputValue[this.guid()]
	},

	// 返回动画对象动画帧
	process: function(){
		return tags.currentProcess().attr('value')
	},

	// 返回当前动画对象元素
	element: function(){
		return tags.currentElement();
	},

	prevProcess: function(){
		return null;
	}
};

// 页面事件，所有事件将会在页面初始化之后绑定
clover.events = {

	// 动画过程交互
	// 点击切换帧时的交互逻辑
	animateProcess: function(){
		tags.process().click(function(){
			var process = clover.current.process();

			// 检查当前动画
			if(!clover.current.guid()){
				return alert('请选择或上传一个动画对象')
			};

			// 重载上一帧方法
			clover.current.prevProcess = function(){
				return process;
			};

			// 切换帧时，更新动画数据
			// 防止第一帧动画丢失
			clover.data.save();

			// 切换到下一帧
			$(this).addClass('selected').siblings('.selected').removeClass('selected');
			// 清空动画过程参数
			ia.clearProcessInput();

			// 重播记录的原始数据
			ia.replayProcessInput();

			// 回归动画元素当前帧位置信息
			ia.replayProcessPlace();

			// 首次计算当前关键帧的位移信息
			// 选中当前帧时即开始计算，有时候最后一帧是初始位置
			ia.calcTranslate3d();
		});
	},

	// 预览并保存当前选中动画
	viewAnimate: function(){
		var st;

		tags.saveView().click(function(){
			var data, time, guid;

			guid = clover.current.guid();

			// 检查当前元素是否处于动画状态
			if(isAnimate[guid]) return;
			isAnimate[guid] = true;

			// 计算位移
			ia.calcTranslate3d();
			// 存储当前状态数据
			clover.data.save();

			// 获取当前动画数据
			data = clover.current.animate();
			// 获取当前动画过程时间
			time = ia.formatTime(data.base.time);

			// 清空拖拽生成的位置信息，返回动画元素起点
			ia.resetAnimatePlace(data);

			// 设置动画状态停驻问题
			clearTimeout(st)
			st = setTimeout(function(){

				// 删除动画过程，避免动画过程对现有动画元素造成的影响
				ia.clearFadeIn();
				// 使动画元素停驻在动画结束的位置
				ia.goAnimateLast(data);
				// 切换当前帧为最后一帧
				// 修正因动画状态结束停驻的位置，对下一次数据保存操作造成的影响
				ia.changeProcess('100%');

				// 改变当前动画过程标识
				// 增强程序可靠性
				isAnimate[guid] = false;

			}, time);

			// 播放动画
			ia.play(guid);
		})
	},

	// 清空当前元素动画
	clearAnimate: function(){
		tags.clearAnimate().click(function(){
			var guid = clover.current.guid();

			// 删除fadeIn类
			ia.clearFadeIn();
			// 清空动画帧输入框数据
			ia.clearProcessInput();
			// 切换到第一帧
			ia.changeProcess('0%');
			// 重建动画对象
			ia.reBuildAnimate(guid);
			// 初始化动画对象
			clover.data.saveAll();
			// 设置当前动画过程为false
			isAnimate[guid] = false;
		});
	},

	// 动画元素
	animateElements: function(){
		$(document).delegate('.ap', 'click', function(){
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

	// 监听动画过程
	isAnimate: function(){
		// 检查动画过程
		document.addEventListener('webkitAnimationEnd', function(e){
			isAnimate[e.target.getAttribute('guid')] = false;
		}, false);
	},

	// 拖拽动画元素到画布
	dragInpage: function(){
		dragInpage(document, function(url){
			var gid = createGuid();
			var tag = '.ap[guid="'+gid+'"]';

			// 添加动画元素到画布
			tags.canvas().append('<img guid="'+gid+'" src="'+url+'" class="ap selected">');
			// 创建元素动画
			ia.createElementAnimate(gid);
			// 选定当前拖拽元素
			ia.changeElement(tag);
			// 检查动画对象是否存在
			ia.getElementAnimate();
			// 为动画对象存储初始化数据
			clover.data.saveAll(gid);
			// 绑定元素拖动事件
			ia.drag(tag, url);
			// 动画帧指向0%
			ia.changeProcess('0%');
		});
	},

	initAnimate: function(){
		if(!clover.current.guid()) return;

		ia.drag('.ap[guid="'+clover.current.guid()+'"]');
		// 检查动画对象是否存在
		ia.getElementAnimate();
		// 为动画对象存储初始化数据
		clover.data.saveAll();
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

	// 保存所有动画当前帧信息
	save: function(){
		var process = clover.current.process();
		var data = clover.current.animate();

		this.saveInit(data, process);
		this.saveBase(data, process);
		this.saveFrame(data, process);
		this.savePlace(data, process);
	},

	// 保存所有动画所有帧信息
	saveAll: function(){
		var process = clover.current.process();
		var data = clover.current.animate();

		this.saveInit(data, process);
		this.saveBase(data, process);
		this.saveAllFrame(data, process);
		this.saveAllPlace(data, process);
	},

	// 保存当前动画基本信息
	saveBase: function(data, process){
		data = data || clover.current.animate();
		process = process || clover.current.process();

		if(!data.guid) return;

		// 存储原始数据
		data.base = {
			className: '.fadeIn[guid="'+ data.guid +'"]',
			name: clover.name + data.guid,
			count: tags.count().val() || 1,
			mode: tags.mode().val() || 'forwards',
			time: tags.time().val() || '1s',
			delay: tags.delay().val().toString() || 0,
			function: tags.fn().val().toString() || 'ease'
		};
	},

	// 保存当前帧动画过程
	saveFrame: function(data, process){
		var inputs = clover.tags.processInput();
		var sign, frame;

		data = data || clover.current.animate();
		process = process || clover.current.process();

		// 检查frame对象是否存在
		data.frames[process] = data.frames[process] || {};
		frame = data.frames[process];

		// 存储相关数据
		inputs.each(function(){
			sign = this.getAttribute('sign');
			frame[sign] = tags.input(sign).val().toString();
		});
	},

	saveAllFrame: function(data){
		var btnProcess = tags.process();

		data = data || clover.current.animate();

		$.each(btnProcess, function(){
			clover.data.saveFrame(data, this.getAttribute('value'))
		});
	},

	// 存储初始化数据
	saveInit: function(data, process){
		var element = clover.current.element();

		data = data || clover.current.animate();
		process = process || clover.current.process();

		if(process === '0%'){
			element = clover.current.element();
			$.extend(data.init, {
				top: element.css('top') || 0,
				left: element.css('left') || 0
			});
		};
	},

	// 记录当前帧位置信息
	savePlace: function(data, process){
		var element = clover.current.element();
		var left = element.css('left');
		var top = element.css('top');

		data = data || clover.current.animate();
		process = process || clover.current.process();

		data.place[process] = {
			top: top === 'auto' ? 0 : top,
			left: left === 'auto' ? 0 : left
		}
	},

	// 记录所有帧信息
	saveAllPlace: function(data){
		var btnProcess = tags.process();

		data = data || clover.current.animate();

		$.each(btnProcess, function(){
			clover.data.savePlace(data, this.getAttribute('value'))
		});
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
clover.isAnimate = isAnimate;

window.clover = clover;

return clover;
});




