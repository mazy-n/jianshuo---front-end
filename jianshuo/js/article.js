$(function(){
	$.ajax({
		type:"post",
		url:"http://127.0.0.1:8080/jianshuo/servlet/article",
		data:{
			"a_id":localStorage.getItem("a_id")
		},
		async:true,
		success:function(data){
			if(data!=null){
				data = JSON.parse(data);
				console.log(data.art);
				new Vue({
					el:"#article",
					data:{
						art:data.art
					}
				});
				$("#article").show();
				wr_coms();
				new Vue({
					el:"#comments",
					data:{
						comments:data.comments
					}
				});
				if(data.art.count>0){
					$("#comments").show();
					$(".comment-size-name").click(function(){
						localStorage.setItem("nickname",$(this).text());
					});
					huifu();
					md();
				}
			}
		},
		error:function(jqXHR){
			console.log("发生错误："+jqXHR.status);
		}
	});
	//评论回复
	function huifu(){
		$(".pl-hf").click(function(){
			var nickname = $(this).parent().parent().prev().find(".comment-size-name").text();
			var str = "回复  "+nickname +" :";
			$("#article .content").val(str).focus();
		});
	}
	//发表评论
	function wr_coms(){
		$("#article .plBtn").click(function(){
			if($.trim($("#article .content").val())!=""){
				var wr_coms_content = $("#article .content").val();
				$.ajax({
					type:"post",
					url:"http://127.0.0.1:8080/jianshuo/servlet/wr_comment",
					data:{
						"name":localStorage.getItem("name"),
						"token":localStorage.getItem("token"),
						"a_id":localStorage.getItem("a_id"),
						"content":wr_coms_content
					},
					async:true,
					success:function(data){
						data = JSON.parse(data);
						if(data.admin){
							if(data.create){
								popup({type:'success',msg:"评论成功",delay:1500,callBack:function(){
									window.location.reload();
								}});
							}else{
								popup({type:'error',msg:"评论失败",delay:1500,bg:true,clickDomCancel:true});
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
				$("#article .content").addClass("shake shake-constant");
				setTimeout(function(){
					$("#article .content").removeClass("shake shake-constant");
				},300);
			}
		});
	}
	//锚点跳转
	function md(){
		var md = window.location.hash;
		if(md=="#comments"){
			$("html,body").animate({scrollTop: $(".main #comments").offset().top-100}, 1000);
		}
	}
});