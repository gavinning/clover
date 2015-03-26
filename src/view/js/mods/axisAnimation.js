define(['zepto', 'guid', 'listen'], function($, guid) {
	var listen, selected, _selected, AxisAnimation;

	selected = 'selected';
	_selected = '.selected';

	// api优化，缩减长度，公私区分
	// 事件优化，处理用户事件，开放自定义事件给消费者
	// 避免用标签选择器
	// this.defaultConfig的错误使用


	AxisAnimation = function(config){
		var self = this;

		this.defaultConfig = {
			wrapper:'axisWrapper',
			handle:'.axis-handle',
			axisAnimation:'axisAnimation',
			container: $('.container')
		};
		this.allKeyframe = [];
		this.config = $.extend(this.defaultConfig, config || {});
		this.init.call(this);

		// by gavinning
		// 添加ui相关支持
		this.ui = {};
		this.ui.id = this.config.axisAnimation;
		this.ui.element = $('#' + this.ui.id);

		// 时间轴事件交互支持
		this.events = {};
		this.events.init = function(timeline){

			// 拖动关键帧
			timeline.drag();

			//双击新建关键帧
			timeline.ui.element.dblclick(function(e){
				if(e.target.id == 'axisAnimation'){
					timeline.create(e);
				}
			});

			//当前选中的关键帧
			timeline.ui.element.delegate('span', 'click', function(){
				var current, prev, currentElement, prevElement;

				currentElement = $(this);
				prevElement = $(this).siblings(_selected);

				current = $(this).attr('data-id');

				// 不存在 _selected
				if(!currentElement.hasClass(selected) && prevElement.length === 0){
					prev = null;
				}

				// 当前选择的元素包含 _selected
				if(currentElement.hasClass(selected)){
					prev = current;
				}

				// 存在非当前元素 _selected
				if(prevElement.length){
					prev = prevElement.attr('data-id');
				}

				// 发射当前关键帧改变事件
				$(document).trigger('keyChange', {prev: prev, current: current});

				// 更新关键帧状态
				$(this).addClass(selected).siblings().removeClass(selected);
			});
		}
	};

	AxisAnimation.prototype = AxisAnimation.fn = {
		init: function(){
			this.render();
		},

		//渲染到页面
		render: function(){
			var gid1 = 'process-guid-first', gid2 = 'process-guid-last';

			var html =  '	<div id="'+this.config.wrapper+'"  class="axis-wrapper">'+
						'		<div id="'+this.config.axisAnimation+'" class="axis-animation">'+
						'			<span class="axis-handle-first disabled selected" style="left:0%;" data-id="' +gid1+ '" data-drag="0" data-value="0%"><em class="percent">0%</em></span>'+
						'			<span class="axis-handle-last disabled" style="right:0%;" data-id="' +gid2+ '" data-drag="0" data-value="100%"><em class="percent">100%</em></span>'+
						'		</div>'+
						'	</div>';
			this.config.container.append(html);
			this.allKeyframe = [
			{
				id: gid1,
				left: 0,
				drag: 0				
			},
			{
				id: gid2,
				right: 0,
				drag: 0	
			}
			];
		},

		//新建关键帧
		create: function(e){
			console.log(e)
			var gid = guid();
			var axisAnimation = $('#' +this.defaultConfig.axisAnimation),
				left = Math.round((e.clientX - axisAnimation[0].offsetLeft)/axisAnimation[0].offsetWidth * 100);
			// var left = e.clientX - e.currentTarget.offsetLeft;
			// 数遍双击坐标
			var left = e.layerX - e.currentTarget.offsetLeft;
			console.log(e.clientX ,e.currentTarget.offsetLeft)
			var percent = Math.round((left/axisAnimation[0].offsetWidth) * 100);
			var index = axisAnimation.find('.axis-handle').length + 1;
			var str = '<span class="axis-handle" style="left:' +left+ 'px" data-left="' +left+ '" data-id="'+gid+'" data-drag="0" data-value="'+percent+'%"><em class="percent">'+percent+'%</em></span>';
			axisAnimation.append(str);

			this.allKeyframe.push({
				id: 'keyframe_'+ index,
				left: left,
				drag: 0
			});

			// 选中新创建的关键帧
			this.ui.element.find('[data-id="'+gid+'"]').click();
		},

		drag: function(callback){//拖动关键帧
			var disX = 0, disY = 0;
			var that = this;
			var handle = this.config.handle, axisAnimation = $('#'+this.defaultConfig.axisAnimation);

			$(document).delegate(handle, 'mousedown', function(event){
				event.preventDefault();
				var e = event || window.event;
				var target = e.currentTarget;	
				var id = $(target).attr('data-id'),
					startPosi = target.offsetLeft;

				// todo:
				// $(e.currentTarget).addClass(selected).siblings().removeClass(selected);

				disX = e.clientX - target.offsetLeft, 
				disY = e.clientY - target.offsetTop;
				if(target.setCapture){
					target.setCapture();
				}
	
				document.onmousemove = function(event){
					event.preventDefault();
					var e = event || window.event;

					var L = e.clientX - disX;
					if(L < 20){ 
						L = 20;
						target.style.left = 0 + 'px';
					}
					else if(L >= axisAnimation[0].offsetWidth - target.offsetWidth -20 ){
						L = axisAnimation[0].offsetWidth - target.offsetWidth - 20;
						target.style.left = L + 'px';
					}

					target.style.left = L + 'px';
		
					return false;	
				};	

				document.onmouseup = function(event){
					event.preventDefault();
					document.onmousemove = null;
					document.onmouseup = null;
					if(target.releaseCapture){
						target.releaseCapture();
					}	

					var endPosi = parseInt($(target).css('left'));
					var drag;
					if(startPosi != endPosi){
						drag = 1;
						var percent = Math.round((endPosi/axisAnimation[0].offsetWidth) * 100);
						$(target).find('.percent').text(percent + '%');
						// add by gavinning
						$(target).attr('data-value', percent + '%');
						$(document).trigger('keyMove',{
								id: $(target).attr('data-id'),
								left: endPosi,
								drag: drag
						}).attr('data-left', endPosi);
						for(var i=0; i<that.allKeyframe.length; i++){
							if(that.allKeyframe[i].id == id){
								that.allKeyframe[i].left = endPosi;
								that.allKeyframe[i].drag = drag;
							}
						}
						//that._getAllKeyframe();
											
					}else{
						drag = 0;
					}
					$(target).attr('data-drag', drag);
				};				

				return false;				
			});
		},

		// 返回当前关键帧对象
		current: function(){
			return this.ui.element.find(_selected);
		},

		// 返回当前关键帧对象
		currentKeyframeValue: function(){
			return this.current().attr('data-value');
		},

		// 返回第一帧对象
		first: function(){
			return this.ui.element.find('.axis-handle-first');
		},

		// 返回最后一帧对象
		last: function(){
			return this.ui.element.find('.axis-handle-last');
		},

		// 返回当前关键帧的值
		keyframeValue: function(gid){
			return this.ui.element.find('[data-id="'+gid+'"]').attr('data-value');
		},

		getAllKey: function(){//获取所有关键帧
			return this.allKeyframe;
		}

	}

	return AxisAnimation;

});