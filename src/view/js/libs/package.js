define(['zepto', 'class', 'mtpl', 'guid'], function($, className, mtpl, guid){
	var Package = new className;

	// 开放api
	Package.fn.extend({
		
		// 根据selector进行渲染
		render: function(selector, data){
			data = Package.data(data);
			this.id = data.id;
			$(selector).append(mtpl(this.arguments[0], data));
		},

		// 返回数据由用户自由渲染
		html: function(data){
			data = Package.data(data);
			this.id = data.id;
			return $(mtpl(this.arguments[0], data));
		}
	});

	// 私有api
	Package.extend({
		data: function(data){
			$.isPlainObject(data) ? '' : data = {};
			data.id = data.id || 'cloverjs-' + guid();
			return data;
		}
	});

	return Package;
});