$(function(){
	$("#art-sub").click(function(){
		if($.trim($("#art-content").val())!=""){
			var content =$("#art-content").val();
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/jianshuo/servlet/write",
				data:{
					"name":localStorage.getItem("name"),
					"token":localStorage.getItem("token"),
					"content":content
				},
				async:true,
				success:function(data){
					data = JSON.parse(data);
					if(data.admin){
						if(data.create){
							popup({type:'success',msg:"发表成功",delay:1500,callBack:function(){
								window.location = "self.html";
							}});
						}else{
							popup({type:'error',msg:"发表失败",delay:1500,bg:true,clickDomCancel:true});
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
		}else{
			$("#shell>div").addClass("shake shake-constant");
			setTimeout(function(){
				$("#shell>div").removeClass("shake shake-constant");
			},300);
		}
	});
});