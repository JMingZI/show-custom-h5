var Loading = function (canvas, options) {
	this.canvas = document.getElementById(canvas);
	this.text = document.getElementById("loading-text");
	this.options = options;
	
	this.timer = null;
	this.timer2 = null;
	this.init();
};
Loading.prototype = {
	constructor: Loading,
	init: function () {
		// canvas style
		this.css({
			'position': 'fixed',
			'left': '50%',
			'top': '50%',
			'margin-left': '-30px',
			'margin-top': '-30px',
			'padding': '7.5px',
			'background-color': 'rgba(0,0,0, .7)',
			'border-radius': '10px',
			'z-index': '9999'
		}, this.canvas);
		this.css({
			'position': 'fixed',
			'height': '20px',
			'left':0,
			'right':0,
			'bottom': '50%',
			'margin-bottom': '-55px',
			'text-align': 'center',
			'font-size': '14px',
			'color': '#333',
			'z-index': '9999'
		}, this.text)
		
		if (this.text) { this.createText() }
	},
	css: function (styles, obj) {
		for (var property in styles) {
			obj.style[property] = styles[property]
		}
	},
	createText: function () {
		var text = ['正在载入资源', '正在加载资源组件', '正在磨刀霍霍', '马上准备好了', '一切准备就绪，即将开始'];
		var i = 0, that = this;

		this.text.style.display = 'block';
		this.text.innerText = text[i];
		this.timer2 = setInterval(function () {
			++i;
			that.text.innerText = text[i];
			if (i === text.length-1) i = 1;
		}, 2000)
	},
	show: function (isText) {
		this.canvas.style.display = 'block';
		
		var canvas = this.canvas,
			begin = this.options.begin,
			old = this.options.old,
			lineWidth = this.options.lineWidth,
			canvasCenter = {x: canvas.width / 2, y: canvas.height / 2},
			ctx = canvas.getContext("2d"),
			color = this.options.color,
			num = this.options.num,
			angle = 0,
			lineCap = this.options.lineCap,
			CONST_PI = Math.PI * (360 / num) / 180;
		
		this.timer = setInterval(function () {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (var i = 0; i < num; i += 1) {
				ctx.beginPath();
				ctx.strokeStyle = color[num - 1 - i];
				ctx.lineWidth = lineWidth;
				ctx.lineCap= lineCap;
				ctx.moveTo(canvasCenter.x + Math.cos(CONST_PI * i + angle) *
					begin, canvasCenter.y + Math.sin(CONST_PI * i + angle) * begin);
				ctx.lineTo(canvasCenter.x + Math.cos(CONST_PI * i + angle) *
					old, canvasCenter.y + Math.sin(CONST_PI * i + angle) * old);
				ctx.stroke();
				ctx.closePath();
			}
			angle += CONST_PI;
		},50);
		
		isText && this.createText()
	},
	hide: function () {
		clearInterval(this.timer);
		clearInterval(this.timer2);
		this.canvas.style.display = 'none';
		this.text.style.display = 'none';
	}
};

var options = {
	num : 8,
	begin: 10,
	old: 20,
	lineWidth: 3,
	lineCap: "round",
	// color: ["rgb(0, 0, 0)", "rgb(20, 20, 20)","rgb(40, 40, 40)", "rgb(60, 60, 60)","rgb(80, 80, 80)",
	// 	"rgb(100, 100, 100)", "rgb(120, 120, 120)", "rgb(140, 140, 140)"]
	color: ["rgb(255, 255, 255)", "rgb(235, 235, 235)","rgb(215, 215, 215)", "rgb(195, 195, 195)","rgb(175, 175, 175)",
		"rgb(155, 155, 155)", "rgb(135, 135, 135)", "rgb(115, 115, 115)"]
};
window.loading = new Loading("canvas", options);
// loading.show();

export default loading