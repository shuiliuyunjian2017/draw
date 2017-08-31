/*
 * Draw 标记插件canvas实现
 * Author: liu
 * Date: 2017.08.31
 * Version: 1.0
 */
function Draw (opt) {
	var defaultOpt = {
		el: document.body, //插入的位置
		relEl: document.body, //遮盖元素
		width: '640', //宽
		height: '240', //高
		penColor: '#c00',//画笔颜色
		penLineWidth: 4, //线条宽度
		markInfoArr: [],//图片信息存储
		saveInterval: 500 //画面保存间隔时间
	};

	this.opt = opt || defaultOpt;

	for (var item in defaultOpt) {
		this[item] = this.opt[item] || defaultOpt[item];
	}

	//初始化
	this.init();
}

Draw.prototype = {
	constructor: Draw,
	init: function () {

		//生成画笔图标
		this.createPenIcon();

		//生成画板
		this.createBoard();
		//初始化画板
		this.initBoard();

		//添加事件监听
		this.addEvents();
	},
	//生成画笔图标
	createPenIcon: function () {
		var btnPen = document.createElement('button'),
				txtNode = document.createTextNode('画笔');

		btnPen.appendChild(txtNode);
		btnPen.className = 'btn-pen j-btn-pen';

		this.btnPen = btnPen;
		this.el.appendChild(btnPen);		
	},
	//生成画板
	createBoard: function () {
		var canvas = document.createElement('canvas'),
				ctx;

		canvas.style.display = 'none';
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.className = 'draw-board';

		this.board = canvas;
		this.relEl.appendChild(canvas);
	},
	//初始化画板
	initBoard: function () {
		var ctx;

		this.ctx = this.board.getContext('2d');
		ctx = this.ctx;

		//设置画笔颜色
		ctx.strokeStyle = this.penColor;
		//设置线宽
		ctx.lineWidth = this.penLineWidth;
		//封边样式
		ctx.lineCap = 'round';
		ctx.beginPath();

		self.isDrawing = false;
	},
	//重置画板
	resetBoard: function () {
		var self = this,
				ctx = self.ctx;

		ctx.closePath();
		ctx.clearRect(0, 0, self.width, self.height);
		ctx.beginPath();
	},
	//添加事件监听
	addEvents: function () {
		var self = this;

		//点击画笔
		self.addEventListener(self.btnPen, 'click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			var isShow = self.board.style.display === 'block' ? true : false;

			//画板已显示
			if (isShow) {

				//结束画画
				self.endDraw();
			} else {
			//画板未显示

				//开始画画
				self.startDraw();
			}
		});

		//点击body停止画画
		self.addEventListener(document.body, 'click', function (e) {
			//结束画画
			self.endDraw();
		});

		//画画
		self.addEventListener(self.board, 'mousedown', cMouseDown);
		self.addEventListener(self.board, 'mousemove', cMouseMove);
		self.addEventListener(self.board, 'mouseup', cMouseUp);
		self.addEventListener(self.board, 'click', function (e) {
			e.preventDefault();
			e.stopPropagation();
		});
		function cMouseDown(e) {
			e.preventDefault();
			e.stopPropagation();

			var ctx = self.ctx,
					pos = getPos(e);

			ctx.moveTo(pos.x, pos.y);
			self.isDrawing = true;
		}
		function cMouseMove(e) {
			e.preventDefault();
			e.stopPropagation();

			var ctx = self.ctx,
					pos;

			if (self.isDrawing) {
				pos = getPos(e);

				ctx.lineTo(pos.x, pos.y);
				ctx.stroke();
			}
		}
		function cMouseUp(e) {
			e.preventDefault();
			e.stopPropagation();
			self.isDrawing = false;		
		}
		function isTouch(e) {
			var type = e.type;
			if (type.indexOf('touch') >= 0) {
				return true;
			} else {
				return false;
			}
		}
		function getPos(e) {
			var x, y;
			if (isTouch(e)) {
				x = e.touches[0].pageX;
				y = e.touches[0].pageY;
			} else {
				x = e.offsetX;
				y = e.offsetY;
			}
			return {
				x: x,
				y: y
			};
		}

		//
	},
	//开始画画
	startDraw: function () {
		var self = this;
		//画笔提示
		this.btnPen.textContent = '画图中~';
		//显示画板
		this.board.style.display = 'block';
		//清空图片存储数组
		this.markInfoArr = [];
		//保存画画过程
		this.timer = setInterval(function () {
			self.saveDrawing();
		}, this.saveInterval);
	},
	//结束画画
	endDraw: function () {
		//画笔提示
		this.btnPen.textContent = '画笔';		
		//隐藏画板
		this.board.style.display = 'none';
		//重置画板
		this.resetBoard();
		//清除timer
		clearInterval(this.timer);
		//TODO演示
		this.showImgs();
	},
	saveDrawing: function () {
		//this.markInfoArr = this.markInfoArr || [];
		this.markInfoArr.push(this.board.toDataURL("image/png"));
	},
	//TODO仅用于暂时演示
	showImgs: function () {
		var imgs = this.markInfoArr,
				imgDom = document.getElementById('show-img');

		for (var len = imgs.length, i = 0; i < len; i++) {
			setTimeout((function (i) {
					return function () {
						imgDom.src = imgs[i];
					};
				})(i), 500 * i);
		}

		//清空图片存储数组
		this.markInfoArr = [];
	},
	//TODO 重写事件监听方法，做兼容
	addEventListener: function (elem, type, fn) {
		if (window.addEventListener) {
			return elem.addEventListener(type, fn, false);
		} else if (window.attachEvent) {
			return elem.attachEvent('on' + type, fn, false);
		} else {
			return elem[type] = fn;
		}
	}
};
	
