define(['zepto'], function($) {

	var drag = function(target, callback){
		typeof target === 'string' ?
			target = document.querySelector(target) : "";

		var dragover = function(e){
			e.preventDefault();
		};
		var dragleave = function(e){
			e.preventDefault();
		};
		var drop = function(e){
			e.preventDefault();
			var fileList = e.dataTransfer.files;
			openFiles(fileList, callback);
		};				

		target.addEventListener("dragover", dragover, false);  
		target.addEventListener("dragleave", dragleave, false);  
		target.addEventListener("drop", drop, false);
		$(document)[0].addEventListener("dragover", dragover, false);  
		$(document)[0].addEventListener("dragleave", dragleave, false);  
		$(document)[0].addEventListener("drop", drop, false);
	};

	return drag;

	function openFiles(fileList, callback){
		// console.log(fileList);
		// console.log(fileList.length);
		for(var i=0; i<fileList.length; i++){
			readFiles(fileList[i], callback);
		}
	}

	function readFiles(file, callback){
		var read = new FileReader();
		if(file.length = 0){
			return false;
		}
		var imgUrl = window.webkitURL.createObjectURL(file),
			filename = file.name,
			filesize = Math.floor(file.size/1024);

		if(file.type.indexOf('image')== -1){
			alert('您拖的不是图片！');
			return false;
		}

		callback(imgUrl);
	};

});