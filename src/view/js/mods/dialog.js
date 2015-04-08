define(['zepto', 'package', 'text!coms/dialog.html'], function($, Package, dom){
	var dialog = new Package(dom);

	dialog.extend({
		isReady: false,

		// 加载diaolog
		load: function(selector, data){
			selector = document.body;
			$.isPlainObject(selector) ? this.render('body', selector) : this.render(selector, data);
			this.isReady = true;
			return this.isReady;
		},

		// 检查dialog是否存在
		check: function(){
			return this.isReady ? this.isReady : this.load();
		},

		// 初始化dialog位置
		position: function(){
			var content = this.app().find('.dialog-content');
			content.css('margin-left', -content.width()/2).css('margin-top', -content.height()/2);
		},

		// 显示dialog
		show: function(){
			this.check();
			this.app().show();
			this.position();
		},

		// 隐藏dialog
		hide: function(){
			this.app().hide();
		},

		// 获取dialog数据
		getData: function(data){
			data = {};
			data.name = dialog.app().find('input[name="animateName"]').val();
			data.type = dialog.app().find('.animate-type.selected').attr('type');
			return data;
		},

		// todo: test
		testData: function(){
			console.log(db.get('animate'))
		},

		app: function(){
			return $('#' + this.id);
		},

		initEvent: function(){
			this.check();

			this.app()
			// category slide
			.delegate('.animate-type', 'click', function(){
				$(this).addClass('selected').siblings('.selected').removeClass('selected');
			})
			// 提交/取消
			.delegate('.btn', 'click', function(){
				var type, data;

				data = {};
				type = this.getAttribute('type');

				// 提交请求
				if(type === 'submit'){
					dialog.app().trigger('submit', dialog.getData());
					dialog.hide();
				// 取消请求
				} else if(type === 'cancel'){
					dialog.hide();
				};
			});
		},

		on: function(type, fn){
			this.app().on(type, fn);
		}
	});


// 提交监听
// dialog.on('submit', fn)














	return dialog;
});