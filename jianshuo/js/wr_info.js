$(function(){
	$.ajax({
		type:"post",
		url:"http://127.0.0.1:8080/jianshuo/servlet/info",
		data:{
			"name":localStorage.getItem("name"),
			"token":localStorage.getItem("token"),
			"way":1
		},
		async:true,
		success:function(data){
			data = JSON.parse(data);
			if(data.admin){
				$(".user-name>p").text(localStorage.getItem("name"));
				new Vue({
					el:"#ad_mes",
					data:{
						site:data.info
					}
				});
				$(".message").show();
				sub_info();
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
	$(".xgBtn").click(function(){
		p_input();
		$(this).hide();
		$(".mes-save").css({
			"display":"block"
		});
	});
	function sub_info(){
		$(".mes-save").click(function(){
			var info = {
				"nickname":$(".show-mes:nth-of-type(1) input").val(),
				"age":$(".show-mes:nth-of-type(2) input").val(),
				"sex":$(".show-mes:nth-of-type(3) input").val(),
				"note":$(".show-mes:nth-of-type(4) textarea").val()
			};
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/jianshuo/servlet/wr_info",
				data:{
					"name":localStorage.getItem("name"),
					"token":localStorage.getItem("token"),
					"info":JSON.stringify(info)
				},
				async:true,
				success:function(data){
					data = JSON.parse(data);
					if(data.admin){
						if(data.name){
							if(data.update){
								popup({type:'success',msg:"修改成功",delay:2000,callBack:function(){
									window.location.reload();
								}});
							}
							else{
								popup({type:'error',msg:"修改失败",delay:2000,bg:true,clickDomCancel:true});
							}
						}else{
							popup({type:'error',msg:"昵称已使用，请换一个",delay:2000,bg:true,clickDomCancel:true});
						}
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
	}
	
	function p_input(){
		$(".show-mes>p").each(function(index,value){
			if(index!=3){
				var aa = '<input type="text" name="" id="" value="'+$(this).text()+'" />';
				$(this).replaceWith(aa);
			}else{
				var aa = '<textarea name="" rows="" cols="">'+$(this).text()+'</textarea>';
				$(this).replaceWith(aa);
			}
		});
		
	}
});