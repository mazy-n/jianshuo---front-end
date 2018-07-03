$(function(){
	var str = localStorage.getItem("nickname")+'的信息';
	$(".message-top>span").text(str);
	$.ajax({
		type:"post",
		url:"http://127.0.0.1:8080/jianshuo/servlet/info",
		data:{
			"name":localStorage.getItem("name"),
			"token":localStorage.getItem("token"),
			"way":0,
			"nickname":localStorage.getItem("nickname")
		},
		async:true,
		success:function(data){
			data = JSON.parse(data);
			if(data.admin){
				new Vue({
					el:"#ad_mes",
					data:{
						site:data.info
					}
				});
				$(".message").show();
				gz(data.statue);
				dj();				
				$(".mes-save").css({
					"display":"block"
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
	function gz(statue){
		if(statue ===1){
			$(".show-mes:last-of-type a").text("取消关注").addClass("mes-save").attr("statue",1).css({
					"display":"block"
				});;
		}else{
			$(".show-mes:last-of-type a").text("关  注").addClass("guanzhu").attr("statue",statue);
		}
	}
	function dj(){
		$(".show-mes:last-of-type a").click(function(){
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/jianshuo/servlet/friend",
				data:{
					"name":localStorage.getItem("name"),
					"token":localStorage.getItem("token"),
					"nickname":localStorage.getItem("nickname"),	
					"way":1,
					"statue":$(".show-mes:last-of-type a").attr("statue")
				},
				async:true,
				success:function(data){
					data = JSON.parse(data);
					if(data.admin){
						if(data.create|| data.update_gz){
							popup({type:'success',msg:"关注成功",delay:1500,callBack:function(){
								if($(".show-mes:last-of-type a").hasClass("guanzhu")){
									$(".show-mes:last-of-type a").removeClass("guanzhu");
								}
								$(".show-mes:last-of-type a").text("取消关注").addClass("mes-save").attr("statue",1).css({
									"display":"block"
								});
							}});
						}else if(data.update_cancel){
							popup({type:'success',msg:"取消成功",delay:1500,callBack:function(){
								if($(".show-mes:last-of-type a").hasClass("mes-save")){
									$(".show-mes:last-of-type a").removeClass("mes-save");
								}
								$(".show-mes:last-of-type a").text("关  注").addClass("guanzhu").attr("statue",0);
							}});
						}else{
							popup({type:'error',msg:"操作失败",delay:1500,bg:true,clickDomCancel:true});
						}
					}else{
						popup({type:'error',msg:"未登陆",delay:1500,callBack:function(){
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
});