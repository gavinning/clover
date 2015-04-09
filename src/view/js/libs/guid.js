define(function(){
	return function(){
		var time, random, id;

		// 时间因子
		time = (new Date()).getTime();

		// 随机因子
		random = function(){
			return Math.random()*Math.random()*time
		};

		// 短位guid
		id = function(){
			return ((time + random() * 0x10000) | 0).toString(16).slice(1)
		};

		// 长位guid
		return id() + id() + id()
	}
});