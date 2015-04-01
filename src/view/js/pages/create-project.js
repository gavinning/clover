define(['zepto', 'page', 'listen', 'clover-slide', 'dragDom', 'dragInpage', 'guid', 'animateLib'],
	function($, Page, Listen, slideOptions, dragDom, dragInpage, Guid, animateLib){
	var page = new Page;
	var listen = new Listen;
	var app = page.app;
	var cache = {};

	var selected = 'selected';
	var _selected = '.selected';
	var isAnimating = false;

	cache = {

		// 页面对象
		pages: {}
	};

	page.onload(function(){

		// 监听动画播放
		listen.on('play', function(ap){

			// 创建新的动画对象
			if(!ap){
				ap = app.current.vpage().find('.ap');
				ap.push(app.current.vpage().get(0));
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
				return cache.pages[this.pageNumber()];
			},

			// 返回当前页面序号
			pageNumber: function(){
				// return Number($('#clover-create-pages').find(_selected).text());
				return $('#clover-create-pages').find(_selected).text().toNumber();
			},

			// 返回画布
			canvas: function(){
				return $('#cloverDragCanvas');
			},

			// 返回手机对象
			phone: function(){
				return $('#cloverMoni');
			},

			// 返回当前虚拟页对象
			vpage: function(){
				return $('#cloverMoni').find('.clover-build-page[guid="'+this.page().guid+'"]');
			},

			// 返回当前动画元素
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
					this.animate().animateName = value
				} else {
					return this.animate().animateName;
				}
			},

			// 创建页面对象
			createPage: function(count, guid){
				cache.pages[count] = {};
				cache.pages[count].guid = guid;
				// 初始化页面动画对象
				// 把页面当做动画对象，不可拖动
				cache.pages[count][guid] = {
					style: {},
					animateName: ''
				}
			},

			// 返回指定的动画对象
			getElement: function(guid){
				return this.vpage().find('.ap[guid="'+guid+'"]');
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
			});

			return this;
		});

		// 动画操作模块 clover-aside
		this.exports('animate', function(){
			var slide, data, parent;

			slide = new slideOptions;
			data = {
				id: 'animateLib',
				title: '动画库',
				// todo: for test
				list: animateLib.animate[0].list
			}
			// 渲染动画库
			slide.html(data).appendTo('.clover-aside.instance-left');
			parent = $(slide.parent());


			// 当前动画对象切换
			app.current.phone()
			.delegate('.clover-build-page', 'click', function(){
				// 初始化vpage动画对象
				// 使vpage具有ap动画对象的部分功能
				this.clicked || app.animate.animateEnd(app.current.vpage().get(0));
				this.clicked = true;

				// 点击画布时，取消当前选择对象选择状态
				$(this).addClass(selected).find(_selected).removeClass(selected);
			})
			.delegate('.ap', 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				app.current.vpage().removeClass(selected);
				$(this).addClass(selected).siblings(_selected).removeClass(selected);
			});

			// 绑定动画预览方法
			parent.find('i').on('click', function(e){
				var name = this.innerText;

				// 为当前动画对象存储选中的动画
				app.current.animateName(this.innerText);

				// 高亮当前选中动画
				app.base.slideItem(this);

				$.get('/js/tmp/csslib/magic/'+this.innerText+'.less', function(data){
					// 插入动画样式
					app.animate.insertAnimateStyle(name, data);

					// 播放动画
					listen.fire('play', app.current.element());
				});

				// app.current.animateName(this.innerText);
				// listen.fire('play', app.current.element());
			});

			// 全部播放
			$('#btnPlay').on('click', function(){
				listen.fire('play');

				app.current.vpage().find('.ap').css('opacity', 0);

				setTimeout(function(){
					app.current.vpage().find('.ap').css('opacity', 1);
				}, 1000)

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

				$(this).prev('input[type="text"]').val(value)
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
				},

				// 新增动画对象
				add: function(src, guid){
					// 添加元素到页面
					app.current.vpage().append('<img class="ap" guid="'+guid+'" src="'+src+'" />');
					// 选中新添加的动画元素
					app.current.getElement(guid).click();
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

				getAnimateFunction: function(name){
					var time = $('#clover-animate-time').val() || '1s';
					var delay = $('#clover-animate-delay').val() || 0;

					return '.' +
							name +
							'.fadeIn {-webkit-animation: ' +
							name + ' ' +
							time +
							' 1 ease ' +
							delay +
							' forwards}';
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
				app.base.slideItem(this);
				app.current.vpage().show().siblings().hide();
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
					$('.clover-create-pages').find('i').eq(0).click();
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
					element.append('<i>'+count+'</i>');

					// 创建页面对象
					app.current.phone().append('<div class="clover-build-page" guid="'+guid+'"></div>');

					// 创建页面对象
					app.current.createPage(count, guid);
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