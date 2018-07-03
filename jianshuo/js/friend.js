$(function(){
	$.ajax({
		type:"post",
		url:"http://127.0.0.1:8080/jianshuo/servlet/friend",
		data:{
			"name":localStorage.getItem("name"),
			"token":localStorage.getItem("token"),
			"way":2
		},
		async:true,
		success:function(data){
			data = JSON.parse(data);
			if(data.admin){
					new Vue({
						el:"#f-list",
						data:{
							friend:data.friend
						}
					});
					$("#f-list").show();
					$("#f-list li a").click(function(){
						localStorage.setItem("nickname",$(this).text());
					});
			}else{
				popup({type:'error',msg:"未登录",delay:2000,bg:true,clickDomCancel:true,callBack:function(){
					window.location = "login.html";
				}});
			}
		},
		error:function(jqXHR){
			console.log("发生错误："+jqXHR.status);
		}
	});
});