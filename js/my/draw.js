$(function() {
	
	var page = {
		width : 1920,
		height:1080 ,
		scale : 3 ,
	}
	var pageW = page.width / page.scale ,
		pageH = page.height / page.scale ;
	
	
	
	
	//编辑弹层
	var canvasBottomBox = $("#canvasBottomBox") ;
	function editShow(){
		canvasBottomBox.show();
		setTimeout(function(){canvasBottomBox.addClass("show");},20);
	}
	function editHide(){
		canvasBottomBox.removeClass("show");
		setTimeout(function(){canvasBottomBox.hide();},300);
	}
	$("#editBtn").on("click",editShow);
	$("#canvasBottomBox .con").on("click",function(e){e.stopPropagation() ;});
	$("#canvasBottomBox").on("click",editHide);
	
	
	
	var canvas = document.getElementById("canvas") ;
	var cvs = new DrawCanvas({
		elem : canvas ,
		color: "#"+$(".jscolor").val() ,
		width : $("#width").val()
	}) ;
	
	
	cvs.animate(demoArr) ;
	
	$("#changeWindow").on("click",function(){
		if( confirm("切换屏幕,将会清空画板,您确定要切换吗？") ){
			var type = $(this).attr("type") || 'h' ;
			type = type == "h" ? 'v' : 'h' ;
			var txt = type == "h" ? "竖屏" : "横屏" ;
			$(this).attr("type",type).text(txt);
			setWindow(type);
		}
	});
	setWindow("h");
	function setWindow(type){
		$(canvas).css({
			marginLeft:0
		});
		if( type == "h" ){
			$(canvas).attr({width:pageW ,height:pageH});
			if( $("#scroll").val() == "true" ){myScroll();}
			setCanvasBg();
		}
		if( type == "v" ){
			$(canvas).attr({width:pageH ,height:pageW});
			$(".xScroll").hide();
			setCanvasBg(null,null,true);
		}
		clearAll();
	}
	
	cvs.stepAdd();
	
	$(".jscolor").on("change",function(){
		var value = this.value ;
		cvs.setParams("color","#"+value) ;
	});
	
	$("#eraserBtn").on("click",function(){
		var drawing = cvs.getDrawing();
		if(drawing){
			$(this).text("继续绘制");
		}else{
			$(this).text("橡皮擦");
		}
		cvs.setDrawing(!drawing) ;
		editHide();
	});
	
	$("#clearBtn").on("click",clearAll);
	
	function clearAll(){
		cvs.clear();
		$("#eraserBtn").text("橡皮擦");
		cvs.setDrawing(true) ;
		editHide();
		//setSizeState(5) ;
	}
	
		
	function resetJSColor(){
		var input = document.createElement('INPUT')
		input.className="jscolor" ;
		var col = new jscolor(input) ;
		$("#selectColor input").remove();
		$("#selectColor").append(input);
	}
	
	$(".setSize").on("click",function(){
		var val = parseInt( $(this).attr("val") ) ;
		setSizeState(val) ;
		editHide();
	});
	
	function setSizeState(size){
		var btn = $(".setSize[val='"+size+"']") ;
		if(btn.length){
			btn.addClass("weui-btn_primary").removeClass("weui-btn_default")
			.siblings().removeClass("weui-btn_primary").addClass("weui-btn_default") ;
			cvs.setParams("width",size) ;
		}
	}
		
	$("#makeBtn").on("click",function(){
		var imgData = cvs.getImage() ;
		$("#showImage").html('<img src="'+imgData+'"/>') ;
		
		console.log( JSON.stringify(cvs.getTrackData()) );
	});
});

function setCanvasBg(cvs,cb,bodyBg){
	var bgImg = $("#Bgimg").val();
	var bgcolor = $("#Bg").val();
	var imgPosition = $("#imgPosition").val();
	if( !cvs ){
		if( bgImg ){
			$("#canvas").css({
				backgroundImage:'url('+bgImg+')' ,
				backgroundRepeat :'no-repeat'
			});
		}
		if(bgcolor){
			$("#canvas").css({
				backgroundColor:bgcolor
			});
		}
		if(bodyBg == true){
			$("body").css({backgroundColor:bgcolor});
		}else{
			$("body").css({backgroundColor:"#ffffff"});
		}
		return false ;
	}
	if( bgImg ){
		cvs.drawImage(bgImg,imgPosition,function(){
			if(bgcolor) cvs.setBg(bgcolor) ;
			cb && cb();
		}) ;
	}
}
