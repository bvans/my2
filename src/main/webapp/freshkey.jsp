<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="Content-Script-Type" content="text/javascript">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>


		<title>梦幻西游2新手序列号</title>
		<meta name="robots" content="all">
		<meta name="copyright" content="网易，NetEase Inc.">
		<meta name="front-end technicist" content="mss">
		<meta name="viewport" name="viewport"
			content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<meta content="black" name="apple-mobile-web-app-status-bar-style">
		<meta content="yes" name="apple-touch-fullscreen">
		<meta content="telephone=no" name="format-detection">
		<link type="text/css" charset="utf-8" rel="stylesheet"
			href="./css/com.css" media="all">
		<!--   <link rel="dns-prefetch" href="http://res.nie.netease.com/"> -->
		<script charset="utf-8" src="./js/jquerymixNIE.js"></script>
	</head>
	<body>
		<article id="main">
		<h1 class="main-title">
			网易游戏序列号领取
		</h1>
		<section class="success-get">
		<div class="code-wrap">
			<h2 class="sucess-tips">
				<i class="i-tick"></i>恭喜您成功领取梦幻西游2新梦幻序列号
			</h2>
			<p class="code">
				<jsp:useBean id="db" class="bean.DBBean">
					<%=db.getFreshKey()%>
				</jsp:useBean></p>
		</div>
		<a href="javascript:void(window.location.href=window.location.href)"
			class="normal-btn get-sn">再领一个</a>
		</section>
		<section class="use-method">
		<h2 class="sub-title">
			使用方法
		</h2>
		<ul class="method-list">
			<li>
				<span class="point"></span> 进入游戏，在创建角色界面，点击“创建角色”4下
			</li>
			<li>
				<span class="point"></span> 弹出序列号输入框后，输入序列号即可
			</li>
			<li>
				<img  src="./images/createrole.jpg"	 alt="点击创建角色" />
			</li>
		</ul>
		</section>
		<section class="package">
		<h2 class="sub-title">
			礼包奖励
		</h2>
		<ul class="package-list">
			<li>
				<span class="lv lv1">0级</span>
				<span>答题卡、临时属性符+20 </span>
			</li>
			<li>
				<span class="lv lv2">10级</span>
				<span>经验20000、净水甘露（20000血）、狸BB </span>
			</li>
			<li>
				<span class="lv lv3">15级</span>
				<span>普通狸变身（2小时）、30%经验加成（2小时） </span>
			</li>
			<li>
				<span class="lv lv4">20级</span>
				<span>经验50000、储备金20000、飞行符*30 </span>
			</li>
			<li>
				<span class="lv lv5">25级</span>
				<span>变异狸变身（2小时）变身、30%经验加成（2小时） </span>
			</li>
			<li>
				<span class="lv lv6">30级</span>
				<span>经验100000、新手导标棋1张（30次） </span>
			</li>
			<li>
				<span class="lv lv6">40级</span>
				<span>绑定摄妖香*10、洞冥草*10、锦衣体验券、中级回梦丹 </span>
			</li>
			<li>
				<span class="lv lv6">50级</span>
				<span>经验150000、锦衣优惠券（9折）、中级回梦丹 </span>
			</li>
		</ul>
		</section>
		<!-- <div class="goback"><a href="http://gs.163.com/gs2/m/link/9832803" class="normal-btn">返回其他游戏序列号领取</a></div -->
		>
		</article>

		<script>
    $(".get-sn").click(function () {
        $(this).parents("form").submit();
    });
</script>


	</body>
</html>