$(function(){
	var str = '<div class="com-pl">'+
			'<div class="comment-show-con-list pull-left clearfix" v-for="site in comments" v-bind:coms-id="site.id">'+
                '<div class="pl-text clearfix">'+
                    '<a href="f_info.html" class="comment-size-name">{{site.name}}</a>:'+
                    '<span class="my-pl-con">&nbsp;{{site.content}}</span>'+
                '</div>'+
                '<div class="date-dz">'+
                    '<span class="date-dz-left pull-left comment-time">{{site.data}}</span>'+
                    '<div class="date-dz-right pull-right comment-pl-block">'+
                    	'<a href="javascript:;" class="removeBlock">删除</a>'+
                        '<a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a>'+
                    '</div>'+
                '</div>'+
           '</div>'+
           '</div>';
	var $a = $(str);
	$.ajax({
		type:"post",
		url:"http://127.0.0.1:8080/jianshuo/servlet/self",
		data:{
			"name":localStorage.getItem("name"),
			"token":localStorage.getItem("token"),
			"way":1
		},
		async:true,
		success:function(data){
			console.log(data);
			data = JSON.parse(data);
			if(data.admin){
				if(data.self_art.length !=0){
					new Vue({
						el:"#f-message",
						data:{
							f_art:data.self_art
						}
					});
					$("#f-message>.box").show();
					$("#f-message>.box .name a").click(function(){
						localStorage.setItem("nickname",$(this).text());
					});
					$("#f-message>.box .f-content>p").click(function(){
						var a_id=$(this).parent().parent().attr("art-id");
						localStorage.setItem("a_id",a_id);
						window.location = "article.html";
					});
					pl_show();
					wr_coms();
					del_art();
				}else{
					$(".message-none").show();
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
	//显示评论功能
	function pl_show(){
		$(".comments").click(function(){
			$('.pl .content').flexText();
			$(this).parent().children(".sqpl").toggle();
			var a_id = $(this).parent().parent().attr("art-id");
			var $com = $(this).parent().parent().next().children("div");
			var $pl = $(this).parent().parent().next();
			if($pl.css("display")=="none"){
				pl_get(a_id,$com);
			}else{
				$(this).parent().parent().next().children(".com-pl").remove();
			}
			$pl.toggle(700);
		});
		$(".sqpl").click(function(){
			$(this).hide(200);
			$(this).parent().parent().next().toggle(700);
			$(this).parent().parent().next().children(".com-pl").remove();
		});
	}
	//评论获取
	function pl_get(a_id,$com){
		$com.next(".com-pl").remove();
		$("#comments").append($a);
		$.ajax({
			type:"post",
			url:"http://127.0.0.1:8080/jianshuo/servlet/article",
			data:{
				"a_id":a_id
			},
			async:true,
			success:function(data){
				if(data!=null){
					console.log(data);
					data = JSON.parse(data);
					var vm=new Vue({
						el:"#comments",
						data:{
							comments:data.comments
						}
					});
					$("#comments .com-pl").insertAfter($com).addClass("clearfix");
					$("#comments").children().remove();
					if(data.art.count>0){
						del_coms();
						$com.next("div").show(1000);
						$(".comment-size-name").click(function(){
							localStorage.setItem("nickname",$(this).text());
						});
						huifu();
					}
				}
			},
			error:function(jqXHR){
				console.log("发生错误："+jqXHR.status);
			}
		});
	}
	//评论回复
	function huifu(){
		$(".pl-hf").click(function(){
			var nickname = $(this).parent().parent().prev().find(".comment-size-name").text();
			var str = "回复  "+nickname +" :";
			$(this).parents(".pl").find("textarea").val(str).focus();
		});
	}
	//发表评论
	function wr_coms(){
		$("#f-message .plBtn").click(function(){
			var $content = $(this).parent().find("textarea");
			var a_id = $(this).parents(".pl").prev().attr("art-id");
			console.log(a_id);
			console.log($content.val());
			if($.trim($content.val())!=""){
				var wr_coms_content = $content.val();
				$.ajax({
					type:"post",
					url:"http://127.0.0.1:8080/jianshuo/servlet/wr_comment",
					data:{
						"name":localStorage.getItem("name"),
						"token":localStorage.getItem("token"),
						"a_id":a_id,
						"content":wr_coms_content
					},
					async:true,
					success:function(data){
						data = JSON.parse(data);
						if(data.admin){
							if(data.create){
								popup({type:'success',msg:"评论成功",delay:1500,callBack:function(){
									localStorage.setItem("a_id",a_id);
									window.location = "article.html#comments";
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
				$content.addClass("shake shake-constant");
				setTimeout(function(){
					$content.removeClass("shake shake-constant");
				},300);
			}
		});
	}
	//删除评论
	function del_coms(){
		$(".removeBlock").click(function(){
			var name = $(this).parent().parent().prev().find(".comment-size-name").text();
			var a_id = $(this).parents(".box").find(".art").attr("art-id");
			var coms_id = $(this).parents(".comment-show-con-list").attr("coms-id");
			console.log(coms_id);
			var $pl = $(this).parents(".comment-show-con-list");
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/jianshuo/servlet/self",
				data:{
					"name":localStorage.getItem("name"),
					"token":localStorage.getItem("token"),
					"coms_id":coms_id,
					"way":2
				},
				async:true,
				success:function(data){
					data = JSON.parse(data);
					if(data.admin){
						if(data.delete_coms){
							popup({type:'success',msg:"删除成功",delay:1500,callBack:function(){
								$pl.hide(1000);
								setTimeout(function(){
									$pl.remove();
								},1000);
							}});
						}else{
							popup({type:'error',msg:"删除失败",delay:1500,bg:true,clickDomCancel:true});
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
	//删除动态
	function del_art(){
		$(".delete span").click(function(){
			var a_id = $(this).parent().parent().attr("art-id");
			var $box = $(this).parents(".box");
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/jianshuo/servlet/self",
				data:{
					"name":localStorage.getItem("name"),
					"token":localStorage.getItem("token"),
					"a_id":a_id,
					"way":3
				},
				async:true,
				success:function(data){
					console.log(data);
					data = JSON.parse(data);
					if(data.admin){
						if(data.delete_art){
							popup({type:'success',msg:"删除成功",delay:1500,callBack:function(){
								$box.hide(1000);
								setTimeout(function(){
									$box.remove();
								},1000);
							}});
						}else{
							popup({type:'error',msg:"删除失败",delay:1500,bg:true,clickDomCancel:true});
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