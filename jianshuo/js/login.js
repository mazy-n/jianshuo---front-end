$(function(){
	if(localStorage.getItem("name")){
		$("#session_user_or_mobile_number").val(localStorage.getItem("name"));
	}
	//等待ajax请求时的显示
	function loading(rs,flag){
		console.log(rs);
		if(rs!=null){
			if(rs=="error"){
				popup({type:'error',msg:"服务器异常，登录失败",delay:null,bg:true,clickDomCancel:true});
				flag = true;
			}
			else if(rs=="false"){
				popup({type:'error',msg:"用户名或密码错误",delay:null,bg:true,clickDomCancel:true});
				flag = true;
			}
			else if(rs=="true"){
				popup({type:'success',msg:"登录成功",delay:1500,callBack:function(){
					window.location = "index.html";
				}});
				flag = true;
			}
		}else{
			popup({type:'load',msg:"请等待",delay:1000});
		}
		return flag;
	}
	$("#sign-in-form-submit-btn").click(function(){
		var user = {
			"name" : $("#session_user_or_mobile_number").val(),
			"pwd" : $("#session_password").val()
		};
		var result = null;
		$.ajax({
			type:"post",
			data:{
				"user":JSON.stringify(user)
			},
			url:"http://127.0.0.1:8080/jianshuo/servlet/login",
			async:true,
			dataType:"text",
			success:function(data){
				data = JSON.parse(data);
				if(data.result){
					if (typeof(Storage) !== "undefined") {
					    // 针对 localStorage/sessionStorage 的代码
					    localStorage.setItem("name",data.name);
					    localStorage.setItem("token",data.token);
					} else {
					    // 抱歉！不支持 Web Storage ..
					    console.log("抱歉！不支持 Web Storage ..");
					}
				}
				result = data.result.toString();
			},
			error:function(jqXHR){
				console.log("发生错误："+jqXHR.status);
				result = "error";
			}
		});
		var flag = false;
		var T1 = setInterval(function(){
			flag = loading(result,flag);
			if(flag){
				clearInterval(T1);
			}
		},1100,result,flag);
		popup({type:'load',msg:"请等待",delay:1000});
	});
});
