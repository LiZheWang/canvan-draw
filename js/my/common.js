var testUrl = 'js/test.js' ;
var ErrorMessage = function(){
	var errorBox = $(".showErrorBox") ;
	if( errorBox.length == 0 ){
		console.log('showErrorBox必须要添加') ;
		return　false ;
	}
	return {
		show : function(txt){
			errorBox.html(txt);
		},
		clear:function(){
			errorBox.empty();
		}
	}
}
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var setPage = {
	go : function(url){
		console.log(url)
		window.location.href = url ;
	},
	back : function(){
		window.history.go(-1);
	},
	reload : function(){
		window.location.reload();
	}
}


function loading(type,text){
	if( type == "show" ){
		text = text || "数据加载中" ;
		var html =  '<div class="loadingToast jsloading">'+
			        '<div class="weui-mask_transparent"></div>'+
			        '<div class="weui-toast">'+
			            '<i class="weui-loading weui-icon_toast"></i>'+
			            '<p class="weui-toast__content">'+text+'</p>'+
			        '</div>'+
			    '</div>';
		$("body").append(html) ;
	}
	if( type == "hide" ){
		$(".jsloading").remove() ;
	}
}

function wxAlert(msg, time, cb){
	text = msg || '';
	time = time || 2000 ;
	var html =  '<div class="toast wxAlert" >'+
			        '<div class="weui-mask_transparent"></div>'+
			        '<div class="weui-toast">'+
			           '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'+
			            '<p class="weui-toast__content">'+text+'</p>'+
			        '</div>'+
			    '</div>';
	$("body").append(html) ;
	setTimeout(function(){
		$(".wxAlert").remove();
		cb && cb();
	},time);
}

function alertBox(text,options){
	var ops = $.extend({
		title : '系统提示',
		successText:"知道了"
	},options||{});
	var html =  '<div class="js_dialog" id="alertBox" style="display:none;" >'+
		            '<div class="weui-mask"></div>'+
		            '<div class="weui-dialog">'+
		            	'<div class="weui-dialog__hd"><strong class="weui-dialog__title">'+ops.title+'</strong></div>'+
		                '<div class="weui-dialog__bd">'+text+'</div>'+
		                '<div class="weui-dialog__ft">'+
		                    '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">'+ops.successText+'</a>'+
		                '</div>'+
		            '</div>'+
		        '</div>';
	$("body").append(html) ;
	$("#alertBox").fadeIn(200);
	$("#alertBox .weui-dialog__btn_primary").click(function(){
		var box = $(this).parents('#alertBox') ;
		closeDialog(box,200,true);
	})
}

function confirmBox(text,options){
	var ops = $.extend({
		title : '系统提示',
		successText:"确定" ,
		closeText : '关闭' ,
		success : null ,
		close : null
	},options||{});
	var html =  '<div class="js_dialog" id="confirmBox" style="display: none;">'+
		            '<div class="weui-mask"></div>'+
		            '<div class="weui-dialog">'+
		                '<div class="weui-dialog__hd"><strong class="weui-dialog__title">'+ops.title+'</strong></div>'+
		                '<div class="weui-dialog__bd">'+text+'</div>'+
		                '<div class="weui-dialog__ft">'+
		                    '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default">'+ops.closeText+'</a>'+
		                    '<a href="javascript:;" class="weui-dialog__btn btnSuccess">'+ops.successText+'</a>'+
		                '</div>'+
		            '</div>'+
		        '</div>';
	$("body").append(html) ;
	$("#confirmBox").fadeIn(200);
	$("#confirmBox .weui-dialog__btn_default").click(function(){
		var box = $(this).parents('#confirmBox') ;
		closeDialog(box,200,true);
	});
	var closeObj = {
		close:function(){
			var box = $('#confirmBox') ;
			closeDialog(box,200,true);
		}
	}
	$("#confirmBox .btnSuccess").click(function(){
		ops.success && ops.success.call(closeObj) ;
	});
	
};

function AjaxPost(op) {
	if (op.data == null)			op.data = {};
	if (op.async == null)			op.async = true;
	
	$.ajax({
		url: op.url,
		type: 'POST',
		async: op.async,
		data: op.data,
		cache: false,
		//contentType: "application/x-www-form-urlencoded",
		success: function (data) {

			if (data) {
				if (data.ret == 0) {
					if (op.success)	op.success(data);
					return;
				}
				if (op.error) {
					op.error(data.msg, data.ret);
				} else {
					alertBox(data.msg);
				}
			} else {
				if (op.error) {
					op.error('系统发生错误')
				} else {
					alertBox('系统发生错误');
				}
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {

			if (XMLHttpRequest.readyState == 4) {
				if (op.error) {
					op.error('系统发生错误')
				}
				else {
					//layer.alert('系统发生错误', {icon:2});
					alertBox('系统发生错误');
				}
				return;
			}
			if (op.error) {
				op.error('网络似乎不通')
			}
			else {
				//layer.alert('系统发生错误', {icon:2});
				alertBox('系统发生错误');
			}
		},
		dataType: 'json'
	});
};

/*
function commonAjax(options){
	var ops = $.extend({
		type:"post",
		url:"",
		loading:true ,
		success:null ,
		error : null ,
		loadingText : "loading" ,
		datatype:"json"
	},options||{});
	if( ops.loading ){ loading("show",ops.loadingText) }
	
	var success = ops.success ;
	ops.success = function(data){
		loading("hide");
		success && success();
	}
	var err = ops.error ;
	ops.error = function(){
		loading("hide");
		err && err();
	}
	$.ajax(ops);
}
*/
//是否是正确的手机号
function isPhone(phone){
	var reg = /^1\d{10}$/;
	return reg.test(phone);
}

function closeDialog(box,time,isRemove){
	time = time || 200 ;
	box.fadeOut(time);
	if(isRemove){
		setTimeout(function(){
			box.remove();
		},time);
	}
}
$(function(){
	FastClick.attach(document.body);
	$("body").on("click",".dialogCancel",function(){
		var box = $(this).parents('.js_dialog') ;
		closeDialog(box);
	});
})
