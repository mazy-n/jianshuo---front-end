$(function(){
	//更改样式
	function change(str){
		$("#btn-log-in").remove();
		$("#btn-sign-up").remove();
		$("#user").show();
		$("#nav-url").append("<li><a href='f_message.html'>朋友圈</a></li>");
		$("#nav-url").append("<li><a href='self.html'>个人动态</a></li>");
		if(window.location.pathname =='/jianshuo/main/f_message.html'){
			$("#nav-url li:nth-of-type(2) a").addClass("a-bottom");
		}else if(window.location.pathname =='/jianshuo/main/self.html'){
			$("#nav-url li:nth-of-type(3) a").addClass("a-bottom");
		}
		$("#user>span").text(str);
		$("#user").click(function(){
			$("#user .dropdown-menu").toggle();
			if($("#user .dropdown-menu").css('display') == 'block') {
				$(this).addClass("user-in");
			}else{
				$(this).removeClass("user-in");
			}
		});
		
		$("#exit").click(function(){
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/jianshuo/servlet/exit",
				data:{
					"name":localStorage.getItem("name")
				},
				async:true,
				success:function(data){
					localStorage.removeItem("token");
					window.location = "index.html";
				},
				error:function(jqXHR){
					console.log("发生错误："+jqXHR.status);
				}
			});
		});
		
		function stopPropagation(e) {
		    if (e.stopPropagation) 
		      e.stopPropagation();//停止冒泡  非ie
		    else
		      e.cancelBubble = true;//停止冒泡 ie
		}
		$(document).bind('click',function(){
			$("#user").removeClass("user-in");
			$('#user .dropdown-menu').css('display','none');
		});
		$('#user,#user .dropdown-menu').bind('click',function(e){
		    stopPropagation(e);//调用停止冒泡方法,阻止document方法的执行
		});
	}
	$.ajax({
		type:"post",
		url:"http://localhost:8080/jianshuo/servlet/top",
		data:{
			"name":localStorage.getItem("name"),
			"token":localStorage.getItem("token")
		},
//		xhrFields: {  
//			withCredentials: true  
//		},
		async:true,
		success:function(data){
			data = JSON.parse(data);
			console.log(data);
			if(data.nickname){
				change(data.nickname);
			}
		},
		error:function(jqXHR){
			console.log("发生错误："+jqXHR.status);
		}
	});
	
//	change("mzn1");
});