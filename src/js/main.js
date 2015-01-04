require(['zepto', 'clover', 'drag'], function($, clover, drag){
	
	// Zepto扩展重绘
	$.fn.reflow =  function (){
	    this.each(function(){
	        this.nodeType && this.nodeType==1 && getComputedStyle(this).zoom;
	    }); 
	    return this;
	};

	// UI界面事件绑定
	clover.bind();






	function initDrag() {
		var $canvas = $('#dragCanvas');
		var canvas = $canvas.get(0);
		var ap = $('.ap');
		var minX, maxX, minY, maxY;

		minX = 0;
		maxX = minX + $canvas.width() - ap.width();

		minY = 0;
		maxY = minY + $canvas.height() - ap.height();

		// console.log(minX, maxX, minY, maxY)



		drag.init(document.querySelector('.ap'), null, minX, maxX, minY, maxY);
	};
	initDrag();

	



});