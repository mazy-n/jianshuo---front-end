$(function(){
	//	校验电话码格式 
	function isTelCode(str) {
		var reg= /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
		return reg.test(str);
	}
	//	校验用户名格式
	function isName(str) {
		var reg= /^[A-z][a-zA-Z0-9_-]{3,12}$/;
		return reg.test(str);
	}
	//等待ajax请求时的显示
	function loading(rs,flag){
		console.log(rs);
		if(rs!=null){
			if(rs=="error"){
				popup({type:'error',msg:"服务器异常，注册失败",delay:null,bg:true,clickDomCancel:true});
				flag = true;
			}
			else if(rs=="name"){
				popup({type:'error',msg:"用户名重复",delay:null,bg:true,clickDomCancel:true});
				flag = true;
			}
			else if(rs=="tel"){
				popup({type:'error',msg:"该手机号已注册",delay:null,bg:true,clickDomCancel:true});
				flag = true;
			}
			else if(rs=="success"){
				popup({type:'success',msg:"注册成功",delay:1500,callBack:function(){
					window.location = "login.html";
				}});
				flag = true;
			}
		}else{
			popup({type:'load',msg:"请等待",delay:1000});
		}
		return flag;
	}
	$("#sign-up-form-submit-btn").click(function(){
		var user = {
			"name" : $("#session_user_number").val(),
			"tel" : $("#session_mobile_number").val(),
			"pwd" : $("#session_password").val()
		};
		if(isName(user.name)){
			if(isTelCode(user.tel)){
				if(user.pwd != "" && user.pwd.length >= 6 && user.pwd.length <= 16){
					var result = null;
					$.ajax({
						type:"post",
						data:{
							"user":JSON.stringify(user)
						},
						url:"http://127.0.0.1:8080/jianshuo/servlet/register",
						async:true,
						dataType:"text",
						success:function(data){
							data = JSON.parse(data);
							if(data.isName){
								if(data.isTel){
									if(data.all){
										result = "success";
									}else{
										result = "error";
									}
								}else{
									result = "tel";
								}
							}else{
								result = "name";
							}
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
				}else{
					popup({type:'tip',msg:"密码长度为6~16位",delay:null,clickDomCancel:true});
				}
			}else{
				popup({type:'tip',msg:"手机号不正确",delay:null,clickDomCancel:true});
			}
		}else{
			popup({type:'tip',msg:"用户名格式错误",delay:null,clickDomCancel:true});
		}
	});
});
