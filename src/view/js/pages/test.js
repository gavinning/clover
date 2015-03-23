/*

	模块
	核心功能拆分为模块，模块各自处理事件绑定，功能实现: page.exports(id, fn)
	模块调用绝对路径: page.app[id]

	通信
	消息发布者: listen.fire(id)
	消息订阅者: listen.on(id, fn)

 */

define(['zepto', 'page', 'cache', 'dragDom', 'listen', 'parser'], function($, Page, Cache, dragDom, Listen, Parser){
	var page = new Page;
	var cache = new Cache;
	var listen = new Listen;
	var parser = new Parser;
	var app = page.app;

	var selected = 'selected';
	var _selected = '.selected';

	// onload方法外定义模块位置可随意
	// onload方法内定义模块需要位置提前，以保证程式执行顺序
	page.onload(function(){

		// 订阅Form-data保存
		listen.on('save', function(){
			app.form.save();
			console.log('form data save')
		});

		// 订阅动画播放
		listen.on('play', function(){
			// 播放动画
			app.animate.play();
			console.log('animate play')
		});


		// 公共方法模块定义
		this.exports('base', {

			// 用于item切换
			slideItem: function(obj){
				$(obj).addClass(selected).siblings(_selected).removeClass(selected);
			}
		});

		// 当前环境变量模块
		this.exports('current', {
			// 返回当前画布对象
			canvas: function(){
				return $('#dragCanvas')
			},

			// 返回当前动画对象
			element: function(){
				return this.canvas().find(_selected)
			},

			// 返回当前动画对象guid
			guid: function(){
				return this.element().attr('guid')
			},

			// 返回当前动画对象动画数据
			animate: function(){
				return cache.inputValue[this.guid()]
			},

			// 返回当前关键帧
			process: function(){
				return $('.animate-process').find(_selected).attr('value');
			}
		});

		// Form data 模块
		// 动画数据模型创建
		this.exports('form', function(){

			// 动画轨迹事件处理
			$('#slideOptions').delegate('i', 'click', function(){

				if($(this).hasClass(selected)) return;

				// 更新item状态
				app.base.slideItem(this);
				// 同步更新隐藏表单值
				$(this).parent().siblings('[sign="function"]').val(this.innerText);

				// 保存并预览
				listen.fire('save');
				listen.fire('play');
			});

			// 处理range控件
			$('.effect-label').delegate('input[type="range"]', 'input', function(){
				var value, algorithm, unit;

				// 获取倍数
				algorithm = this.getAttribute('algorithm') || 1;
				// 获取单位
				unit = this.getAttribute('unit') || '';
				// 获取最终结果
				value = (this.value * algorithm).toString().slice(0, 4) + unit;

				$(this).prev('input[type="text"]').val(value)
			});

			return {
				// 获取动画数据
				// 动画数据模型创建
				getData: function(guid){
					var guid = guid || app.current.guid();
					var dataModel = {
						init: {},
						base: {},
						frames: {},
						place: {},
						guid: guid
					};
					typeof cache.inputValue[guid] === 'object' ? '' : cache.inputValue[guid] = dataModel;
					return cache.inputValue[guid];
				},

				// 保存表单数据
				save: function(data){
					this.saveBase();
					this.saveFrames();
				},

				// 保存基础数据
				saveBase: function(data){
					data = this.getData(app.current.guid());
					// 获取动画基础数据
					$('.animate-args').find('input[sign]').each(function(){
						data.base[this.getAttribute('sign')] = this.value;
					});
					// 扩展动画基础数据
					$.extend(data.base, {
						className: '.fadeIn[guid="'+ data.guid +'"]',
						name: 'Clover-' + data.guid,
						count: 1,
						mode: 'forwards'
					});
					// 合并到动画大数据
					$.extend(cache.inputValue[app.current.guid()], data);
				},

				// 保存关键帧数据
				saveFrames: function(data, process){
					data = this.getData(app.current.guid());
					process = app.current.process();
					data.frames[process] ? '' : data.frames[process] = {};
					$('.animate-effect').find('input[sign]').each(function(){
						data.frames[process][this.getAttribute('sign')] = this.value;
					});
					$.extend(cache.inputValue[app.current.guid()], data);
				},

				// 重播动画基础数据
				replayBase: function(guid){
					guid = guid || app.current.guid();
					$.each(cache.inputValue[guid].base, function(key, value){
						$('.animate-args').find('input[sign="'+ key +'"]').val(value)
					})
				},

				// 重播动画帧数据
				replayProcess: function(guid, process){
					guid = guid || app.current.guid();
					process = process || '0%';
					$.each(cache.inputValue[guid].frames[process], function(key, value){
						$('.animate-effect').find('input[sign="'+ key +'"]').val(value)
					})
				},

				replay: function(guid){
					this.replayBase(guid);
					this.replayProcess(guid);
				}
			}
		});

		// Dom拖拽模块
		this.exports('dragDom', {
			// 绑定动画元素拖拽事件
			on: function(tag, src) {
				var x, xm, y, ym, canvas, ap;

				// 检查是否存在src
				// 如果有src则异步load图片
				// 图片加载完成之后绑定拖拽事件
				if(src){
					return this.loadImg(src, function(){
						app.dragDom.on(tag)
					})
				};

				// 绑定拖拽事件
				ap = $(tag);
				canvas = app.current.canvas();

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
		});

		// 动画操作模块
		// 包括直接或间接针对动画对象的操作
		this.exports('animate', function(){
			var animateProcess = $('.animate-process');

			// 监听动画元素click事件
			app.current.canvas().delegate('.ap', 'click', function(){
				this.guid = this.getAttribute('guid');
				this.prev = app.current.element();
				this.prev.guid = app.current.guid();

				// 检查是否已存在动画对象
				// 检查动画对象是否更新
				if(cache.inputValue[this.guid] && this.guid !== this.prev.guid){
					// 条件为真
					// 重播当前动画对象数据
					app.form.replay(this.guid);
					// 切换到第一关键帧，防止数据重播失败
					animateProcess.find('.btn[value="0%"]').addClass(selected).siblings(_selected).removeClass(selected);
				};

				// 更新当前动画对象状态
				$(this).addClass(selected).siblings(_selected).removeClass(selected);
			});

			// 保存并预览
			$('#btnView').on('click', function(){
				listen.fire('save');
				listen.fire('play');
			});

			// 切换关键帧
			animateProcess.delegate('.btn', 'click', function(){
				var guid = app.current.guid();

				// 发布数据保存事件
				listen.fire('save');

				// 重播当前帧数据
				if(cache.inputValue[guid] && cache.inputValue[guid].frames[this.value]){
					app.form.replayProcess(guid, this.value);
				};

				// 更新当前动画关键帧状态
				$(this).addClass(selected).siblings(_selected).removeClass(selected);
			});

			return {
				bind: function(){

				},

				// 返回指定guid动画对象
				element: function(guid){
					return app.current.canvas().find('.ap[guid="'+ guid +'"]');
				},

				// 创建clover style
				createCloverStyle: function(){
					return $('<style data-id="clover"></style>')
				},

				// 渲染animate style
				render: function(data){
					var style = $('style[data-id="clover"]');
					style.length === 0 ? style = this.createCloverStyle() : '';
					style.html(data);
					$('head').append(style);
				},

				play: function(guid){
					var css;
					guid = guid || app.current.guid();
					css = parser.render(cache.inputValue);
					// 渲染css
					this.render(css);
					// 执行动画
					this.element(guid).removeClass('fadeIn').reflow().addClass('fadeIn');
				}
			}
		});

		// 时间轴
		this.exports('timeline', {

		});

		// this.exports('control')

	});

	page.onload(function(){

		this.extend({
			init: function(){
				app.dragDom.on('.ap.selected');
			},

			bind: function(){

			},

			render: function(){

			}
		});


	});


	page.reg();

	page.cache = cache;
	window.page = page;
});