/*

	模块
	核心功能拆分为模块，模块各自处理事件绑定，功能实现: page.exports(id, fn)
	模块调用绝对路径: page.app[id]

	通信
	消息发布者: listen.fire(id)
	消息订阅者: listen.on(id, fn)

 */

define(['zepto', 'page', 'dragDom', 'listen', 'parser', 'timeline', 'cssFormat', 'dialog', 'db', 'guid'],
	function($, Page, dragDom, Listen, Parser, Timeline, cssFormat, dialog, db, Guid){
	var page = new Page;
	var listen = new Listen;
	var parser = new Parser;
	var app = page.app;
	var cache = {};

	var selected = 'selected';
	var _selected = '.selected';
	var isAnimating = false;

	// 触发动画播放的类
	// 播放动画除了需要添加动画本身的类，还需要添加此类
	var cloverjsAnimatePlay = 'cloverjs-animate-play';
	var _cloverjsAnimatePlay = '.cloverjs-animate-play';

	// 用于存储当前动画相关参数
	cache.current = {};
	// 动画数据
	cache.current.animate = {};
	// 用于提交的数据
	// 原始数据需要经过处理
	cache.submit = {};

	// onload方法外定义模块位置可随意
	// onload方法内定义模块需要位置提前，以保证程式执行顺序
	page.onload(function(){

		// 订阅Form-data保存事件
		listen.on('save', function(){
			// 检查动画状态，如果正处于动画过程，则不再响应新的保存请求
			if(isAnimating) return;

			// 保存动画表单数据
			app.form.save();
		});

		// 订阅动画播放事件
		listen.on('play', function(){
			// 检查动画状态，如果正处于动画过程，则不再响应新的预览请求
			if(isAnimating) return;
			// 更新动画播放状态
			isAnimating = true;

			// 开始播放动画
			app.animate.play();
		});

		// 监听动画停止事件
		listen.on('stop', function(){
			isAnimating = false;
			app.current.element().removeClass(cloverjsAnimatePlay).removeClass(cache.current.className);
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
			// 返回创作中心对象
			creativeCenter: function(){
				return $('#cloverCreativeCenter')
			},

			// 返回当前画布对象
			canvas: function(){
				return $('#cloverDragCanvas')
			},

			// 返回当前动画对象原点
			origin: function(){
				return $('#apOrigin')
			},

			// 返回当前动画对象
			element: function(){
				return $('#apElement')
			},

			// 返回当前动画对象guid
			guid: function(){
				return this.element().attr('guid')
			},

			// 返回当前动画对象动画数据
			animate: function(){
				return cache.current.animate;
			},

			// 初始化动画对象
			init: function(src){
				// 存储guid
				cache.current.guid = Guid();
				// 设置className
				cache.current.className = 'clover-' + cache.current.guid;
				// 初始化动画数据对象
				cache.current.animate = {
					init: {},
					base: {},
					frames: {},
					place: {}
				};

				// 为动画对象更新guid
				this.element().attr('guid', cache.current.guid);
				// 初始化动画对象位置
				this.element().css({top: 0, left: 0});
				// 为动画对象更新URL
				!src || this.element().attr('src', src);
			},


			// 返回当前关键帧的值 0% ~ 100%
			keyframeValue: function(){
				return app.timeline.currentKeyframeValue();
			},

			// 返回当前关键帧的guid
			process: function(){
				return app.timeline.current().attr('data-id');
			},

			// 返回第一帧 0%
			firstProcess: function(){
				return app.timeline.first().attr('data-id');
			},

			// 返回最后一帧 100%
			lastProcess: function(){
				return app.timeline.last().attr('data-id');
			}
		});

		// Form-data 模块
		// 动画数据模型创建
		this.exports('form', function(){

			// 动画轨迹事件处理
			$('#slideOptions').delegate('i', 'click', function(){
				// 更新item状态
				app.base.slideItem(this);
				// 同步更新隐藏表单值，以便数据保存
				$(this).parent().siblings('[sign="function"]').val(this.innerText);

				// 结束动画
				listen.fire('stop');

				// 保存并预览
				listen.fire('save');
				listen.fire('play');
			});

			// 处理range控件
			// 同步更新表单的值
			$('.effect-label').delegate('input[type="range"]', 'input', function(){
				var value, algorithm, unit, prev;

				// 查找输入框
				prev = $(this).prev('input[type="text"]');
				// 获取倍数
				algorithm = this.getAttribute('algorithm') || 1;
				// 获取单位
				unit = this.getAttribute('unit') || '';
				// 获取最终结果
				value = (this.value * algorithm).toString().slice(0, 4) + unit;

				// 处理永动动画
				if(this.name === 'count' && value.toNumber() === 100){
					value  = 'infinite';
				};

				prev.val(value);
			});

			return {
				// 保存表单数据
				save: function(data){
					this.saveBase();
					this.saveFrames();
					this.savePlace();
				},

				// 保存基础数据
				saveBase: function(){
					var data = app.current.animate();
					// 获取动画基础数据
					$('.animate-args').find('input[sign]').each(function(){
						data.base[this.getAttribute('sign')] = this.value;
					});
					// 扩展动画基础数据
					$.extend(data.base, {
						className: '.' + cache.current.className + _cloverjsAnimatePlay,
						name: cache.current.className,
						mode: 'forwards' // backwards || forwards || both
						// 当mode的值为forwards时，动画结束时需要删除动画类fadeIn，并初始化0%的绝对位置，以达到重置动画位置的目的（推荐）
						// 当mode的值为backwards时，动画结束时，只需要初始化0%的绝对位置即可达到重置动画位置的目的
						// in the app.animate form module animate
					});
				},

				// 保存关键帧数据
				saveFrames: function(){
					var data, process;

					data = app.current.animate();
					process = app.current.process();
					// 检查关键帧对象是否存在
					data.frames[process] ? '' : data.frames[process] = {};
					// 保存关键帧数据
					$('.animate-effect').find('input[sign]').each(function(){
						data.frames[process][this.getAttribute('sign')] = this.value;
					});
					// 保存关键帧在时间轴上的位置值 0% ~ 100%
					data.frames[process].value = app.current.keyframeValue();
				},

				// 保存位置信息
				savePlace: function(){
					var data, process;

					data = app.current.animate();
					process = app.current.process();
					data.place[process] ? '' : data.place[process] = {};
					// 保存关键帧位置信息到place对象
					data.place[process].left = app.current.element().css('left');
					data.place[process].top = app.current.element().css('top');

					// 计算相对位移
					this.calcPlace(data);
				},

				// todo:待完善
				// 计算相对位移
				calcPlace: function(data){
					var width, height;

					if(!$.isEmptyObject(data.place)){
						width = app.current.element().width();
						height = app.current.element().height();
						// 计算当前位移
						$.each(data.place, function(key, value){
							var left = value.left.toNumber();
							var top = value.top.toNumber();
							var x = left/width*100;
							var y = top/height*100;
							var z = 0;

							x == 0 ? '' : x += '%';
							y == 0 ? '' : y += '%';

							data.frames[key].translate3d = x + ',' + y + ',' + z;
						});
					}
				},

				// 重播动画基础数据
				replayBase: function(){
					$.each(cache.current.animate.base, function(key, value){
						$('.animate-args').find('input[sign="'+ key +'"]').val(value)
					})
				},

				// 重播动画帧数据
				replayProcess: function(process){
					$.each(cache.current.animate.frames[process], function(key, value){
						$('.animate-effect').find('input[sign="'+ key +'"]').val(value)
					})
				},

				// 重播动画位置
				replayPlace: function(process){
					var data = app.current.animate();
					app.current.element().css({left: data.place[process].left, top: data.place[process].top})
				},

				// 重播动画数据
				replay: function(process){
					this.replayProcess(process);
					this.replayPlace(process);
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

				x = -(canvas.width() - ap.width())/2;
				y = -(canvas.height() - ap.height())/2;
				xm = x + canvas.width() - ap.width();
				ym = y + canvas.height() - ap.height();

				app.nav.initOrigin();
				dragDom.init(document.querySelector(tag), null, x, xm, y, ym);
			},

			// 加载图片
			loadImg: function(src, callback){
				var img = new Image();
				img.src = src;
				img.onload = callback || function(){};
			}

		});

		// 创作中心相关操作
		this.exports('nav', function(){
			var ap, canvas, origin, shadowOrigin;

			canvas = app.current.canvas();
			ap = app.current.element();
			origin = app.current.origin();
			shadowOrigin = $('#shadowOrigin');

			// 导航器相关
			$('#cloverNavigator').delegate('td', 'click', function(){
				var type;

				type = this.getAttribute('type');
				
				if(app.nav[type]) app.nav[type]();
			});

			return {
				initOrigin: function(){
					origin.width(ap.width()).height(ap.height()).
					css({marginLeft: -ap.width()/2, marginTop: -ap.height()/2});
				},

				shadowOrigin: function(){
					// shadowOrigin.width(apWidth).height(apHeight).
					// css({marginLeft: -apWidth/2, marginTop: -apHeight/2});
				},

				resize: function(){

				},

				center: function(){
					ap.css('top', 0).css('left', 0);
				},

				left: function(){
					ap.css('top', 0).css('left', -canvas.width()/2 + ap.width()/2);
				},

				right: function(){
					ap.css('top', 0).css('left', canvas.width()/2 - ap.width()/2);
				},

				top: function(){
					ap.css('left', 0).css('top', -canvas.height()/2 + ap.height()/2);
				},

				bottom: function(){
					ap.css('left', 0).css('top', canvas.height()/2 - ap.height()/2);
				},

				leftTop: function(){
					ap.css('left', -canvas.width()/2 + ap.width()/2).css('top', -canvas.height()/2 + ap.height()/2);
				},

				leftBottom: function(){
					ap.css('left', -canvas.width()/2 + ap.width()/2).css('top', canvas.height()/2 - ap.height()/2);
				},

				rightTop: function(){
					ap.css('left', canvas.width()/2 - ap.width()/2).css('top', -canvas.height()/2 + ap.height()/2);
				},

				rightBottom: function(){
					ap.css('left', canvas.width()/2 - ap.width()/2).css('top', canvas.height()/2 - ap.height()/2);
				},
			}
		});

		// 动画操作模块
		// 包括直接或间接针对动画对象的操作
		this.exports('animate', function(){
			var animateProcess = $('.animate-process');

			// 保存并预览
			$('#btnPlay').on('click', function(){
				listen.fire('save');
				listen.fire('play');
			});

			// 展示css代码
			$('#btnCode').on('click', function(){
				var css = $('style[data-id="clover"]').text();
				console.log(cssFormat(css))
			});

			// 动画播放完成动作
			app.current.element().get(0).addEventListener('webkitAnimationEnd', function(){
				var self = this;

				// 注销入场动画
				setTimeout(function(){
					// 清理动画类
					$(self).removeClass(cloverjsAnimatePlay).removeClass(cache.current.className);
					// 更新动画停驻位置为100%
					app.animate.toProcess('100%');

					// 重置动画状态
					isAnimating = false;
				}, 200)

			}, false);

			return {
				// 动画绝对定位位置清零
				clearPlace: function(){
					app.current.element().css({left: 0, top: 0})
				},

				// 跳转到指定帧
				toProcess: function(value){
					value = value || '0%';
					app.timeline.ui.element.find('[data-value="'+value+'"]').click();
				},

				// // 返回指定guid动画对象
				// element: function(guid){
				// 	return app.current.canvas().find('.ap[guid="'+ guid +'"]');
				// },

				// 创建clover style
				createCloverStyle: function(){
					return $('<style data-id="clover"></style>')
				},

				// 渲染animate style
				render: function(data){
					var style = $('style[data-id="clover"]');
					// 检查是否已存在clover style，不存在则创建
					style.length === 0 ? style = this.createCloverStyle() : '';
					style.html(data);
					$('head').append(style);
				},

				playAnimate: function(){
					var css;
					// 编译动画规则
					css = parser.one(cache.current.animate);
					// 渲染css
					this.render(css);
					// 执行动画
					app.current.element().removeClass(cloverjsAnimatePlay).removeClass(cache.current.className).reflow()
					.addClass(cloverjsAnimatePlay).addClass(cache.current.className);
				},

				play: function(){
					// 回归第一帧，回归0%位置，为动画开始做准备
					this.toProcess();
					// 清理动画元素绝对定位产生的位置信息，为动画开始做准备
					this.clearPlace();
					// 开始播放动画
					this.playAnimate();
				}
			}
		});

		// 时间轴
		this.exports('timeline', function(){
			var timeline;

			// 生成时间轴
			timeline = new Timeline({container: $('.clover-timeline')});
			// 初始化时间轴事件
			timeline.events.init(timeline);

			//监听当前拖动的关键帧，返回更改后的结果
			// $(document).bind("keyMove", function (event, data) {
			// 	// console.log(data);
			// });

			$(document).on('keyChange', function(e, data){

				// 发布数据保存事件
				listen.fire('save');

				// 重播当前帧数据
				if(cache.current.animate && cache.current.animate.frames[data.current]){
					app.form.replay(data.current);
				};
			});

			// 返回时间轴实例
			return timeline;
		});

		// dialog模块相关
		this.exports('dialog', function(){
			// 初始化dialog和事件
			dialog.initEvent();

			// 启用dialog
			$('#btnSave').on('click', function(){
				dialog.show();
			});

			// dialog submit
			dialog.on('submit', function(e, data){
				data.animate = cache.current.animate;
				db.set('animate', data);
				$('#currentAnimate').html(data.name);
			});
		});
	});

	page.onload(function(){

		this.extend({
			// 页面初始化
			init: function(){
				// 初始化动画对象
				app.current.init();

				this.resize();
			},

			// 执行全局事件监听
			bind: function(){

				window.onresize = function(){
					page.resize();
				}
			},

			// 执行页面渲染
			render: function(){

			},

			resize: function(){
				// 初始化窗口高度
				$('#page-create-animate').height(window.innerHeight);
				// 初始化画布高度
				app.current.creativeCenter().height($('.clover-content').height());
				// 初始化动画元素拖拽
				app.dragDom.on('#apElement');
			}
		});

	});

	page.dialog = dialog;
	page.cache = cache;
	window.page = page;
	return page;
	// page.reg();
	// For test
});