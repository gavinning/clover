define(['zepto'], function($){

	function classModel(parent) {
		var className, child;

		className = function() {
			this.init.apply(this, [].slice.call(arguments, 0));
		};

		if(parent){
			child = function(){};
			child.prototype = parent.prototype;
			className.prototype = new child;
		};

		className.fn = className.prototype;
		className.init = function(){};
		className.fn.init = function(){
			this.arguments = arguments;
		};
		className.extend = className.fn.extend = function(){
			return arguments.length === 1 ?
				$.extend(this, arguments[0]):
				$.extend.apply(this, [].slice.call(arguments, 0));
		};

		return className;
	};

	return classModel;
});