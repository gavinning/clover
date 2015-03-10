define(['zepto', 'page', 'cache', 'dragDom'], function($, Page, Cache, dragDom){
	var cache = new Cache;
	var page = new Page;
	var app = page.app;

	// onload方法外定义模块位置可随意
	// onload方法内定义模块需要位置提前，以保证程式执行顺序
	page.onload(function(){

		// 动画数据类
		function AnimateData() {
			return {
				base: {},
				frames: {}
			}
		};

		// 当前环境变量模块
		this.exports('current', {
			// 返回当前画布对象
			canvas: function(){
				return $('#dragCanvas')
			},

			// 返回当前动画对象
			element: function(){
				return this.canvas().find('.selected')
			},

			// 返回当前动画对象guid
			guid: function(){
				return this.element().attr('guid')
			},

			// 返回当前动画对象动画数据
			animate: function(){
				return cache.inputValue[this.guid()]
			}
		});

		// Form data 模块
		this.exports('form', {
			save: function(data){
				data = new AnimateData;
				$('input[sign]').each(function(){
					data[this.getAttribute('sign')] = this.value;
				});
				$.extend(cache.inputValue[app.current.guid()], data);
			},

			saveBase: function(data){
				data = new AnimateData;
				$('.animate-args').find('input[sign]').each(function(){
					data.base[this.getAttribute('sign')] = this.value;
				});
				$.extend(cache.inputValue[app.current.guid()], data);
			},

			reset: function(){
				$.each(cache.inputValue[app.current.guid()], function(key, value){
					$('input[sign="'+ key +'"]').val(value)
				})
			}
		});

		// Dom拖拽模块
		this.exports('dragDom', {
			// 绑定动画元素拖拽事件
			bind: function(tag, src) {
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

		// 动画编译模块
		this.exports('parser', {
			compile: function(){

			}
		});

		// 动画操作模块
		this.exports('animate', {
			bind: function(){
				$('#btnView').on('click', function(){
					app.form.save();
					this.play();
				})
			},

			play: function(){
				
			}
		});

		// 动画元素属性模块
		this.exports('attr', {

		});

		// this.exports('control')

	});

	page.onload(function(){

		this.extend({
			init: function(){
				app.dragDom.bind('.ap.selected');

				app.form.saveBase();

				console.log(cache.inputValue)
			},

			bind: function(){

			},

			render: function(){

			}
		});



	});


	page.reg();

});