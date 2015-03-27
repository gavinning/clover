define(function(require){

	return {
		// path.extname
		extname: function (src, index) {
			var arr = src.split('/');
			var name = arr.slice(arr.length-1)[0];
			return index ? name.replace(index, '') : name;
		}
	};

});