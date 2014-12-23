clover.exports.effectInput = function(){
	$('.effect-label').delegate('input[type="range"]', 'input', function(){
		var value, algorithm, unit;

		// 获取倍数
		algorithm = this.getAttribute('algorithm') || 1;
		// 获取单位
		unit = this.getAttribute('unit') || '';
		// 获取最终结果
		value = (this.value * algorithm).toString().slice(0, 4) + unit;

		$(this).prev('input[type="text"]').val(value)
	})
}