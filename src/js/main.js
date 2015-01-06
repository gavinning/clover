require(['zepto', 'clover', 'dragDom', 'dragInpage', 'guid'], function($, clover, drag, dragImg, guid){
	
	// Zepto扩展重绘
	$.fn.reflow =  function (){
	    this.each(function(){
	        this.nodeType && this.nodeType==1 && getComputedStyle(this).zoom;
	    }); 
	    return this;
	};

	// UI界面事件绑定
	clover.bind();

});