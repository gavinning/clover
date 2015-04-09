define(['zepto', 'page', 'listen', 'options', 'dragDom', 'dragInpage', 'guid', 'animateLib'],
	function($, Page, Listen, Options, dragDom, dragInpage, Guid, animateLib){
	var page = new Page;
	var listen = new Listen;
	var app = page.app;
	var cache = {};

	var selected = 'selected';
	var _selected = '.selected';
	var isAnimating = false;

	// 触发动画播放的类
	// 播放动画除了需要添加动画本身的类，还需要添加此类
	var cloverjsAnimatePlay = 'cloverjs-animate-play';
	var _cloverjsAnimatePlay = '.cloverjs-animate-play';

	// 默认页面出入场动画
	var cloverjsFadeIn = 'spaceInDown'; // spaceInDown foolishIn
	var cloverjsFadeOut = 'spaceOutUp'; // spaceOutUp  foolishOut

	// 用于存储数据
	cache = {

		page: {
			forwardIn: '',
			forwardOut: '',
			backwardIn: '',
			backwardOut: ''
		},

		// 页面对象组
		pages: {},
		isAnimating: false,
		fadeIn: cloverjsFadeIn,
		fadeOut: cloverjsFadeOut,
		fadeOutTime: 0
	};

	page.onload(function(){

		// 监听动画播放
		// 包括入场动画
		listen.on('play', function(ap){

			// 创建新的动画对象
			if(!ap){
				ap = app.current.vpage().find('.ap');
				// ap.push(app.current.vpage().get(0));
			};

			// 检查是否处于动画状态
			if(!isAnimating){
				ap.each(function(){
					var guid, animateName;

					// 获取当前动画对象guid
					guid = this.getAttribute('guid');
					// 获取当前动画对象动画id
					animateName = app.current.getAnimateName(guid);
					// 检查动画id是否存在，不存在则返回
					if(!animateName) return;

					// 播放动画
					$(this).addClass(app.current.getAnimateName(this.getAttribute('guid'))).addClass(cloverjsAnimatePlay);
					isAnimating = true;
				})
			}
		});

		// 监听页面入场
		listen.on('fadeIn', function(ap){
			var target, guid, animateName;

			// 展示当前页
			ap.attr('display', 'block');

			// 等待出场动画完成
			// 开始播放页面内动画
			app.base.delay(1000, function(){
				// 开始播放页面内动画
				ap.attr('app', 'show');

				listen.fire('play');
			});


			target = ap.get(0);
			guid = target.getAttribute('guid');
			// 获取当前动画对象动画id
			animateName = app.current.getPageFadeIn();

			// 检查是否存在出场动画
			if(!animateName) return;

			// 播放动画
			ap.addClass(animateName).addClass(cloverjsAnimatePlay);
			// 设置动画播放状态
			cache.isAnimating = true;
		});

		// 监听页面出场
		listen.on('fadeOut', function(ap){
			var target, guid, animateName;

			// ap.attr('display', 'none').attr('app', 'hide');
			app.base.delay(1000, function(){
				ap.attr('display', 'none').attr('app', 'hide');
			});

			target = ap.get(0);
			guid = target.getAttribute('guid');
			// 获取当前动画对象动画id
			animateName = app.current.getPageFadeOut();

			// 检查是否存在出场动画
			if(!animateName) return;

			// 播放动画
			ap.addClass(animateName).addClass(cloverjsAnimatePlay);
			// 设置动画播放状态
			cache.isAnimating = true;
		});


		// 当前环境变量
		this.exports('current', {
			// 返回当前页面数据对象
			page: function(){
				// todo: 测试，默认为第一页
				return cache.pages[this.pageGuid()];
			},

			// 返回当前页面序号
			pageGuid: function(){
				return this.phone().find('[display="block"]').attr('guid');
			},

			// 返回页面标志父级对象
			sign: function(){
				return $('#clover-create-pages')
			},

			// 返回画布Zepto对象
			canvas: function(){
				return $('#cloverDragCanvas');
			},

			// 返回手机Zepto对象
			phone: function(){
				return $('#cloverMoni');
			},

			// 返回当前虚拟页Zepto对象
			vpage: function(){
				return $('#cloverMoni').find('.clover-build-page[guid="'+this.page().guid+'"]');
			},

			// 返回当前动画Zepto对象
			element: function(){
				// vpage被当做一个不可移动的动画元素
				return this.vpage().hasClass(selected) ?
					this.vpage() : this.vpage().find('.selected');
			},

			// 返回当前动画元素guid
			guid: function(){
				return this.element().attr('guid');
			},

			// 返回当前动画元素数据
			animate: function(){
				return this.getAnimate(this.guid());
			},

			// 返回当前动画对象动画id
			animateName: function(value){
				if(value){
					this.animate().animateFadeIn = value
				} else {
					return this.animate().animateFadeIn;
				}
			},

			// 创建页面对象
			createPage: function(guid){
				// 初始化页面动画对象
				// 把页面当做动画对象，不可拖动
				cache.pages[guid] = {
					guid: guid,
					style: {},
					// 出场动画名称
					animateFadeIn: '',
					// 入场动画名称
					animateFadeOut: '',
					// 入场动画时间
					animateFadeOut: 0
				}
			},

			// 设置page全局入场动画
			setPageFadeIn: function(name){
				cache.fadeIn = name;
			},

			// 设置page全局出场动画
			setPageFadeOut: function(name){
				cache.fadeOut = name;
			},

			// 存储page全局出场动画时间
			setPageFadeOutTime: function(time){
				cache.fadeOutTime = time;
			},

			// 获取page全局入场动画
			getPageFadeIn: function(guid){
				// return guid ?
				// 	cache.pages[guid].fadeIn:
				// 	cache.pages.fadeIn;

				return cache.fadeIn;
			},

			// 获取page全局出场动画
			getPageFadeOut: function(guid){
				// return guid ?
				// 	cache.pages[guid].fadeOut:
				// 	cache.pages.fadeOut;

				return cache.fadeOut;
			},

			// 获取page全局出场动画时间
			getPageFadeOutTime: function(guid){
				// return guid ?
				// 	cache.pages[guid].fadeOutTime:
				// 	cache.pages.fadeOutTime;

				return cache.fadeOutTime;
			},

			// 返回指定的动画对象
			getElement: function(guid){
				return this.vpage().find('.ap[guid="'+guid+'"]');
			},

			// 返回制定的虚拟页对象
			getVpage: function(guid){
				return this.phone().find('.clover-build-page[guid="'+guid+'"]');
			},

			// 返回指定的动画对象数据
			getAnimate: function(guid){
				this.page()[guid] ? '' : this.page()[guid] = {};
				return this.page()[guid];
			},

			// 返回指定的动画对象动画id
			getAnimateName: function(guid){
				return this.getAnimateFadeIn(guid);
			},

			// 返回指定的动画对象的入场动画
			getAnimateFadeIn: function(guid){
				return this.getAnimate(guid).animateFadeIn;
			},

			// 返回指定的动画对象的出场动画
			getAnimateFadeOut: function(guid){
				return this.getAnimate(guid).animateFadeOut;
			}
		});

		// Dom拖拽模块
		// 适用于所有标准dom
		this.exports('dragDom', {
			// 绑定动画元素拖拽事件
			on: function(tag) {
				var x, xm, y, ym, canvas, ap, phone;

				// 绑定拖拽事件
				ap = $(tag);
				canvas = app.current.canvas();
				phone = app.current.phone();

				// 常规算法
				// 适合动画创作中心
				// x = 0;
				// y = 0;
				// xm = x + canvas.width() - ap.width();
				// ym = y + canvas.height() - ap.height();

				// 非常规算法
				// 适合项目创作中心
				x = -(canvas.width() - phone.width())/2;
				y = -(canvas.height() - phone.height())/2;
				xm = x + canvas.width() - ap.width();
				ym = y + canvas.height() - ap.height();

				// 初始化拖拽
				dragDom.init(tag, null, x, xm, y, ym);
			},

			// 加载图片
			loadImg: function(src, callback){
				var img = new Image();
				img.src = src;
				img.onload = callback || function(){};
			}
		});


		// 手机屏幕选择模块
		// todo: selected属性可能失效，在前一实例没有selected属性的情况下，后续实例selected不会生效
		this.exports('screen', function(){
			var slide, data, cloverMoni, self, parent;

			var options = new Options;

			// options.initEvent('.clover-set-sreen', {
			// 	selected: 0,
			// 	list: ['iPhone5', 'iPhone6', 'iPhone6+']
			// });

			options.html({
				selected: 0,
				list: ['iPhone5', 'iPhone6', 'iPhone6+']
			}).prependTo('.clover-aside.instance-right');

			// self = this;
			// slide = new slideOptions;
			// cloverMoni = $('#cloverMoni');
			// data = {
			// 	selected: 0,
			// 	list: ['iPhone5', 'iPhone6', 'iPhone6+']
			// };

			// // 渲染slide组件
			// slide.html(data).prependTo('.clover-aside.instance-right');
			// parent = $(slide.parent());

			// 切换屏幕
			// parent.delegate('i', 'click', function(){
			// 	app.base.slideItem(this);
			// 	self.for(this.innerText)
			// });

			// 切换自定义屏幕
			$('#setScreen').on('click', function(){
				var width, height;
				width = $('#forWidth').val().toNumber();
				height = $('#forHeight').val().toNumber();

				if(width && height){
					self.for([width, height]);
					parent.find('.selected').removeClass('selected');
				}
			});

			this.extend({
				config: {
					'iPhone5': [320, 568],
					'iPhone6': [375, 667],
					'iPhone6+': [414, 736],
					'iPhone6plus': [414, 736]
				},

				for: function(args){
					var screen;
					screen = $.isArray(args) ? args : this.config[args||'iPhone5'];
					cloverMoni.width(screen[0]).height(screen[1]).css({marginLeft: -screen[0]/2, marginTop: -screen[1]/2});
				}
			});

			return this;
		});

		// 动画操作模块 clover-aside
		this.exports('animate', function(){
			var slide, data, parent;

			// slide = new slideOptions;
			// data = {
			// 	id: 'animateLib',
			// 	title: '动画库',
			// 	// todo: for test
			// 	list: animateLib.animate[0].list
			// }
			// // 渲染动画库
			// slide.html(data).appendTo('.clover-aside.instance-left');
			// parent = $(slide.parent());

			var options = new Options;

			options.initEvent('.clover-aside.instance-left', {
				list: animateLib.animate[0].list
			});

			// 画布点击事件
			app.current.canvas().on('click', function(e){

				// 用于删除画布内动画对象的选中状态
				e.target === this ? $(this).find('.ap').removeClass(selected) : '';
			});

			// 当前动画对象切换
			app.current.phone()
			.delegate('.clover-build-page', 'click', function(){

				// todo: 暂时停止在单页支持选择出入场动画
				// 初始化vpage动画对象
				// 使vpage具有ap动画对象的部分功能
				// this.clicked || app.animate.animateEnd(app.current.vpage().get(0));
				// this.clicked = true;

				// 点击画布时，取消当前选择对象选择状态
				$(this).find(_selected).removeClass(selected); // .addClass(selected)
			})
			.delegate('.ap', 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				app.current.vpage().removeClass(selected);
				$(this).addClass(selected).siblings(_selected).removeClass(selected);
			});

			// // 绑定动画预览方法
			// parent.find('i').on('click', function(e){
			// 	var name = this.innerText;

			// 	// 为当前动画对象存储选中的动画
			// 	app.current.animateName(this.innerText);

			// 	// 高亮当前选中动画
			// 	app.base.slideItem(this);

			// 	// 加载动画样式
			// 	app.animate.loadAnimateStyle(this.innerText, function(){
			// 		// 播放动画
			// 		listen.fire('play', app.current.element());
			// 	});

			// 	// app.current.animateName(this.innerText);
			// 	// listen.fire('play', app.current.element());
			// });

			// 全部播放
			$('#btnPlay').on('click', function(){
				listen.fire('play');

				// todo: 整理可播放动画列表，用于判断动画个数
				// app.current.phone().css('overflow', 'hidden');
			});

			// 拖拽图片到页面
			dragInpage(window, function(url, base64){
				var guid = Guid();
				app.animate.add(url, guid);
				app.animate.init(guid);
			});

			// 处理range控件
			// 同步更新表单的值
			$('.effect-label').delegate('input[type="range"]', 'input', function(){
				var value, algorithm, unit;

				// 获取倍数
				algorithm = this.getAttribute('algorithm') || 1;
				// 获取单位
				unit = this.getAttribute('unit') || '';
				// 获取最终结果
				value = (this.value * algorithm).toString().slice(0, 4) + unit;

				$(this).prev('input[type="text"]').val(value);

				// 处理图片 name=image
				if(this.name === 'image'){
					app.current.element().css('width', this.value + '%').css('max-width', '100%');
				}
			});


			// 针对动画对象的操作
			$('#setPage').delegate('i', 'click', function(){

				// 处理位置信息
				if(this.className.indexOf('clover-position') >=0){
					switch(this.getAttribute('type')){
						case 'center': app.animate.alignCenter();
						break;
						
						case 'left': app.animate.alignLeft();
						break;
						
						case 'right': app.animate.alignRight();
						break;
						
						case 'top': app.animate.alignTop();
						break;
						
						case 'bottom': app.animate.alignBottom();
						break;
					}
				}
			});

			return {

				// 初始化一个动画对象
				init: function(guid){
					var ap, self;

					self = this;
					guid ? ap = app.current.getElement(guid) : ap = app.current.canvas().find('.ap');

					// 初始化动画对象拖拽
					ap.each(function(){
						app.dragDom.on(this);
					});

					// 初始化动画对象动画状态监听
					ap.each(function(){
						self.animateEnd(this)
					});
				},

				// 初始化单个动画对象实例
				animateEnd: function(target){
					target.addEventListener('webkitAnimationEnd', function(){
						var guid = target.getAttribute('guid');
						var animateName = app.current.getAnimateName(guid);

						// 注销入场动画
						setTimeout(function(){

							// 清理动画类
							$(target).removeClass(cloverjsAnimatePlay).removeClass(animateName)
							isAnimating = false;
							console.log(guid + ' animate is end.')
						}, 200)
					}, false);
				},

				// 新增动画对象
				add: function(src, guid){
					// 添加元素到页面
					app.current.vpage().append('<img class="ap" guid="'+guid+'" src="'+src+'" />');
					// 选中新添加的动画元素
					app.current.getElement(guid).click();
				},

				// 加载动画样式
				loadAnimateStyle: function(name, fn){
					$.get('/js/tmp/csslib/magic/'+name+'.less', function(data){
						// 插入动画样式
						app.animate.insertAnimateStyle(name, data);

						fn && fn();
					});
				},

				// 插入选中的动画样式
				insertAnimateStyle: function(name, css){
					var tag, element;

					// 添加动画function
					css += this.getAnimateFunction(name);

					// 获取当前动画style对象
					element = $('style[data-id="clover-'+name+'"]');

					// 检查对象是否存在
					// 存在重新赋值
					// 不存在则创建
					element.length ? 
						element.html(css):
						$('head').append('<style data-id="clover-'+name+'">'+css+'</style>');
				},

				// 创建动画基础数据
				getAnimateFunction: function(name){
					var time = $('#clover-animate-time').val() || '1s';
					var delay = $('#clover-animate-delay').val() || 0;

					var animation = '.';
					var space = ' ';
					var count = 1;
					var fn = 'ease';

					// animation:
					// .slideIn.cloverjsAnimatePlay{-webkit-animation: slideIn 1s 1 ease 0 forwards}
					animation += name;
					animation += _cloverjsAnimatePlay;
					animation += space;
					animation += '{-webkit-animation:';
					animation += space;
					animation += name;
					animation += space;
					animation += time;
					animation += space;
					animation += count;
					animation += space;
					animation += fn;
					animation += space;
					animation += delay;
					animation += space;
					animation += 'forwards}';
					return animation;
				},

				alignCenter: function(){
					var element, phone;
					element = app.current.element();
					phone = app.current.phone();
					app.current.element()
						.css('left', phone.width()/2 - element.width()/2)
						.css('top', phone.height()/2 - element.height()/2);
				},

				alignLeft: function(){
					app.current.element().css('left', 0);
				},

				alignTop: function(){
					app.current.element().css('top', 0);
				},

				alignBottom: function(){
					var element, phone;
					element = app.current.element();
					phone = app.current.phone();
					element.css('top', phone.height() - element.height());
				},

				alignRight: function(){
					var element, phone;
					element = app.current.element();
					phone = app.current.phone();
					element.css('left', phone.width() - element.width());
				}
			}
		});

		// 当前页样式功能模块
		this.exports('page', function(){
			var slide, data, vsign;

			vsign = $('#clover-create-pages');

			// 设置图片为背景
			$('#css_set_background').on('click', function(){
				app.page.setBackground(app.current.element().get(0));
				app.current.vpage().click();
			});

			// 虚拟页切换
			vsign.delegate('i', 'click', function(){
				// 如果选择页面即是当前页面，click禁止响应
				if($(this).hasClass(selected)) return;

				// 检查页面是否处于转场动画中
				if(cache.isAnimating) return;


				// 设置currentId;
				this.leaveId = $(this).siblings(_selected).attr('data-id');
				this.enterId = this.getAttribute('data-id');

				// 当前页出场
				app.page.leave(this.leaveId);

				// 下一页入场
				app.page.enter(this.enterId);

				// 切换页面状态
				app.base.slideItem(this);
			});

			// 创建新页面
			$('#btnAdd').click(function(){
				// 创建页面标志
				app.page.createPage();
				vsign.find('i').last().click();
			});

			return {
				init: function(){
					// 初始化创建第一个页面
					this.createPage();
					// 初始化第一个页面标志
					$('.clover-create-pages').find('i').eq(0).addClass(selected);
					// 初始化显示第一个页
					app.current.phone().find('.clover-build-page').eq(0).attr('display', 'block');

					// 初始化设置全局入场动画
					app.current.setPageFadeIn(cloverjsFadeIn);
					// 初始化全局入场动画样式
					app.animate.loadAnimateStyle(cloverjsFadeIn);

					// 初始化设置全局出场动画
					app.current.setPageFadeOut(cloverjsFadeOut);
					// 初始化设置全局出场动画时间
					app.current.setPageFadeOutTime(1000);
					// 初始化全局出场动画样式
					app.animate.loadAnimateStyle(cloverjsFadeOut);
				},

				next: {},

				// 虚拟页动画完毕事件监听
				animateEnd: function(target){
					target.addEventListener('webkitAnimationEnd', function(){
						var guid = target.getAttribute('guid');
						var fadeIn = app.current.getPageFadeIn();
						var fadeOut = app.current.getPageFadeOut();

						// 注销入场动画
						setTimeout(function(){

							// 清理动画类
							$(target).removeClass(cloverjsAnimatePlay).removeClass(fadeIn).removeClass(fadeOut);
							cache.isAnimating = false;
							console.log(guid + ' page animate is end.')

							// inherit
							// app.current.phone().css('overflow', 'inherit');
						}, 200)
					}, false);
				},

				// set css
				setBackground: function(target){
					var url;

					// 获取url
					url = target.src;

					// set background
					app.current.vpage()
						.css('background', 'url('+url+') no-repeat center;')
						.css('background-size', 'cover');

					// remove target
					target.remove();
				},

				// 创建新页面API
				createPage: function(){
					var element, count, guid;

					element = $('.clover-create-pages');
					count = element.find('i').length + 1;
					guid = Guid();

					// 创建页面标志
					element.append('<i data-id="'+guid+'">'+count+'</i>');

					// 创建页面对象
					app.current.phone()
					.append('<div class="clover-build-page" display="none" guid="'+guid+'"></div>');

					// 创建页面对象
					app.current.createPage(guid);

					// 设置为下一个页面
					this.next.guid = guid;
					this.next.element = app.current.getVpage(guid);

					// 绑定动画结束事件
					app.page.animateEnd(this.next.element.get(0));

					// 初始化页面动画状态
					this.next.element.get(0).isAnimating = false;
				},

				// 虚拟页出场
				leave: function(guid){
					// 播放出场动画
					listen.fire('fadeOut', app.current.getVpage(guid));
				},

				// 虚拟页入场
				enter: function(guid){
					var fadeIn = app.current.getVpage(guid) || app.page.next.element;

					// 播放当前页入场动画
					listen.fire('fadeIn', fadeIn);
				}

			};
		});

	});

	page.extend({
		id: 'page-create-project',

		init: function(){
			// 初始化页面内可拖拽对象
			// app.animate.init();

			// 初始化第一个虚拟页
			app.page.init();

			console.log('enter '+ this.id +' page.', 123)
		},

		bind: function(){
			
			$('#cloverDragCanvas').height($('.clover-content').height())
		},

		render: function(){
		}
	})

	page.cache = cache;
	window.page = page;
	return page;
})