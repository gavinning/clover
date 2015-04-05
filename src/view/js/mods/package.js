define(['zepto', 'mtpl', 'guid'], function($, mtpl, guid){
	function Public(dom, css) {
		var Package = function(){
			this.init = function(){
				this.apply(arguments)
			};

			this.data = {
				dom: dom,
				css: css
			};

			return this
		};

		Package.prototype = Package.fn = {
			extend: function(obj){
				return $.extend(this, obj)
			},

			find: function(selector){
				this.selector = $(selector)
				return this;
			},

			render: function(data){
				data = data || {};
				data.id = data.id || 'clover-' + guid();
				this.id = data.id;
				this.selector.html(mtpl(dom, data, null, null, false));
				return this;
			},

			html: function(data){
				data = data || {};
				data.id = data.id || 'clover-' + guid();
				this.id = data.id;
				return $(mtpl(dom, data, null, null, false))
			},

			css: function(){
				return $('<style lincoapp="clover/dialog">'+this.data.css+'</style>');
			},

			parent: function(){
				return document.getElementById(this.id);
			}
		}

		return Package;
	}

	Public.prototype = {
		extend: function(obj){
			return $.extend(this, obj)
		}
	}

	return Public;
})