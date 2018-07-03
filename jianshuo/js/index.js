$(function(){
	$.ajax({
		type:"post",
		url:"http://127.0.0.1:8080/jianshuo/servlet/index",
		async:true,
		success:function(data){
			data = JSON.parse(data);
			if(data){
				new Vue({
					el:'#art-vue',
					data:{
						art:data
					}
				});
				$("#art-vue>.box").show();
				$(".art>.name>a").click(function(){
					localStorage.setItem("nickname",$(this).text());
				});
				$(".content").click(function(){
					localStorage.setItem("a_id",$(this).parent().attr("art-id"));
					window.location = "article.html";
				});
				$(".comments-count").click(function(){
					localStorage.setItem("a_id",$(this).parent().attr("art-id"));
					window.location = "article.html#comments";
				});
				pubu();
			}else{
				$(".message-none").show();
			}
		},
		error:function(jqXHR){
			console.log("发生错误："+jqXHR.status);
		}
	});

	
	function pubu(){
		var $boxs = $(".main>.box");
		var w = $boxs.eq(0).outerWidth();
		var cols=Math.floor($(window).width()/w);
		$(".main").width(w*cols).css('margin','20px auto');
		var hArr = [];
		$boxs.each(function(index,value){
			var h = $boxs.eq(index).outerHeight();
			if(index<cols){
				hArr[index] = h;
			}else{
				var minH = Math.min.apply(null,hArr);	
				var minHIndex = $.inArray(minH,hArr);
				$(value).css({
					'position':'absolute',
					'top':(minH)+'px',
					'left':(minHIndex*w)+'px'
				});
				hArr[minHIndex]+=$boxs.eq(index).outerHeight();
			}
		});
	}
})


