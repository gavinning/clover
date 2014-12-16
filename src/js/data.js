var data = {
	className: '.testing.fadeIn',
	name: 'fadeIn',
	time: '1s',
	delay: '400ms',
	count: 1,
	function: 'ease',
	fillMode: 'forwards',
	frames: {
		'0%': ['opacity: 0'],
		'100%': ['opacity: 1']
	}
}

var pagesAnimate = [data];

var pages = [pagesAnimate]


;(function(){
var pages = [];
var pageAnimates = [];

var Data = function(){
	this.extend = function(obj){
		$.extend(this, obj)
	}

	this.extend({
		set: function(gid, data){

		},

		get: function(gid){

		}
	})
}

var data = new Data();










})(); //end