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
		for(var i=0; i<fileList.length; i++){
			readFiles(fileList[i], callback);
		}
	}

	function readFiles(file, callback){
		var imgUrl = window.webkitURL.createObjectURL(file),
			filename = file.name,
			filesize = Math.floor(file.size/1024);	
				
		var read = new FileReader();
		read.readAsDataURL(file); 
		read.onload = function(e){
			var result = e.target.result;
			callback(imgUrl, result)
		}

		if(file.length = 0){
			return false;
		}

		if(file.type.indexOf('image')== -1){
			alert('您拖的不是图片！');
			return false;
		}
		

	};

});