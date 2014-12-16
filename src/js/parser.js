function parseArguments(arr) {
	var css = []

	arr.forEach(function(animate){
		css.push(buildAnimate(animate))
	})

	return css;
}

function buildStyle(data) {
	var str1 = [data.name, data.time, data.count, data.function, data.delay, data.mode].join(' ')
	var str2 = [data.className, '{ -webkit-animation:', str1, '}'].join(' ')
	return str2
}

function buildFrame(data) {
	var frame, frames = [];
	var obj = data.frames;

	for(var i in obj){
		frames.push(i + ' {' + obj[i].join(';') + '}')
	}

	// 格式化 keyframes
	frame = ['@-webkit-keyframes', data.name, '{', frames.join(' '), '}'].join(' ')

	return frame
}

function buildAnimate(data) {
	return buildStyle(data) + buildFrame(data)
}

function view(animates) {
	var css = parseArguments(animates)
	var style = document.head.getElementsByTagName('style')[0];

	style.innerHTML =  style.innerHTML + css.join('')
}
