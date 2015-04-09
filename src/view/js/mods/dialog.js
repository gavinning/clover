define(['zepto', 'package', 'text!coms/dialog.html'], function($, Package, dom){
	var dialog = new Package(dom);

	dialog.extend({

		// 初始化dialog位置
		position: function(){
			var content = this.element().find('.dialog-content');
			content.css('margin-left', -content.width()/2).css('margin-top', -content.height()/2);
		},

		// 获取dialog数据
		getData: function(data){
			data = {};
			data.name = dialog.element().find('input[name="animateName"]').val();
			data.type = dialog.element().find('.animate-type.selected').attr('type');
			return data;
		},

		// 事件
		Event: function(){

			// 点击蒙板关闭dialog
			this.element().click(function(e){
				e.target.id === dialog.id ? dialog.hide() : '';
			})
			// 动画类型选择
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
					dialog.element().trigger('submit', dialog.getData());
					dialog.hide();
				// 取消请求
				} else if(type === 'cancel'){
					dialog.hide();
				};
			});
		}

	});

	return dialog;
});