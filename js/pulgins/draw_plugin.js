//画图封装
function DrawCanvas(options){
	return this.init(options||{});
}

DrawCanvas.prototype = {
	init:function(options){
		this.ops = $.extend({
			elem : null ,
			width : 5 ,
			color:'#000' 
		},options);
		if( !this.ops.elem.width && !this.ops.elem.height){
			this.ops.elem.width = $(this.ops.elem).width() ;
			this.ops.elem.height = $(this.ops.elem).height() ;
		}
		
		if( !this.ops.elem ){ console.log("画图不能为空"); return false ; } 
		if( typeof this.ops.elem == "string" ){
			this.ops.elem = document.getElementById(this.ops.elem) ;
		}
		//存储每一次画笔
		this.lines = [] ;
		
		//存储每个点的参数
		this.lineParams = [] ;
		
		//程序所处绘图状态
		this.drawing = true;
		this.paint =  this.ops.elem.getContext("2d");
		this.draw();
		
		this.step = -1 ;
		this.stepArr = [] ;
		
		
		this.apis = this.apis() ;
		return this.apis ;
	},
	
	apis:function(){
		var _this = this ;
		return {
			//返回绘制状态，绘图或是橡皮擦
			getDrawing : function(){
				return _this.drawing ;
			},
			//设置绘制的状态
			setDrawing : function(state){
				_this.drawing = state ;
			},
			//设置参数
			setParams:function(key,value){
				_this.ops[key] = value ;
			},
			//获取图片
			getImage:function(){
			 	return _this.ops.elem.toDataURL("image/png");
			},
			//清空画布
			clear:function(){
				_this.paint.clearRect(0, 0, _this.ops.elem.width, _this.ops.elem.height);
			} ,
			//插入图片
			drawImage:function(src,position,cb){
				var image = new Image() ;
				var param = position.split(",");
				image.onload = function(){
					_this.paint.globalCompositeOperation="destination-over";
					if( param[2] && param[3] ){
						_this.paint.drawImage(image,param[0]||0,param[1]||0,param[2],param[3]) ;
					}else{
						_this.paint.drawImage(image,param[0]||0,param[1]||0) ;
					}
					cb && cb();
				}
				image.src = src ;
			},
			//插入背景色
			setBg:function(color){
				_this.paint.globalCompositeOperation="destination-over";
				_this.paint.fillStyle=color;
				_this.paint.fillRect(0,0,_this.ops.elem.width,_this.ops.elem.height);
			},
			txt:function(txt,x,y){
				_this.paint.globalCompositeOperation="source-over";
				_this.paint.font="14px microsoft yahei";
				_this.paint.fillText(txt,x,y);
			},
			scale:function(scaleWidth,scaleHeight){
				_this.paint.save();
				_this.ops.elem.width = _this.ops.elem.width + _this.ops.elem.width*0.2 ;
				_this.ops.elem.height = _this.ops.elem.height + _this.ops.elem.height*0.2 ;
				_this.paint.scale(scaleWidth,scaleHeight);
				_this.paint.restore();
			},
			clearRect:function(){
				_this.paint.globalCompositeOperation="source-over";
				_this.paint.clearRect(0,0,_this.ops.elem.width,_this.ops.elem.height);
			},
			go:function(step){
				_this.step += step ;
				if( _this.step >= 0 && _this.step < _this.stepArr.length-1){
					var img = new Image();
					var src = _this.stepArr[_this.step] ;
					if(src){
						this.clearRect();
						img.onload = function(){
							_this.paint.drawImage(img,0,0);
						}
						img.src = src ;
					}
				}else{
					_this.step -= step ;
				}
			},
			stepAdd : function(){
				_this.stepAdd.call(_this);
			} ,
			getTrackData : function() {
				return _this.lines;
			},
			animate:function(lines){
				_this.animate.call(_this,lines);
			}
		}
	},
	stepAdd:function(){
		this.step++ ;
		if( this.step < this.stepArr.length ){
			this.stepArr.length = this.step ;
		}
		this.stepArr.push( this.apis.getImage() );
	},
	draw:function(){
		var startX, startY , _this = this;
		//给画笔添加上个事件一个点击开始 ， 点击后移动 ，点击事件结束
		$(this.ops.elem).on("touchstart touchmove touchend", function(event) {
			_this.paint.globalCompositeOperation="source-over";
			event.preventDefault();
			var endX;
			var endY ;
			var left = Math.abs(parseInt($(this).css("marginLeft"))) ;
			switch(event.type) {
				case "touchstart":
					//记录触屏的第一个点
					startX = event.originalEvent.targetTouches[0].clientX + left;
					startY = event.originalEvent.targetTouches[0].clientY ;
					

					//如果处于檫的状态
					if(!_this.drawing) {
						//显示橡皮檫那div
						$(".eraser").show();
						$(".eraser").css({
							"top": startY - $(".eraser").height() * 0.5 + "px",
							"left": startX - $(".eraser").width() * 0.5 + left + "px"
						});
						//从哪个点开始清理的宽度，高度
						_this.paint.clearRect($(".eraser").offset().left, $(".eraser").offset().top, $(".eraser").width(), $(".eraser").height());
					}
					break;
				case "touchmove":
					endX = event.originalEvent.targetTouches[0].clientX + left;
					endY = event.originalEvent.targetTouches[0].clientY ;
					if(_this.drawing) { //绘图
						_this.drawLine({x:startX,y:startY},{x:endX,y:endY},_this.ops.color,_this.ops.width) ;
					} else {
						//橡皮擦
						$(".eraser").css({
							"top": endY - $(".eraser").height() * 0.5 + "px",
							"left": endX - $(".eraser").width() * 0.5 + "px"
						});
						_this.paint.clearRect($(".eraser").offset().left, $(".eraser").offset().top, $(".eraser").width(), $(".eraser").height());
					}

					startX = endX;
					startY = endY;
					break;

					//手离开触屏是橡皮檫隐藏
				case "touchend":
					$(".eraser").hide();
					_this.stepAdd() ;
					_this.lines.push(_this.lineParams) ;
					_this.lineParams = [] ;
					break;
			}
		});
	},
	drawLine:function(start,end,color,width){
		//画下线段
		this.paint.beginPath();
		this.paint.moveTo(start.x, start.y);
		this.paint.lineTo(end.x, end.y);
		this.paint.closePath();
		//动态的设置颜色
		this.paint.strokeStyle = color;
		this.paint.lineWidth = width;
		this.paint.stroke();
		
		var params = {
			start : start,
			end : end ,
			color:color,
			width:width
		}
		this.lineParams.push(params) ;
	},
	drawLineOnly:function(start,end,color,width){ //scale: 放大倍数！
		//画下线段
		this.paint.beginPath();
		this.paint.moveTo(start.x, start.y);
		this.paint.lineTo(end.x, end.y);
		this.paint.closePath();
		
		//动态的设置颜色
		this.paint.strokeStyle = color;
		this.paint.lineWidth = width;
		this.paint.stroke();
	},
	animate:function(lines){
		var _this = this ;
		var delay = 0 ;
		this.apis.clear();
		var drawLines = lines || this.lines ;
		if(drawLines && drawLines.length){
			drawLines.forEach(function(lineItem){
				if( lineItem && lineItem.length ){
					lineItem.forEach(function(params){
						delay += 30 ;
						setTimeout(function(){
							_this.drawLineOnly( params.start, params.end, params.color, params.width );
						},delay);
					});
				}
			});
		}
	}
}

