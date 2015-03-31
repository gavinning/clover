define(['zepto', 'page', 'listen', 'clover-slide', 'dragDom'], function($, Page, Listen, slideOptions, dragDom){
	var page = new Page;
	var listen = new Listen;
	var app = page.app;
	var isAnimating = false;
	var cache = {};

	cache = {

		// 页面对象
		pages: {

			// 页面实例
			'0': {
				guid: {
					style: {},
					animateName: ''
				}
			}
		}
	};

	page.onload(function(){
		// todo: test
		$('head').append('<style>'+ localStorage.cloverAnimateData +'</style>');

		// 监听动画播放
		listen.on('play', function(ap){
			// 创建新的动画对象
			ap = ap || app.current.phone().find('.ap');

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
					$(this).addClass(app.current.getAnimateName(this.getAttribute('guid'))).addClass('fadeIn');
					isAnimating = true;
				})
			}
		});


		// 当前环境变量
		this.exports('current', {
			// 返回当前页面数据对象
			page: function(){
				// todo: 测试，默认为第一页
				return cache.pages[0];
			},

			// 返回画布
			canvas: function(){
				return $('#cloverDragCanvas');
			},

			// 返回手机对象
			phone: function(){
				return $('#cloverMoni');
			},

			// 返回当前动画元素
			element: function(){
				return this.canvas().find('.ap.selected');
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
					this.animate().animateName = value
				} else {
					return this.animate().animateName;
				}
			},


			// 返回指定的动画对象
			getElement: function(guid){
				return this.canvas().find('.ap[guid="'+guid+'"]');
			},

			// 返回指定的动画对象数据
			getAnimate: function(guid){
				this.page()[guid] ? '' : this.page()[guid] = {};
				return this.page()[guid];
			},

			// 返回指定的动画对象动画id
			getAnimateName: function(guid){
				return this.getAnimate(guid).animateName;
			}
		});

		// Dom拖拽模块
		this.exports('dragDom', {
			// 绑定动画元素拖拽事件
			on: function(tag) {
				var x, xm, y, ym, canvas, ap, phone;

				// // 检查是否存在src
				// // 如果有src则异步load图片
				// // 图片加载完成之后绑定拖拽事件
				// if(src){
				// 	return this.loadImg(src, function(){
				// 		app.dragDom.on(tag)
				// 	})
				// };

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

			self = this;
			slide = new slideOptions;
			cloverMoni = $('#cloverMoni');
			data = {
				selected: 0,
				list: ['iPhone5', 'iPhone6', 'iPhone6+']
			};

			// 渲染slide组件
			slide.html(data).prependTo('.clover-aside.instance-right');
			parent = $(slide.parent());

			// 切换屏幕
			parent.delegate('i', 'click', function(){
				app.base.slideItem(this);
				self.for(this.innerText)
			});

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
			})

			return this;
		});

		// 动画操作模块
		this.exports('animate', function(){
			var slide, data, parent;

			slide = new slideOptions;
			data = {
				id: 'animateLib',
				title: '动画库',
				list: [localStorage.cloverAnimateId]
			}
			slide.html(data).appendTo('.clover-aside.instance-left');
			parent = $(slide.parent());

			// 绑定动画预览方法
			parent.find('i').on('click', function(e){
				app.current.animateName(this.innerText);
				listen.fire('play', app.current.element());
			});

			// 全部播放
			$('#btnPlay').on('click', function(){
				listen.fire('play')

				// todo: 整理可播放动画列表，用于判断动画个数
				// app.current.phone().css('overflow', 'hidden');
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
							$(target).removeClass('fadeIn').removeClass(animateName)
							isAnimating = false;
							console.log(guid + ' animate is end.')

							// inherit
							app.current.phone().css('overflow', 'inherit');
						}, 200)
					}, false);
				}
			}
		});

	});

	page.extend({
		id: 'page-create-project',

		init: function(){
			app.animate.init()
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