function myScroll(){
	var canvas = document.getElementById("canvas") ;
	var winWidth = $(window).width() ;
	var width = canvas.width ;
	var height = canvas.height ;
	var scale = winWidth / width ;
	var startX , startY , moveX , moveY , left = 0 ;
	
	if(width > winWidth){
		var maxMove = width-winWidth ;
		$(".xScroll").show();
		$(".xScroll .scrollCon").css({width : parseInt(winWidth * scale) });
		$(".xScroll .scrollCon").on("touchstart",function(e){
			var ev = e.touches[0] ;
			startX = ev.pageX ;
			startY = ev.pageY ;
		});
		$(".xScroll .scrollCon").on("touchmove",function(e){
			var ev = e.touches[0] ;
			moveX = ev.pageX ;
			moveY = ev.pageY ;
			var diffX = (moveX - startX) * 3 + left;
			if( diffX < 0 ){diffX = 0}
			if(diffX > maxMove){diffX = maxMove}
			$(".xScroll .scrollCon").css({left:diffX*scale}) ;
			$("#canvas").css({marginLeft: -diffX})
		});
		$(".xScroll .scrollCon").on("touchend",function(e){
			var ev = e.touches[0] ;
			left = Math.abs(parseInt($("#canvas").css("marginLeft"))) ;
		});
	}else{
		$(".xScroll").hide();
	}
}