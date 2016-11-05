function update_paper_html(a, b, c) {
	show_loading(),
	$.ajax({
		type: "GET",
		url: a,
		success: function(a) {
			var c = /<!--real_content begin-->((.|\n|\r)*)<!--real_content end-->/gi,
			d = c.exec(a);
			$("#content_page").empty(),
			$("#content_page").append("<div></div>" + d[1]),
			b && b()
		},
		error: c,
		complete: function() {
			hide_loading()
		}
	})
}
function get_query(a) {
	a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var b = new RegExp("[\\?&]" + a + "=([^&#]*)"),
	c = b.exec(location.search);
	return null === c ? "": decodeURIComponent(c[1].replace(/\+/g, " "))
}
function show_paper_evaluated() {
	$(".feedBack").html("<h4>您已评价，谢谢！</h4>")
}
function load_paper(a, b) {
	var c = parseInt(get_query("paper_id"));
	isNaN(c) && (c = b),
	update_paper_html("/web_res/guide/paper/" + a + "/" + c + ".html",
	function() {
		if ($("#feedback").length > 0) {
			$("#feedback").appendTo("section").show();
			var a = $.parseJSON($.cookie("evaluated_papers"));
			a && a.indexOf(c) >= 0 && show_paper_evaluated()
		}
	},
	function() {
		alertEx("加载常见问题失败！",
		function() {
			history.go( - 1)
		})
	})
}
function load_news(a) {
	var b = get_query("news");
	b || (b = a),
	update_paper_html(b, null,
	function() {
		alertEx("加载新闻详情失败！",
		function() {
			history.go( - 1)
		})
	})
}
function evaluate_paper(a, b) {
	$.post(window.location.href + "servlet/Guide_csa_py", {
		paper_id: a,
		act: "feedback",
		evaluation: b
	},
	function() {
		var b = $.parseJSON($.cookie("evaluated_papers"));
		b || (b = []),
		b.indexOf(a) < 0 && (b.push(a), $.cookie("evaluated_papers", "[" + b.toString() + "]")),
		show_paper_evaluated(),
		alert("谢谢您的反馈！")
	})
}
function set_validate_img_url(a) {
	var b = document.getElementById("validate_img");
	b && (b.src = a ? window.location.href + "servlet/cn_create_validate_image_py?stamp=" + Math.random() : window.location.href + "servlet/cv2_py?stamp=" + Math.random())
}
function escapeHTML(a) {
	return $("<div/>").text(a).html()
}
function send_sprite_eval(a, b, c, d, e) {
	$.ajax({
		url: window.location.href + "servlet/csa_sprite_py",
		data: {
			act: "evaluation",
			product_name: a,
			question: c,
			answer: d,
			solved: e,
			log_name: b
		},
		type: "POST",
		success: function() {}
	})
}
function is_sprite_default_answer(a, b) {
	return b ? "xyq" == b ? a.indexOf("[默认答案]") >= 0 : "tx2" == b ? a.indexOf("无法给您答案") >= 0 : "zhxf" == b ? a.indexOf("[默认答案]") >= 0 : "mibao" == b ? a.indexOf("[默认答案]") >= 0 : "xy2" == b ? a.indexOf("暂时无法给您答案") >= 0 : "wh" == b ? a.indexOf("[默认回答]") >= 0 : "lj" == b ? a.indexOf("暂时无法给您答案") >= 0 : "dt2" == b ? a.indexOf("&lt;默认回复&gt;") >= 0 : "newff" == b || "ff" == b ? a.indexOf("无法识别你的问题") >= 0 : a.indexOf("暂时无法给您答案") >= 0 || a.indexOf("&lt;默认答案&gt;") >= 0 || a.indexOf("&lt;默认回复&gt;") >= 0 : a.indexOf("[默认答案]") >= 0
}
function is_sprite_illegal_question(a) {
	return a.indexOf("【非法字符】") >= 0
}
function get_sprite_question_prefix(a, b) {
	var c = ["zh", "wh", "lj", "xy3", "x3"];
	return "cbgm" == b ? "DHOTC ": "xyqm" == b ? "【phone】 ": c.indexOf(a) >= 0 ? "KFZQ  ": ""
}
function is_sprite_overlong_question(a, b, c) {
	return void 0 === c && (c = 12),
	a.length > c
}
function strip_sprite_default_answer(a) {
	return 0 === a.indexOf("[默认答案]") ? a.substring("[默认答案]".length) : 0 === a.indexOf("[默认回答]") ? a.substring("[默认回答]".length) : 0 === a.indexOf("<默认回复>") ? a.substring("<默认回复>".length) : 0 === a.indexOf("[默认回复]") ? a.substring("[默认回复]".length) : 0 === a.indexOf("&lt;默认回复&gt;") ? a.substring("&lt;默认回复&gt;".length) : 0 === a.indexOf("&lt;默认答案&gt;") ? a.substring("&lt;默认答案&gt;".length) : a
}
function clear_cookie() {
	$.cookie("login_urs", ""),
	$.cookie("login_id", ""),
	$.cookie("reply_que", ""),
	$.cookie("new_msg", ""),
	$.cookie("reset_urs", 1)
}
function render_login_status(a) {
	parseInt(a.reply_que) ? ($("<strong>" + a.reply_que + "</strong>").appendTo("#nav_myq h2"), $("<span>" + a.reply_que + "</span>").appendTo("#circle")) : ($("#nav_myq h2 strong").remove(), $("#circle span").remove())
}
function set_login_status(a, b) {
	var c;
	$.cookie("login_urs") || b ? a || (c = {
		login_urs: $.cookie("login_urs") || "",
		login_id: $.cookie("login_id"),
		reply_que: $.cookie("reply_que"),
		new_msg: $.cookie("new_msg")
	},
	render_login_status(c)) : $.ajax({
		type: "GET",
		url: window.location.href + "servlet/Guide_csa_py?act=login_status",
		dataType: "json",
		headers: {
			"If-Modified-Since": "0"
		},
		success: function(b) {
			b && b.login_urs ? ($.cookie("login_urs", b.login_urs), $.cookie("login_id", b.login_id), $.cookie("reply_que", b.reply_que), $.cookie("new_msg", b.new_msg), $.cookie("recent_msg", b.recent_msg)) : b = {
				login_urs: "",
				login_id: "",
				reply_que: 0,
				new_msg: 0
			},
			a || render_login_status(b)
		}
	})
}
function show_general_loading(a) {
	$("#" + a).remove();
	var b = window.innerHeight / 2.5 - 32 + "px;",
	c = window.innerWidth / 2 - 16 + "px;";
	$("body").append($('<span class="loading spin" id="' + a + '" style="top:' + b + "left:" + c + 'position:fixed;"></span>'))
}
function hide_general_loading(a) {
	$("#" + a).remove()
}
function show_loading() {
	show_general_loading("loading")
}
function hide_loading() {
	hide_general_loading("loading")
}
function show_preloading() {
	show_general_loading("preloading")
}
function hide_preloading() {
	hide_general_loading("preloading")
}
function check_ajax(a) {
	return "success" != a.result ? a.msg.indexOf("超时") > 0 ? (alertEx("会话过期，请重新进入客服专区",
	function() {}), !1) : (alert(a.msg), !1) : !0
}
function format_time(a) {
	var b = a.getHours();
	10 > b && (b = "0" + b);
	var c = a.getMinutes();
	10 > c && (c = "0" + c);
	var d = a.getSeconds();
	return 10 > d && (d = "0" + d),
	b + ":" + c + ":" + d
}
function nav_bar(a, b) {
	this.hide = function() {
		this._nav_status < 0 || ($("#nav").css3Animate({
			x: 0,
			time: "300ms",
			opacity: 0,
			callback: function() {
				$("footer").width("0"),
				$("#circle").addClass(c._nav_pos),
				$("#circle span").show()
			}
		}), this._nav_status *= -1)
	},
	this.show = function() {
		this._nav_status > 0 || ($("footer").width("100%"), $("#nav").css3Animate({
			x: parseInt($("#nav").css("width")),
			time: "300ms",
			opacity: 1,
			callback: function() {
				$("#circle").attr("class", "circle"),
				$("#circle span").hide()
			}
		}), this._nav_status *= -1)
	};
	var c = this;
	this._on_nav = a,
	this._nav_pos = b,
	$("#circle").addClass(b),
	$("#" + this._on_nav).addClass("on"),
	this._nav_status = -1,
	$("#navHandler").click(function() {
		c._nav_status > 0 ? c.hide() : c.show()
	})
}
function check_external_link(a) {
	var b = location.href,
	c = b.split("/"),
	d = c[0] + "//" + c[2];
	return null !== a.match("http://|https://") && 0 !== a.indexOf(d) ? !0 : !1
}
function mark_external_link(a) {
	return a.find("a").each(function() {
		var a = $(this);
		check_external_link(a.attr("href")) && a.addClass("externalLink")
	}),
	a
}
function find_pos(a) {
	var b = 0;
	if (a.offsetParent) {
		do b += a.offsetTop;
		while (a = a.offsetParent);
		return [b]
	}
}
function nativeScroll(a) {
	this.refresh = function() {},
	this.scrollToElement = function(b) {
		var c = $("#" + a).find(b);
		c.length > 0 && window.scroll(0, find_pos(c[0]))
	}
}
function parse_qs(a) {
	var b = {};
	if ("" === a) return b;
	for (var c = a.split("&"), d = 0; d < c.length; d++) {
		var e = c[d].split("=");
		b[e[0]] = 2 == e.length ? e[1] : ""
	}
	return b
}
function resize_hot() {
	$("#hot_list a").each(function(a, b) {
		var c, d = parseInt(.9 * $(b).width()),
		e = parseInt(.9 * $(b).height()),
		f = Math.floor(d / 14),
		g = $(b).text().split("").length;
		c = d / g > e ? e: Math.floor(d / g) > 14 ? Math.floor(d / g) : 14,
		f >= g ? $(b).css("line-height", e + "px") : $(b).css("line-height", "1.2em"),
		g > f && 2 * f >= g && $(b).children("span").css("margin-top", "6px"),
		$(b).css("font-size", c + "px")
	})
}
function sprite(a, b, c, d, e, f, g) {
	this.chat_bot = function(a, b, c) {
		$.getJSON(window.location.href + "servlet/csa_sprite_py", {
			act: "ask",
			question: b,
			product_name: this.product_name,
			log_name: f
		},
		function(d) {
			return "success" != d.result ? (hide_loading(), void alert("提问失败，请重试")) : void c(a, b, d)
		})
	},
	this.can_ask = function() {
		var a = (new Date).getTime();
		return a - this.last_click_time < 1e3 ? !1 : (this.last_click_time = a, !0)
	},
	this.ask_one_question = function(a) {
		if (this.can_ask()) {
			this.hide_evaluation(),
			this.last_input = a;
			var b = get_sprite_question_prefix(this.product_name, f) + a;
			show_loading(),
			this.chat_bot(a, b, this.chat_bot_callback)
		}
	},
	this.reask_question = function(a) {
		if (this.can_ask()) {
			this.last_input = "";
			var b = get_sprite_question_prefix(this.product_name, f) + a;
			this.chat_bot(a, b, this.chat_bot_callback)
		}
	},
	this.set_eval = function(a, b) {
		var c = $("#" + this.eval_div_id);
		c.children('input[name="question"]').val(a),
		c.children('input[name="raw_answer"]').val(b),
		$("[name='solved_eval_btn']").unbind("click").click(function() {
			return h.sprite_evaluation(1, c),
			!1
		}),
		$("[name='unsolved_eval_btn']").unbind("click").click(function() {
			return h.sprite_evaluation(0, c),
			!1
		})
	},
	this.sprite_evaluation = function(a, b) {
		var c = b.children('input[name="question"]').val(),
		d = b.children('input[name="raw_answer"]').val();
		send_sprite_eval(this.product_name, f, c, d, a),
		1 == a ? this.set_sprite_msg("感谢您对小精灵的支持！", !0, !0, !0) : 0 === a && this.set_sprite_msg(h.unsolved_msg, !0, !0, !0),
		this.hide_evaluation()
	},
	this.chat_bot_callback = function(a, b, c) {
		return is_sprite_illegal_question(c.raw_answer, h.product_name) ? (hide_loading(), void alert("非法字符，请重新输入")) : (h.set_guest_msg(a, !1), is_sprite_default_answer(c.raw_answer, h.product_name) ? h.set_sprite_msg(strip_sprite_default_answer(c.answer), !0, !0, !1) : (is_sprite_overlong_question(h.last_input, h.product_name, LONG_QUESTION_LENGTH) && h.set_sprite_msg(h.overlong_msg, !0, !0, !1), h.set_sprite_msg(c.answer, !1, !0, !1), h.set_eval(b, c.raw_answer)), void hide_loading())
	},
	this.set_msg_window = function(a, b, c) {
		this.msg_div_obj.append(mark_external_link($(a))),
		this.scroller.refresh(),
		this.msg_div.clientHeight < this.old_msg_height && b && (this.msg_div.scrollTop = this.old_msg_height - 139),
		b && parseInt(this.msg_div_obj.height()) > parseInt($("#wrapper").height()) && (c ? this.scroller.scrollToElement("h3:last-of-type", 1e3) : this.scroller.scrollToElement("h3:nth-last-of-type(2)", 1e3))
	},
	this.scroll_top = function() {
		this.scroller.scrollToElement("div.spriteTab", 1e3)
	},
	this.set_guest_msg = function(a, b) {
		var c = "<h3>" + format_time(new Date) + '</h3> <div class="dialogue customer"> <div class="userThum"></div> <div class="diaPopup"> <i class="cornner"></i> <div class="diaCont">' + escapeHTML(a) + "</div> </div> </div>";
		h.set_msg_window(c, b, !1)
	},
	this.set_sprite_msg = function(a, b, c, d) {
		var e = $("<h3>" + format_time(new Date) + '</h3> <div class="dialogue service"> <div class="userThum ' + this.product_name + '_userThum"></div> <div class="diaPopup"> <i class="cornner"></i> <div class="diaCont">' + a + "</div> </div> </div>");
		g == EVAL_EMBED && e.find(".diaPopup").append($("#" + this.eval_div_id)),
		h.set_msg_window(e, c, d),
		b || this.show_evaluation()
	},
	this.update_old_msg_height = function() {
		this.old_msg_height = this.msg_div.scrollHeight
	},
	this.show_evaluation = function() {
		$("#" + this.eval_div_id).show()
	},
	this.hide_evaluation = function() {
		$("#" + this.eval_div_id).hide()
	};
	var h = this;
	this.msg_div_id = a,
	this.eval_div_id = b,
	this.product_name = e,
	this.msg_div_obj = $("#" + a),
	this.msg_div = $("body")[0],
	this.old_msg_height = 0,
	this.unsolved_msg = c,
	this.overlong_msg = d,
	this.last_input = "",
	this.last_click_time = (new Date).getTime(),
	$.os.android ? ($(".container").append('<div class="blank"></div>'), this.scroller = new nativeScroll("wrapper")) : ($("#wrapper").addClass("wrapper"), this.scroller = new iScroll("wrapper", {
		useTransition: !0,
		wheel: !0,
		click: !0,
		onScrollEnd: function() {
			"function" == typeof show_arr_top && show_arr_top()
		}
	}), document.addEventListener("touchmove",
	function(a) {
		a.preventDefault()
	},
	!1))
}
function SpriteQuestionHistory() {
	this.maxNum = 5,
	this.name = "sqh",
	this.get = function() {
		var a = localStorage.getItem(this.name);
		if (!a) return [];
		try {
			var b = JSON.parse(a)
		} catch(c) {
			return this.clear(),
			[]
		}
		return b || (b = []),
		b.length > this.maxNum && (b = b.slice( - this.maxNum)),
		b
	},
	this.set = function(a) {
		"·" == a[0] && (a = a.slice(1));
		for (var b = this.get(), c = -1, d = 0; d < b.length; d++) if (b[d] == a) {
			c = d;
			break
		}
		c >= 0 && (b = b.slice(0, c).concat(b.slice(c + 1, b.length))),
		b.push(a),
		localStorage.setItem(this.name, JSON.stringify(b))
	},
	this.clear = function() {
		localStorage.setItem(this.name, "")
	}
}
function SpriteTips(a, b, c) {
	this.shown = !1,
	this.tips_id = a,
	this.ques_id = b,
	this.cur_ques = "",
	this.gameid = c,
	this.waiting = !1;
	var d = this,
	e = function() {
		$("#" + b).bind("input",
		function() {
			d.getData($(this).val())
		}),
		$("#" + b).bind("focus",
		function() {
			d.checkHistory($(this).val())
		}),
		$("body").bind("touchend",
		function(c) {
			var e = $(c.target).attr("id");
			e != b && setTimeout(function() {
				$("#" + b)[0].blur()
			},
			200),
			0 == $(c.target).parents("#" + a).length && e != b && setTimeout(function() {
				d.hideTips()
			},
			100)
		})
	};
	e()
}
if (!window.jq || "function" != typeof jq) {
	var jq = function(a) {
		function b(a, b, c) {
			var d = v.createDocumentFragment();
			if (c) {
				for (var e = a.length - 1; e >= 0; e--) d.insertBefore(a[e], d.firstChild);
				b.insertBefore(d, b.firstChild)
			} else {
				for (var e = 0; e < a.length; e++) d.appendChild(a[e]);
				b.appendChild(d)
			}
			d = null
		}
		function c(a) {
			return a in y ? y[a] : y[a] = new RegExp("(^|\\s)" + a + "(\\s|$)")
		}
		function d(a) {
			for (var b = 0; b < a.length; b++) a.indexOf(a[b]) != b && (a.splice(b, 1), b--);
			return a
		}
		function e(a, b) {
			var c = [];
			if (a == u) return c;
			for (; a; a = a.nextSibling) 1 == a.nodeType && a !== b && c.push(a);
			return c
		}
		function f(a, b) {
			try {
				return b.querySelectorAll(a)
			} catch(c) {
				return []
			}
		}
		function g(a, b) {
			if (a = a.trim(), "#" === a[0] && -1 == a.indexOf(".") && -1 === a.indexOf(" ") && -1 === a.indexOf(">")) b == v ? h(b.getElementById(a.replace("#", "")), this) : h(f(a, b), this);
			else if ("<" === a[0] && ">" === a[a.length - 1]) {
				var c = v.createElement("div");
				c.innerHTML = a.trim(),
				h(c.childNodes, this)
			} else h(f(a, b), this);
			return this
		}
		function h(a, b) {
			if (a) {
				if (a.nodeType) return b[b.length++] = a;
				for (var c = 0,
				d = a.length; d > c; c++) b[b.length++] = a[c]
			}
		}
		function i() {}
		function j(b, c) {
			b.os = {},
			b.os.webkit = c.match(/WebKit\/([\d.]+)/) ? !0 : !1,
			b.os.android = c.match(/(Android)\s+([\d.]+)/) || c.match(/Silk-Accelerated/) ? !0 : !1,
			b.os.androidICS = b.os.android && c.match(/(Android)\s4/) ? !0 : !1,
			b.os.ipad = c.match(/(iPad).*OS\s([\d_]+)/) ? !0 : !1,
			b.os.iphone = !b.os.ipad && c.match(/(iPhone\sOS)\s([\d_]+)/) ? !0 : !1,
			b.os.webos = c.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? !0 : !1,
			b.os.touchpad = b.os.webos && c.match(/TouchPad/) ? !0 : !1,
			b.os.ios = b.os.ipad || b.os.iphone,
			b.os.playbook = c.match(/PlayBook/) ? !0 : !1,
			b.os.blackberry = b.os.playbook || c.match(/BlackBerry/) ? !0 : !1,
			b.os.blackberry10 = b.os.blackberry && c.match(/Safari\/536/) ? !0 : !1,
			b.os.chrome = c.match(/Chrome/) ? !0 : !1,
			b.os.opera = c.match(/Opera/) ? !0 : !1,
			b.os.fennec = c.match(/fennec/i) ? !0 : c.match(/Firefox/) ? !0 : !1,
			b.os.ie = c.match(/MSIE 10.0/i) ? !0 : !1,
			b.os.ieTouch = b.os.ie && c.toLowerCase().match(/touch/i) ? !0 : !1,
			b.os.supportsTouch = a.DocumentTouch && v instanceof a.DocumentTouch || "ontouchstart" in a,
			b.feat = {};
			var d = v.documentElement.getElementsByTagName("head")[0];
			b.feat.nativeTouchScroll = "undefined" != typeof d.style["-webkit-overflow-scrolling"] && b.os.ios,
			b.feat.cssPrefix = b.os.webkit ? "Webkit": b.os.fennec ? "Moz": b.os.ie ? "ms": b.os.opera ? "O": "",
			b.feat.cssTransformStart = b.os.opera ? "(": "3d(",
			b.feat.cssTransformEnd = b.os.opera ? ")": ",0)",
			b.os.android && !b.os.webkit && (b.os.android = !1)
		}
		function k(a) {
			return a._jqmid || (a._jqmid = G++)
		}
		function l(a, b, c, d) {
			if (b = m(b), b.ns) var e = n(b.ns);
			return (F[k(a)] || []).filter(function(a) {
				return ! (!a || b.e && a.e != b.e || b.ns && !e.test(a.ns) || c && a.fn != c && ("function" != typeof a.fn || "function" != typeof c || "" + a.fn != "" + c) || d && a.sel != d)
			})
		}
		function m(a) {
			var b = ("" + a).split(".");
			return {
				e: b[0],
				ns: b.slice(1).sort().join(" ")
			}
		}
		function n(a) {
			return new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)")
		}
		function o(a, b, c) {
			E.isObject(a) ? E.each(a, c) : a.split(/\s/).forEach(function(a) {
				c(a, b)
			})
		}
		function p(a, b, c, d, e) {
			var f = k(a),
			g = F[f] || (F[f] = []);
			o(b, c,
			function(b, c) {
				var f = e && e(c, b),
				h = f || c,
				i = function(b) {
					var c = h.apply(a, [b].concat(b.data));
					return c === !1 && b.preventDefault(),
					c
				},
				j = E.extend(m(b), {
					fn: c,
					proxy: i,
					sel: d,
					del: f,
					i: g.length
				});
				g.push(j),
				a.addEventListener(j.e, i, !1)
			})
		}
		function q(a, b, c, d) {
			var e = k(a);
			o(b || "", c,
			function(b, c) {
				l(a, b, c, d).forEach(function(b) {
					delete F[e][b.i],
					a.removeEventListener(b.e, b.proxy, !1)
				})
			})
		}
		function r(a) {
			var b = E.extend({
				originalEvent: a
			},
			a);
			return E.each(J,
			function(c, d) {
				b[c] = function() {
					return this[d] = H,
					"stopImmediatePropagation" != c && "stopPropagation" != c || (a.cancelBubble = !0, a[c]) ? a[c].apply(a, arguments) : void 0
				},
				b[d] = I
			}),
			b
		}
		function s(a, b) {
			if (b && a.dispatchEvent) {
				var c = E.Event("destroy", {
					bubbles: !1
				});
				a.dispatchEvent(c)
			}
			var d = k(a);
			if (d && F[d]) {
				for (var e in F[d]) a.removeEventListener(F[d][e].e, F[d][e].proxy, !1);
				delete F[d]
			}
		}
		function t(a, b) {
			if (a) {
				var c = a.childNodes;
				if (c && c.length > 0) for (var d in c) t(c[d], b);
				s(a, b)
			}
		}
		var u, v = a.document,
		w = [],
		x = w.slice,
		y = {},
		z = 1,
		A = /^\s*<(\w+)[^>]*>/,
		B = {},
		C = {},
		D = function(a, b) {
			if (this.length = 0, !a) return this;
			if (a instanceof D && b == u) return a;
			if (E.isFunction(a)) return E(v).ready(a);
			if (E.isArray(a) && a.length != u) {
				for (var c = 0; c < a.length; c++) this[this.length++] = a[c];
				return this
			}
			if (E.isObject(a) && E.isObject(b)) {
				if (a.length == u) a.parentNode == b && (this[this.length++] = a);
				else for (var c = 0; c < a.length; c++) a[c].parentNode == b && (this[this.length++] = a[c]);
				return this
			}
			if (E.isObject(a) && b == u) return this[this.length++] = a,
			this;
			if (b !== u) {
				if (b instanceof D) return b.find(a)
			} else b = v;
			return this.selector(a, b)
		},
		E = function(a, b) {
			return new D(a, b)
		};
		E.is$ = function(a) {
			return a instanceof D
		},
		E.map = function(a, b) {
			var c, d, e, f = [];
			if (E.isArray(a)) for (d = 0; d < a.length; d++) c = b(a[d], d),
			c !== u && f.push(c);
			else if (E.isObject(a)) for (e in a) a.hasOwnProperty(e) && (c = b(a[e], e), c !== u && f.push(c));
			return E([f])
		},
		E.each = function(a, b) {
			var c, d;
			if (E.isArray(a)) {
				for (c = 0; c < a.length; c++) if (b(c, a[c]) === !1) return a
			} else if (E.isObject(a)) for (d in a) if (a.hasOwnProperty(d) && b(d, a[d]) === !1) return a;
			return a
		},
		E.extend = function(a) {
			if (a == u && (a = this), 1 === arguments.length) {
				for (var b in a) this[b] = a[b];
				return this
			}
			return x.call(arguments, 1).forEach(function(b) {
				for (var c in b) a[c] = b[c]
			}),
			a
		},
		E.isArray = function(a) {
			return a instanceof Array && a.push != u
		},
		E.isFunction = function(a) {
			return "function" == typeof a && !(a instanceof RegExp)
		},
		E.isObject = function(a) {
			return "object" == typeof a
		},
		E.fn = D.prototype = {
			constructor: D,
			forEach: w.forEach,
			reduce: w.reduce,
			push: w.push,
			indexOf: w.indexOf,
			concat: w.concat,
			selector: g,
			oldElement: u,
			slice: w.slice,
			setupOld: function(a) {
				return a == u ? E() : (a.oldElement = this, a)
			},
			map: function(a) {
				var b, c, d = [];
				for (c = 0; c < this.length; c++) b = a(c, this[c]),
				b !== u && d.push(b);
				return E([d])
			},
			each: function(a) {
				return this.forEach(function(b, c) {
					a.call(b, c, b)
				}),
				this
			},
			ready: function(a) {
				return "complete" === v.readyState || "loaded" === v.readyState || !E.os.ie && "interactive" === v.readyState ? a() : v.addEventListener("DOMContentLoaded", a, !1),
				this
			},
			find: function(a) {
				if (0 === this.length) return this;
				for (var b, c = [], e = 0; e < this.length; e++) {
					b = E(a, this[e]);
					for (var f = 0; f < b.length; f++) c.push(b[f])
				}
				return E(d(c))
			},
			html: function(a, b) {
				if (0 === this.length) return this;
				if (a === u) return this[0].innerHTML;
				for (var c = 0; c < this.length; c++) b !== !1 && E.cleanUpContent(this[c], !1, !0),
				this[c].innerHTML = a;
				return this
			},
			text: function(a) {
				if (0 === this.length) return this;
				if (a === u) return this[0].textContent;
				for (var b = 0; b < this.length; b++) this[b].textContent = a;
				return this
			},
			css: function(b, c, d) {
				var e = d != u ? d: this[0];
				if (0 === this.length) return this;
				if (c == u && "string" == typeof b) {
					{
						a.getComputedStyle(e)
					}
					return e.style[b] ? e.style[b] : a.getComputedStyle(e)[b]
				}
				for (var f = 0; f < this.length; f++) if (E.isObject(b)) for (var g in b) this[f].style[g] = b[g];
				else this[f].style[b] = c;
				return this
			},
			vendorCss: function(a, b, c) {
				return this.css(E.feat.cssPrefix + a, b, c)
			},
			empty: function() {
				for (var a = 0; a < this.length; a++) E.cleanUpContent(this[a], !1, !0),
				this[a].innerHTML = "";
				return this
			},
			hide: function() {
				if (0 === this.length) return this;
				for (var a = 0; a < this.length; a++)"none" != this.css("display", null, this[a]) && (this[a].setAttribute("jqmOldStyle", this.css("display", null, this[a])), this[a].style.display = "none");
				return this
			},
			show: function() {
				if (0 === this.length) return this;
				for (var a = 0; a < this.length; a++)"none" == this.css("display", null, this[a]) && (this[a].style.display = this[a].getAttribute("jqmOldStyle") ? this[a].getAttribute("jqmOldStyle") : "block", this[a].removeAttribute("jqmOldStyle"));
				return this
			},
			toggle: function(b) {
				for (var c = b === !0 ? !0 : !1, d = 0; d < this.length; d++)"none" !== a.getComputedStyle(this[d]).display || b !== u && c === !1 ? (this[d].setAttribute("jqmOldStyle", this[d].style.display), this[d].style.display = "none") : (this[d].style.display = this[d].getAttribute("jqmOldStyle") != u ? this[d].getAttribute("jqmOldStyle") : "block", this[d].removeAttribute("jqmOldStyle"));
				return this
			},
			val: function(a) {
				if (0 === this.length) return a === u ? u: this;
				if (a == u) return this[0].value;
				for (var b = 0; b < this.length; b++) this[b].value = a;
				return this
			},
			attr: function(a, b) {
				if (0 === this.length) return b === u ? u: this;
				if (b === u && !E.isObject(a)) {
					var c = this[0].jqmCacheId && B[this[0].jqmCacheId][a] ? this[0].jqmCacheId && B[this[0].jqmCacheId][a] : this[0].getAttribute(a);
					return c
				}
				for (var d = 0; d < this.length; d++) if (E.isObject(a)) for (var e in a) E(this[d]).attr(e, a[e]);
				else E.isArray(b) || E.isObject(b) || E.isFunction(b) ? (this[d].jqmCacheId || (this[d].jqmCacheId = E.uuid()), B[this[d].jqmCacheId] || (B[this[d].jqmCacheId] = {}), B[this[d].jqmCacheId][a] = b) : null == b && b !== u ? (this[d].removeAttribute(a), this[d].jqmCacheId && B[this[d].jqmCacheId][a] && delete B[this[d].jqmCacheId][a]) : this[d].setAttribute(a, b);
				return this
			},
			removeAttr: function(a) {
				for (var b = this,
				c = 0; c < this.length; c++) a.split(/\s+/g).forEach(function(d) {
					b[c].removeAttribute(d),
					b[c].jqmCacheId && B[b[c].jqmCacheId][a] && delete B[b[c].jqmCacheId][a]
				});
				return this
			},
			prop: function(a, b) {
				if (0 === this.length) return b === u ? u: this;
				if (b === u && !E.isObject(a)) {
					var c, d = this[0].jqmCacheId && C[this[0].jqmCacheId][a] ? this[0].jqmCacheId && C[this[0].jqmCacheId][a] : !(c = this[0][a]) && a in this[0] ? this[0][a] : c;
					return d
				}
				for (var e = 0; e < this.length; e++) if (E.isObject(a)) for (var f in a) E(this[e]).prop(f, a[f]);
				else E.isArray(b) || E.isObject(b) || E.isFunction(b) ? (this[e].jqmCacheId || (this[e].jqmCacheId = E.uuid()), C[this[e].jqmCacheId] || (C[this[e].jqmCacheId] = {}), C[this[e].jqmCacheId][a] = b) : null == b && b !== u ? E(this[e]).removeProp(a) : this[e][a] = b;
				return this
			},
			removeProp: function(a) {
				for (var b = this,
				c = 0; c < this.length; c++) a.split(/\s+/g).forEach(function(d) {
					b[c][d] && delete b[c][d],
					b[c].jqmCacheId && C[b[c].jqmCacheId][a] && delete C[b[c].jqmCacheId][a]
				});
				return this
			},
			remove: function(a) {
				var b = E(this).filter(a);
				if (b == u) return this;
				for (var c = 0; c < b.length; c++) E.cleanUpContent(b[c], !0, !0),
				b[c].parentNode.removeChild(b[c]);
				return this
			},
			addClass: function(a) {
				for (var b = 0; b < this.length; b++) {
					var c = this[b].className,
					d = [],
					e = this;
					a.split(/\s+/g).forEach(function(a) {
						e.hasClass(a, e[b]) || d.push(a)
					}),
					this[b].className += (c ? " ": "") + d.join(" "),
					this[b].className = this[b].className.trim()
				}
				return this
			},
			removeClass: function(a) {
				for (var b = 0; b < this.length; b++) {
					if (a == u) return this[b].className = "",
					this;
					var d = this[b].className;
					a.split(/\s+/g).forEach(function(a) {
						d = d.replace(c(a), " ")
					}),
					this[b].className = d.length > 0 ? d.trim() : ""
				}
				return this
			},
			replaceClass: function(a, b) {
				for (var d = 0; d < this.length; d++) if (a != u) {
					var e = this[d].className;
					a.split(/\s+/g).concat(b.split(/\s+/g)).forEach(function(a) {
						e = e.replace(c(a), " ")
					}),
					e = e.trim(),
					this[d].className = e.length > 0 ? (e + " " + b).trim() : b
				} else this[d].className = b;
				return this
			},
			hasClass: function(a, b) {
				return 0 === this.length ? !1 : (b || (b = this[0]), c(a).test(b.className))
			},
			append: function(c, d) {
				if (c && c.length != u && 0 === c.length) return this; (E.isArray(c) || E.isObject(c)) && (c = E(c));
				var e;
				for (e = 0; e < this.length; e++) if (c.length && "string" != typeof c) c = E(c),
				b(c, this[e], d);
				else {
					var f = A.test(c) ? E(c) : u; (f == u || 0 == f.length) && (f = v.createTextNode(c)),
					f.nodeName == u || "script" != f.nodeName.toLowerCase() || f.type && "text/javascript" !== f.type.toLowerCase() ? f instanceof D ? b(f, this[e], d) : d != u ? this[e].insertBefore(f, this[e].firstChild) : this[e].appendChild(f) : a.eval(f.innerHTML)
				}
				return this
			},
			appendTo: function(a) {
				var b = E(a);
				return b.append(this),
				this
			},
			prependTo: function(a) {
				var b = E(a);
				return b.append(this, !0),
				this
			},
			prepend: function(a) {
				return this.append(a, 1)
			},
			insertBefore: function(a, b) {
				if (0 == this.length) return this;
				if (a = E(a).get(0), !a) return this;
				for (var c = 0; c < this.length; c++) b ? a.parentNode.insertBefore(this[c], a.nextSibling) : a.parentNode.insertBefore(this[c], a);
				return this
			},
			insertAfter: function(a) {
				this.insertBefore(a, !0)
			},
			get: function(a) {
				return a = a == u ? 0 : a,
				0 > a && (a += this.length),
				this[a] ? this[a] : u
			},
			offset: function() {
				if (0 === this.length) return this;
				if (this[0] == a) return {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					width: a.innerWidth,
					height: a.innerHeight
				};
				var b = this[0].getBoundingClientRect();
				return {
					left: b.left + a.pageXOffset,
					top: b.top + a.pageYOffset,
					right: b.right + a.pageXOffset,
					bottom: b.bottom + a.pageYOffset,
					width: b.right - b.left,
					height: b.bottom - b.top
				}
			},
			height: function(b) {
				if (0 === this.length) return this;
				if (b != u) return this.css("height", b);
				if (this[0] == this[0].window) return a.innerHeight;
				if (this[0].nodeType == this[0].DOCUMENT_NODE) return this[0].documentElement.offsetheight;
				var c = this.css("height").replace("px", "");
				return c ? c: this.offset().height
			},
			width: function(b) {
				if (0 === this.length) return this;
				if (b != u) return this.css("width", b);
				if (this[0] == this[0].window) return a.innerWidth;
				if (this[0].nodeType == this[0].DOCUMENT_NODE) return this[0].documentElement.offsetwidth;
				var c = this.css("width").replace("px", "");
				return c ? c: this.offset().width
			},
			parent: function(a, b) {
				if (0 == this.length) return this;
				for (var c = [], e = 0; e < this.length; e++) for (var f = this[e]; f.parentNode && f.parentNode != v && (c.push(f.parentNode), f.parentNode && (f = f.parentNode), b););
				return this.setupOld(E(d(c)).filter(a))
			},
			parents: function(a) {
				return this.parent(a, !0)
			},
			children: function(a) {
				if (0 == this.length) return this;
				for (var b = [], c = 0; c < this.length; c++) b = b.concat(e(this[c].firstChild));
				return this.setupOld(E(b).filter(a))
			},
			siblings: function(a) {
				if (0 == this.length) return this;
				for (var b = [], c = 0; c < this.length; c++) this[c].parentNode && (b = b.concat(e(this[c].parentNode.firstChild, this[c])));
				return this.setupOld(E(b).filter(a))
			},
			closest: function(a, b) {
				if (0 == this.length) return this;
				var c = this[0],
				d = E(a, b);
				if (0 == d.length) return E();
				for (; c && -1 == d.indexOf(c);) c = c !== b && c !== v && c.parentNode;
				return E(c)
			},
			filter: function(a) {
				if (0 == this.length) return this;
				if (a == u) return this;
				for (var b = [], c = 0; c < this.length; c++) {
					var e = this[c];
					e.parentNode && E(a, e.parentNode).indexOf(e) >= 0 && b.push(e)
				}
				return this.setupOld(E(d(b)))
			},
			not: function(a) {
				if (0 == this.length) return this;
				for (var b = [], c = 0; c < this.length; c++) {
					var e = this[c];
					e.parentNode && -1 == E(a, e.parentNode).indexOf(e) && b.push(e)
				}
				return this.setupOld(E(d(b)))
			},
			data: function(a, b) {
				return this.attr("data-" + a, b)
			},
			end: function() {
				return this.oldElement != u ? this.oldElement: E()
			},
			clone: function(a) {
				if (a = a === !1 ? !1 : !0, 0 == this.length) return this;
				for (var b = [], c = 0; c < this.length; c++) b.push(this[c].cloneNode(a));
				return E(b)
			},
			size: function() {
				return this.length
			},
			serialize: function() {
				if (0 == this.length) return "";
				for (var a = [], b = 0; b < this.length; b++) this.slice.call(this[b].elements).forEach(function(b) {
					var c = b.getAttribute("type");
					if ("fieldset" != b.nodeName.toLowerCase() && !b.disabled && "submit" != c && "reset" != c && "button" != c && ("radio" != c && "checkbox" != c || b.checked) && b.getAttribute("name")) if ("select-multiple" == b.type) for (var d = 0; d < b.options.length; d++) b.options[d].selected && a.push(b.getAttribute("name") + "=" + encodeURIComponent(b.options[d].value));
					else a.push(b.getAttribute("name") + "=" + encodeURIComponent(b.value))
				});
				return a.join("&")
			},
			eq: function(a) {
				return E(this.get(a))
			},
			index: function(a) {
				return a ? this.indexOf(E(a)[0]) : this.parent().children().indexOf(this[0])
			},
			is: function(a) {
				return !! a && this.filter(a).length > 0
			}
		},
		E.ajaxSettings = {
			type: "GET",
			beforeSend: i,
			success: i,
			error: i,
			complete: i,
			context: u,
			timeout: 0,
			crossDomain: null
		},
		E.jsonP = function(b) {
			var c, d = "jsonp_callback" + ++z,
			e = "",
			f = v.createElement("script");
			return a[d] = function(g) {
				clearTimeout(e),
				E(f).remove(),
				delete a[d],
				b.success.call(c, g)
			},
			f.src = b.url.replace(/=\?/, "=" + d),
			b.error && (f.onerror = function() {
				clearTimeout(e),
				b.error.call(c, "", "error")
			}),
			E("head").append(f),
			b.timeout > 0 && (e = setTimeout(function() {
				b.error.call(c, "", "timeout")
			},
			b.timeout)),
			{}
		},
		E.ajax = function(b) {
			var c;
			try {
				var d = b || {};
				for (var e in E.ajaxSettings)"undefined" == typeof d[e] && (d[e] = E.ajaxSettings[e]);
				if (d.url || (d.url = a.location), d.contentType || (d.contentType = "application/x-www-form-urlencoded"), d.headers || (d.headers = {}), "async" in d && d.async === !1 || (d.async = !0), d.dataType) switch (d.dataType) {
				case "script":
					d.dataType = "text/javascript, application/javascript";
					break;
				case "json":
					d.dataType = "application/json";
					break;
				case "xml":
					d.dataType = "application/xml, text/xml";
					break;
				case "html":
					d.dataType = "text/html";
					break;
				case "text":
					d.dataType = "text/plain";
					break;
				default:
					d.dataType = "text/html";
					break;
				case "jsonp":
					return E.jsonP(b)
				} else d.dataType = "text/html";
				if (E.isObject(d.data) && (d.data = E.param(d.data)), "get" === d.type.toLowerCase() && d.data && (d.url += -1 === d.url.indexOf("?") ? "?" + d.data: "&" + d.data), /=\?/.test(d.url)) return E.jsonP(d);
				null === d.crossDomain && (d.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(d.url) && RegExp.$2 != a.location.host),
				d.crossDomain || (d.headers = E.extend({
					"X-Requested-With": "XMLHttpRequest"
				},
				d.headers));
				var f, g = d.context,
				h = /^([\w-]+:)\/\//.test(d.url) ? RegExp.$1: a.location.protocol;
				c = new a.XMLHttpRequest,
				c.onreadystatechange = function() {
					var a = d.dataType;
					if (4 === c.readyState) {
						clearTimeout(f);
						var b, e = !1;
						if (c.status >= 200 && c.status < 300 || 0 === c.status && "file:" == h) {
							if ("application/json" !== a || /^\s*$/.test(c.responseText))"application/xml, text/xml" === a ? b = c.responseXML: "text/html" == a ? (b = c.responseText, E.parseJS(b)) : b = c.responseText;
							else try {
								b = JSON.parse(c.responseText)
							} catch(i) {
								e = i
							}
							0 === c.status && 0 === b.length && (e = !0),
							e ? d.error.call(g, c, "parsererror", e) : d.success.call(g, b, "success", c)
						} else e = !0,
						d.error.call(g, c, "error");
						d.complete.call(g, c, e ? "error": "success")
					}
				},
				c.open(d.type, d.url, d.async),
				d.withCredentials && (c.withCredentials = !0),
				d.contentType && (d.headers["Content-Type"] = d.contentType);
				for (var j in d.headers) c.setRequestHeader(j, d.headers[j]);
				if (d.beforeSend.call(g, c, d) === !1) return c.abort(),
				!1;
				d.timeout > 0 && (f = setTimeout(function() {
					c.onreadystatechange = i,
					c.abort(),
					d.error.call(g, c, "timeout")
				},
				d.timeout)),
				c.send(d.data)
			} catch(k) {
				console.log(k),
				d.error.call(g, c, "error", k)
			}
			return c
		},
		E.get = function(a, b) {
			return this.ajax({
				url: a,
				success: b
			})
		},
		E.post = function(a, b, c, d) {
			return "function" == typeof b && (c = b, b = {}),
			d === u && (d = "html"),
			this.ajax({
				url: a,
				type: "POST",
				data: b,
				dataType: d,
				success: c
			})
		},
		E.getJSON = function(a, b, c) {
			return "function" == typeof b && (c = b, b = {}),
			this.ajax({
				url: a,
				data: b,
				success: c,
				dataType: "json"
			})
		},
		E.param = function(a, b) {
			var c = [];
			if (a instanceof D) a.each(function() {
				var a = b ? b + "[]": this.id,
				d = this.value;
				c.push(a + "=" + encodeURIComponent(d))
			});
			else for (var d in a) {
				var e = b ? b + "[" + d + "]": d,
				f = a[d];
				c.push(E.isObject(f) ? E.param(f, e) : e + "=" + encodeURIComponent(f))
			}
			return c.join("&")
		},
		E.parseJSON = function(a) {
			return JSON.parse(a)
		},
		E.parseXML = function(a) {
			return (new DOMParser).parseFromString(a, "text/xml")
		},
		j(E, navigator.userAgent),
		E.__detectUA = j,
		"function" != typeof String.prototype.trim && (String.prototype.trim = function() {
			return this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, ""),
			this
		}),
		E.uuid = function() {
			var a = function() {
				return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
			};
			return a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a()
		},
		E.getCssMatrix = function(b) {
			if (b == u) return a.WebKitCSSMatrix || a.MSCSSMatrix || {
				a: 0,
				b: 0,
				c: 0,
				d: 0,
				e: 0,
				f: 0
			};
			try {
				if (a.WebKitCSSMatrix) return new WebKitCSSMatrix(a.getComputedStyle(b).webkitTransform);
				if (a.MSCSSMatrix) return new MSCSSMatrix(a.getComputedStyle(b).transform);
				var c = a.getComputedStyle(b)[E.feat.cssPrefix + "Transform"].replace(/[^0-9\-.,]/g, "").split(",");
				return {
					a: +c[0],
					b: +c[1],
					c: +c[2],
					d: +c[3],
					e: +c[4],
					f: +c[5]
				}
			} catch(d) {
				return {
					a: 0,
					b: 0,
					c: 0,
					d: 0,
					e: 0,
					f: 0
				}
			}
		};
		var F = {},
		G = 1;
		E.event = {
			add: p,
			remove: q
		},
		E.fn.bind = function(a, b) {
			for (var c = 0; c < this.length; c++) p(this[c], a, b);
			return this
		},
		E.fn.unbind = function(a, b) {
			for (var c = 0; c < this.length; c++) q(this[c], a, b);
			return this
		},
		E.fn.one = function(a, b) {
			return this.each(function(c, d) {
				p(this, a, b, null,
				function(a, b) {
					return function() {
						var c = a.apply(d, arguments);
						return q(d, b, a),
						c
					}
				})
			})
		};
		var H = function() {
			return ! 0
		},
		I = function() {
			return ! 1
		},
		J = {
			preventDefault: "isDefaultPrevented",
			stopImmediatePropagation: "isImmediatePropagationStopped",
			stopPropagation: "isPropagationStopped"
		};
		E.fn.delegate = function(a, b, c) {
			for (var d = 0; d < this.length; d++) {
				var e = this[d];
				p(e, b, c, a,
				function(b) {
					return function(c) {
						var d, f = E(c.target).closest(a, e).get(0);
						return f ? (d = E.extend(r(c), {
							currentTarget: f,
							liveFired: e
						}), b.apply(f, [d].concat([].slice.call(arguments, 1)))) : void 0
					}
				})
			}
			return this
		},
		E.fn.undelegate = function(a, b, c) {
			for (var d = 0; d < this.length; d++) q(this[d], b, c, a);
			return this
		},
		E.fn.on = function(a, b, c) {
			return b === u || E.isFunction(b) ? this.bind(a, b) : this.delegate(b, a, c)
		},
		E.fn.off = function(a, b, c) {
			return b === u || E.isFunction(b) ? this.unbind(a, b) : this.undelegate(b, a, c)
		},
		E.fn.trigger = function(a, b, c) {
			"string" == typeof a && (a = E.Event(a, c)),
			a.data = b;
			for (var d = 0; d < this.length; d++) this[d].dispatchEvent(a);
			return this
		},
		E.Event = function(a, b) {
			var c = v.createEvent("Events"),
			d = !0;
			if (b) for (var e in b)"bubbles" == e ? d = !!b[e] : c[e] = b[e];
			return c.initEvent(a, d, !0, null, null, null, null, null, null, null, null, null, null, null, null),
			c
		},
		E.bind = function(a, b, c) {
			a.__events || (a.__events = {}),
			E.isArray(b) || (b = [b]);
			for (var d = 0; d < b.length; d++) a.__events[b[d]] || (a.__events[b[d]] = []),
			a.__events[b[d]].push(c)
		},
		E.trigger = function(a, b, c) {
			var d = !0;
			if (!a.__events) return d;
			E.isArray(b) || (b = [b]),
			E.isArray(c) || (c = [c]);
			for (var e = 0; e < b.length; e++) if (a.__events[b[e]]) for (var f = a.__events[b[e]], g = 0; g < f.length; g++) E.isFunction(f[g]) && f[g].apply(a, c) === !1 && (d = !1);
			return d
		},
		E.unbind = function(a, b, c) {
			if (a.__events) {
				E.isArray(b) || (b = [b]);
				for (var d = 0; d < b.length; d++) if (a.__events[b[d]]) for (var e = a.__events[b[d]], f = 0; f < e.length; f++) if (c == u && delete e[f], e[f] == c) {
					e.splice(f, 1);
					break
				}
			}
		},
		E.proxy = function(a, b, c) {
			return function() {
				return c ? a.apply(b, c) : a.apply(b, arguments)
			}
		};
		var K = function(a, b) {
			for (var c = 0; c < a.length; c++) t(a[c], b)
		};
		E.cleanUpContent = function(a, b, c) {
			if (a) {
				var d = a.childNodes;
				d && d.length > 0 && E.asap(K, {},
				[x.apply(d, [0]), c]),
				b && s(a, c)
			}
		};
		var L = [],
		M = [],
		N = [];
		E.asap = function(b, c, d) {
			if (!E.isFunction(b)) throw "$.asap - argument is not a valid function";
			L.push(b),
			M.push(c ? c: {}),
			N.push(d ? d: []),
			a.postMessage("jqm-asap", "*")
		},
		a.addEventListener("message",
		function(b) {
			b.source == a && "jqm-asap" == b.data && (b.stopPropagation(), L.length > 0 && L.shift().apply(M.shift(), N.shift()))
		},
		!0);
		var O = {};
		return E.parseJS = function(b) {
			if (b) {
				if ("string" == typeof b) {
					var c = v.createElement("div");
					c.innerHTML = b,
					b = c
				}
				var d = b.getElementsByTagName("script");
				b = null;
				for (var e = 0; e < d.length; e++) if (d[e].src.length > 0 && !O[d[e].src]) {
					var f = v.createElement("script");
					f.type = d[e].type,
					f.src = d[e].src,
					v.getElementsByTagName("head")[0].appendChild(f),
					O[d[e].src] = 1,
					f = null
				} else a.eval(d[e].innerHTML)
			}
		},
		["click", "keydown", "keyup", "keypress", "submit", "load", "resize", "change", "select", "error"].forEach(function(a) {
			E.fn[a] = function(b) {
				return b ? this.bind(a, b) : this.trigger(a)
			}
		}),
		E
	} (window);
	"$" in window || (window.$ = jq),
	window.numOnly || (window.numOnly = function(a) {
		if (void 0 === a || "" === a) return 0;
		if (isNaN(parseFloat(a))) {
			if (!a.replace) return 0;
			a = a.replace(/[^0-9.-]/, "")
		}
		return parseFloat(a)
	})
} !
function(a) {
	var b = [],
	c = function(b) {
		return b.jqmCSS3AnimateId || (b.jqmCSS3AnimateId = a.uuid()),
		b.jqmCSS3AnimateId
	},
	d = function(b) {
		return "string" == typeof b || b instanceof String ? document.getElementById(b) : a.is$(b) ? b[0] : b
	},
	e = function(a, e) {
		var f, g, h = d(a);
		return g = c(h),
		b[g] ? (b[g].animate(e), f = b[g]) : (f = i(h, e), b[g] = f),
		f
	};
	a.fn.css3Animate = function(a) { ! a.complete && a.callback && (a.complete = a.callback);
		var b = e(this[0], a);
		a.complete = null,
		a.sucess = null,
		a.failure = null;
		for (var c = 1; c < this.length; c++) b.link(this[c], a);
		return b
	},
	a.css3AnimateQueue = function() {
		return new i.queue
	};
	var f = a.feat.cssTransformStart,
	g = a.feat.cssTransformEnd,
	h = a.feat.cssPrefix.replace(/-/g, "") + "TransitionEnd";
	h = a.os.fennec || "" == a.feat.cssPrefix || a.os.ie ? "transitionend": h,
	h = h.replace(h.charAt(0), h.charAt(0).toLowerCase());
	var i = function() {
		var c = function(d, e) {
			if (! (this instanceof c)) return new c(d, e);
			if (this.callbacksStack = [], this.activeEvent = null, this.countStack = 0, this.isActive = !1, this.el = d, this.linkFinishedProxy_ = a.proxy(this.linkFinished, this), this.el) {
				this.animate(e);
				var f = this;
				jq(this.el).bind("destroy",
				function() {
					var a = f.el.jqmCSS3AnimateId;
					f.callbacksStack = [],
					b[a] && delete b[a]
				})
			}
		};
		return c.prototype = {
			animate: function(b) {
				if (this.isActive && this.cancel(), this.isActive = !0, !b) return void alert("Please provide configuration options for animation of " + this.el.id);
				var c = !!b.addClass;
				if (c) b.removeClass ? jq(this.el).replaceClass(b.removeClass, b.addClass) : jq(this.el).addClass(b.addClass);
				else {
					var d = numOnly(b.time);
					if (0 == d && (b.time = 0), b.y || (b.y = 0), b.x || (b.x = 0), b.previous) {
						var e = new a.getCssMatrix(this.el);
						b.y += numOnly(e.f),
						b.x += numOnly(e.e)
					}
					b.origin || (b.origin = "0% 0%"),
					b.scale || (b.scale = "1"),
					b.rotateY || (b.rotateY = "0"),
					b.rotateX || (b.rotateX = "0"),
					b.skewY || (b.skewY = "0"),
					b.skewX || (b.skewX = "0"),
					b.timingFunction || (b.timingFunction = "linear"),
					("number" == typeof b.x || -1 == b.x.indexOf("%") && -1 == b.x.toLowerCase().indexOf("px") && -1 == b.x.toLowerCase().indexOf("deg")) && (b.x = parseInt(b.x) + "px"),
					("number" == typeof b.y || -1 == b.y.indexOf("%") && -1 == b.y.toLowerCase().indexOf("px") && -1 == b.y.toLowerCase().indexOf("deg")) && (b.y = parseInt(b.y) + "px");
					var i = "translate" + f + b.x + "," + b.y + g + " scale(" + parseFloat(b.scale) + ") rotate(" + b.rotateX + ")";
					a.os.opera || (i += " rotateY(" + b.rotateY + ")"),
					i += " skew(" + b.skewX + "," + b.skewY + ")",
					this.el.style[a.feat.cssPrefix + "Transform"] = i,
					this.el.style[a.feat.cssPrefix + "BackfaceVisibility"] = "hidden";
					var j = a.feat.cssPrefix + "Transform";
					if (void 0 !== b.opacity && (this.el.style.opacity = b.opacity, j += ", opacity"), b.width && (this.el.style.width = b.width, j = "all"), b.height && (this.el.style.height = b.height, j = "all"), this.el.style[a.feat.cssPrefix + "TransitionProperty"] = "all", -1 === ("" + b.time).indexOf("s")) var k = "ms",
					l = b.time + k;
					else if ( - 1 !== b.time.indexOf("ms")) var k = "ms",
					l = b.time;
					else var k = "s",
					l = b.time + k;
					this.el.style[a.feat.cssPrefix + "TransitionDuration"] = l,
					this.el.style[a.feat.cssPrefix + "TransitionTimingFunction"] = b.timingFunction,
					this.el.style[a.feat.cssPrefix + "TransformOrigin"] = b.origin
				}
				this.callbacksStack.push({
					complete: b.complete,
					success: b.success,
					failure: b.failure
				}),
				this.countStack++;
				var m = this,
				n = window.getComputedStyle(this.el);
				if (c) {
					var o = n[a.feat.cssPrefix + "TransitionDuration"],
					d = numOnly(o);
					b.time = d,
					-1 !== o.indexOf("ms") ? k = "ms": (b.time *= 1e3, k = "s")
				}
				if (0 == d || "ms" == k && 5 > d || "none" == n.display) a.asap(a.proxy(this.finishAnimation, this, [!1]));
				else {
					var m = this;
					this.activeEvent = function(a) {
						clearTimeout(m.timeout),
						m.finishAnimation(a),
						m.el.removeEventListener(h, m.activeEvent, !1)
					},
					m.timeout = setTimeout(this.activeEvent, numOnly(b.time) + 50),
					this.el.addEventListener(h, this.activeEvent, !1)
				}
			},
			addCallbackHook: function(a) {
				return a && this.callbacksStack.push(a),
				this.countStack++,
				this.linkFinishedProxy_
			},
			linkFinished: function(a) {
				a ? this.cancel() : this.finishAnimation()
			},
			finishAnimation: function(a) {
				a && a.preventDefault(),
				this.isActive && (this.countStack--, 0 == this.countStack && this.fireCallbacks(!1))
			},
			fireCallbacks: function(a) {
				this.clearEvents();
				var b = this.callbacksStack;
				this.cleanup();
				for (var c = 0; c < b.length; c++) {
					var d = b[c].complete,
					e = b[c].success,
					f = b[c].failure;
					d && "function" == typeof d && d(a),
					a && f && "function" == typeof f ? f() : e && "function" == typeof e && e()
				}
			},
			cancel: function() {
				this.isActive && this.fireCallbacks(!0)
			},
			cleanup: function() {
				this.callbacksStack = [],
				this.isActive = !1,
				this.countStack = 0
			},
			clearEvents: function() {
				this.activeEvent && this.el.removeEventListener(h, this.activeEvent, !1),
				this.activeEvent = null
			},
			link: function(a, b) {
				var c = {
					complete: b.complete,
					success: b.success,
					failure: b.failure
				};
				return b.complete = this.addCallbackHook(c),
				b.success = null,
				b.failure = null,
				e(a, b),
				b.complete = c.complete,
				b.success = c.success,
				b.failure = c.failure,
				this
			}
		},
		c
	} ();
	i.queue = function() {
		return {
			elements: [],
			push: function(a) {
				this.elements.push(a)
			},
			pop: function() {
				return this.elements.pop()
			},
			run: function() {
				var a = this;
				if (0 != this.elements.length) {
					if ("function" == typeof this.elements[0]) {
						var b = this.shift();
						b()
					}
					if (0 != this.elements.length) {
						var c = this.shift();
						this.elements.length > 0 && (c.complete = function(b) {
							b || a.run()
						}),
						i(document.getElementById(c.id), c)
					}
				}
			},
			shift: function() {
				return this.elements.shift()
			}
		}
	}
} (jq),
function(a) {
	a.fn.popup = function(a) {
		return new c(this[0], a)
	};
	var b = [],
	c = function() {
		var c = function(c, d) {
			if (this.container = "string" == typeof c || c instanceof String ? document.getElementById(c) : c, !this.container) return void alert("Error finding container for popup " + c);
			try { ("string" == typeof d || "number" == typeof d) && (d = {
					message: d,
					cancelOnly: "true",
					cancelText: "OK"
				}),
				this.id = id = d.id = d.id || a.uuid();
				this.title = d.suppressTitle ? "": d.title || "Alert",
				this.message = d.message || "",
				this.cancelText = d.cancelText || "Cancel",
				this.cancelCallback = d.cancelCallback ||
				function() {},
				this.cancelClass = d.cancelClass || "button",
				this.doneText = d.doneText || "Done",
				this.doneCallback = d.doneCallback ||
				function() {},
				this.doneClass = d.doneClass || "button",
				this.cancelOnly = d.cancelOnly || !1,
				this.onShow = d.onShow ||
				function() {},
				this.autoCloseDone = void 0 !== d.autoCloseDone ? d.autoCloseDone: !0,
				b.push(this),
				1 == b.length && this.show()
			} catch(e) {
				console.log("error adding popup " + e)
			}
		};
		return c.prototype = {
			id: null,
			title: null,
			message: null,
			cancelText: null,
			cancelCallback: null,
			cancelClass: null,
			doneText: null,
			doneCallback: null,
			doneClass: null,
			cancelOnly: !1,
			onShow: null,
			autoCloseDone: !0,
			supressTitle: !1,
			show: function() {
				var b = this,
				c = '<div id="' + this.id + '" class="popup">	        				<h3>' + this.title + "</h3>	        				<div>" + this.message + '</div>						<p style="text-align:center;margin-top:5px;"><input type="button" class="btn long-btn cancel-btn" id="cancel" value="' + this.cancelText + '">						<input type="button" class="btn" id="action" value="' + this.doneText + '"></p>	        			</div>';
				a(this.container).append(a(c));
				var d = a("#" + this.id);
				d.bind("close",
				function() {
					b.hide()
				}),
				this.cancelOnly && (d.find("h3").hide(), d.find("#action").hide(), d.find("#cancel").addClass("center")),
				d.find('input[type="button"]').each(function() {
					var c = a(this);
					c.bind("click",
					function(a) {
						"cancel" == c.attr("id") ? (b.cancelCallback.call(b.cancelCallback, b), b.hide()) : (b.doneCallback.call(b.doneCallback, b), b.autoCloseDone && b.hide()),
						a.preventDefault()
					})
				}),
				d.show(),
				b.positionPopup(),
				a.blockUI(.5),
				d.bind("orientationchange",
				function() {
					b.positionPopup()
				}),
				this.onShow(this)
			},
			hide: function() {
				var b = this;
				a("#" + b.id).hide(),
				a.unblockUI(),
				setTimeout(function() {
					b.remove()
				},
				250)
			},
			remove: function() {
				var c = this,
				d = a("#" + c.id);
				d.unbind("close"),
				d.find("BUTTON#action").unbind("click"),
				d.find("BUTTON#cancel").unbind("click"),
				d.unbind("orientationchange").remove(),
				b.splice(0, 1),
				b.length > 0 && b[0].show()
			},
			positionPopup: function() {
				var b = a("#" + this.id);
				b.css("top", window.innerHeight / 2.5 - b[0].clientHeight / 2 + "px"),
				b.css("left", window.innerWidth / 2 - b[0].clientWidth / 2 + "px")
			}
		},
		c
	} (),
	d = !1;
	a.blockUI = function(b) {
		d || (b = b ? " style='opacity:" + b + ";'": "", a("BODY").prepend(a("<div class='pageCover' id='mask'" + b + "></div>")), a("BODY DIV#mask").bind("touchstart",
		function(a) {
			a.preventDefault()
		}), a("BODY DIV#mask").bind("touchmove",
		function(a) {
			a.preventDefault()
		}), a("BODY DIV#mask").show(), d = !0)
	},
	a.unblockUI = function() {
		d = !1,
		a("BODY DIV#mask").unbind("touchstart"),
		a("BODY DIV#mask").unbind("touchmove"),
		a("BODY DIV#mask").remove()
	},
	window.alert = function(b) { (null === b || void 0 === b) && (b = "null"),
		a("#jQUi").length > 0 ? a("#jQUi").popup(b.toString()) : a(document.body).popup({
			title: "提示消息:",
			message: b.toString(),
			cancelText: "确认",
			cancelOnly: !0
		})
	},
	window.alertEx = function(b, c) {
		a(document.body).popup({
			title: "提示消息:",
			message: b.toString(),
			cancelText: "确认",
			cancelOnly: !0,
			cancelCallback: c
		})
	}
} (jq),
function(a) {
	a.template = function(a, c) {
		return b(a, c)
	},
	a.tmpl = function(c, d) {
		return a(b(c, d))
	};
	var b = function(a, b) {
		return b || (b = {}),
		tmpl(a, b)
	}; !
	function() {
		var a = {};
		this.tmpl = function b(c, d) {
			var e = /\W/.test(c) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + c.replace(/[\r\t\n]/g, " ").replace(/'(?=[^%]*%>)/g, "	").split("'").join("\\'").split("	").join("'").replace(/<%=(.+?)%>/g, "',$1,'").split("<%").join("');").split("%>").join("p.push('") + "');}return p.join('');") : a[c] = a[c] || b(document.getElementById(c).innerHTML);
			return d ? e(d) : e
		}
	} ()
} (jq),
function(a) {
	var b = [];
	a.fn.range = function(d) {
		if (0 != this.length) {
			if (void 0 === d) return b[this[0].jqid];
			for (var e = 0; e < this.length; e++) this[e].jqid || (this[e].jqid = a.uuid()),
			b[this[e].jqid] = new c(this[e], d)
		}
	};
	var c = function(b, c) {
		this.elem = b,
		this.pointer = a("<div class='" + this.pointerClass + "'></div>").get(),
		this.range = a("<div class='" + this.rangeClass + "'></div>").get(),
		this.rangeFill = a("<div class='" + this.rangeFillClass + "'></div>").get(),
		this.bubble = a("<div class='" + this.bubbleClass + "'></div>").get(),
		this.pointer.style.webkitTransitionDuration = "0ms",
		this.elem.appendChild(this.pointer),
		this.elem.appendChild(this.range),
		this.elem.appendChild(this.rangeFill),
		this.elem.appendChild(this.bubble),
		"static" === this.elem.style.position && (this.elem.style.position = "relative");
		for (var d in c) this[d] = c[d];
		c.value && this.val(c.value),
		this.elem.addEventListener("touchstart", this)
	};
	c.prototype = {
		min: 1,
		max: 100,
		value: 0,
		rangeClass: "range",
		pointerClass: "pointer",
		sliderClass: "slider",
		rangeFillClass: "rangefill",
		bubbleClass: "rangeBubble",
		stepFunc: function() {},
		handleEvent: function(a) {
			switch (a.type) {
			case "touchstart":
				this.onTouchStart(a);
				break;
			case "touchmove":
				this.onTouchMove(a);
				break;
			case "touchend":
				this.onTouchEnd(a)
			}
		},
		onTouchStart: function() {
			this.elem.addEventListener("touchmove", this),
			this.elem.addEventListener("touchend", this)
		},
		onTouchMove: function(b) {
			b.preventDefault();
			var c, d = b.touches[0].pageX,
			e = this.pointer.offsetWidth,
			f = this.range.offsetWidth,
			g = f - e,
			h = this.max - this.min;
			d -= a(this.elem).offset().left,
			d += e / 2,
			d = Math.min(d, f),
			d = Math.max(d - e, 0),
			this.bubble.style.webkitTransform = this.pointer.style.webkitTransform = "translate3d(" + d + "px,0,0)",
			c = this.min + Math.round(d * h / g),
			this.val(c, d)
		},
		onTouchEnd: function() {
			this.elem.removeEventListener("touchmove", this, !0),
			this.elem.removeEventListener("touchend", this, !0)
		},
		val: function(a, b) {
			if (void 0 === a) return this.value;
			if (a = Math.min(a, this.max), a = Math.max(a, this.min), void 0 === b) {
				var c = this.pointer.offsetWidth,
				d = this.range.offsetWidth,
				e = this.max - this.min,
				f = d - c,
				b = Math.round((a - this.min) * f / e);
				this.bubble.style.webkitTransform = this.pointer.style.webkitTransform = "translate3d(" + b + "px,0,0)"
			}
			this.rangeFill.style.width = b + "px",
			this.bubble.innerHTML = a,
			this.value = a,
			this.stepFunc(a)
		}
	}
} (jq),
function(a) {
	a.cookie = function(b, c, d) {
		if ("undefined" == typeof c) {
			var e = null;
			if (document.cookie && "" !== document.cookie) for (var f = document.cookie.split(";"), g = 0; g < f.length; g++) {
				var h = f[g].trim();
				if (h.substring(0, b.length + 1) == b + "=") {
					e = decodeURIComponent(h.substring(b.length + 1));
					break
				}
			}
			return e
		}
		d = d || {},
		null === c && (c = "", d = a.extend({},
		d), d.expires = -1);
		var i = "";
		if (d.expires && ("number" == typeof d.expires || d.expires.toUTCString)) {
			var j;
			"number" == typeof d.expires ? (j = new Date, j.setTime(j.getTime() + 24 * d.expires * 60 * 60 * 1e3)) : j = d.expires,
			i = "; expires=" + j.toUTCString()
		}
		var k = d.path ? "; path=" + d.path: "",
		l = d.domain ? "; domain=" + d.domain: "",
		m = d.secure ? "; secure": "";
		document.cookie = [b, "=", encodeURIComponent(c), i, k, l, m].join("")
	}
} (jq),
window.localStorage || Object.defineProperty(window, "localStorage", new
function() {
	var a = [],
	b = {};
	Object.defineProperty(b, "getItem", {
		value: function(a) {
			return a ? this[a] : null
		},
		writable: !1,
		configurable: !1,
		enumerable: !1
	}),
	Object.defineProperty(b, "key", {
		value: function(b) {
			return a[b]
		},
		writable: !1,
		configurable: !1,
		enumerable: !1
	}),
	Object.defineProperty(b, "setItem", {
		value: function(a, b) {
			a && (document.cookie = escape(a) + "=" + escape(b) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/")
		},
		writable: !1,
		configurable: !1,
		enumerable: !1
	}),
	Object.defineProperty(b, "length", {
		get: function() {
			return a.length
		},
		configurable: !1,
		enumerable: !1
	}),
	Object.defineProperty(b, "removeItem", {
		value: function(a) {
			a && (document.cookie = escape(a) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/")
		},
		writable: !1,
		configurable: !1,
		enumerable: !1
	}),
	this.get = function() {
		var c;
		for (var d in b) c = a.indexOf(d),
		-1 === c ? b.setItem(d, b[d]) : a.splice(c, 1),
		delete b[d];
		for (a; a.length > 0; a.splice(0, 1)) b.removeItem(a[0]);
		for (var e, f, g = 0,
		h = document.cookie.split(/\s*;\s*/); g < h.length; g++) e = h[g].split(/\s*=\s*/),
		e.length > 1 && (b[f = unescape(e[0])] = unescape(e[1]), a.push(f));
		return b
	},
	this.configurable = !1,
	this.enumerable = !0
});
var LONG_QUESTION_LENGTH = 30,
EVAL_TOP = 0,
EVAL_EMBED = 1;
SpriteTips.prototype = {
	isShown: function() {
		return this.shown
	},
	getData: function(a) {
		if ("" === a) return void this.checkHistory(a);
		this.cur_ques = a,
		this.reset();
		var b = this,
		c = "http://tip.chatbot.nie.163.com/cgi-bin/good_evaluate_question_tip_py?prefix=" + encodeURIComponent(a) + "&max_num=5&game=" + this.gameid + "&callback=?";
		$.ajax({
			type: "get",
			url: c,
			dataType: "jsonp",
			success: function(a) {
				if (a.success) {
					$("#" + b.tips_id + " ul").html("");
					for (var c in a.data) {
						var d = "·" + a.data[c];
						$("#" + b.tips_id + " ul").append($("<li>" + d + "</li>").click(function() {
							b.hideTips(),
							$("#" + b.ques_id).val($(this).text()),
							ask()
						}))
					}
					b.showTips()
				} else b.hideTips()
			}
		})
	},
	checkHistory: function(a) {
		var b = this;
		if ("" === a) {
			sqh = new SpriteQuestionHistory;
			var c = sqh.get();
			if (!c) return;
			$("#" + b.tips_id + " ul").html("");
			for (var d = c.length - 1; d >= 0; d--) {
				var a = c[d];
				"·" != a[0] && (a = "·" + a),
				$("#" + b.tips_id + " ul").append($("<li>" + $("<div></div>").text(a).html() + "</li>").click(function() {
					b.hideTips(),
					$("#" + b.ques_id).val($(this).text()),
					ask()
				}))
			}
			return void b.showTips()
		}
	},
	hideTips: function() {
		this.shown = !1,
		$("#" + this.tips_id).hide()
	},
	showTips: function() {
		if (this.shown = !0, $("#" + this.tips_id).show(), this.from_submit) {
			var a = $("#" + this.target_id).offset();
			$("#" + this.tips_id).offset({
				top: a.top + $("#" + this.target_id).height() + 5,
				left: a.left
			}),
			$("#" + this.tips_id).width($("#" + this.target_id).width())
		}
	},
	reset: function() {
		this.cur_index = -1,
		this.shown = !1,
		this.seleted = !1,
		$("#" + this.tips_id)[0].scrollTop = 0,
		this.hideTips()
	}
},
function(a, b) {
	function c(a) {
		return "" === f ? a: (a = a.charAt(0).toUpperCase() + a.substr(1), f + a)
	}
	var d = Math,
	e = b.createElement("div").style,
	f = function() {
		for (var a, b = "t,webkitT,MozT,msT,OT".split(","), c = 0, d = b.length; d > c; c++) if (a = b[c] + "ransform", a in e) return b[c].substr(0, b[c].length - 1);
		return ! 1
	} (),
	g = f ? "-" + f.toLowerCase() + "-": "",
	h = c("transform"),
	i = c("transitionProperty"),
	j = c("transitionDuration"),
	k = c("transformOrigin"),
	l = c("transitionTimingFunction"),
	m = c("transitionDelay"),
	n = /android/gi.test(navigator.appVersion),
	o = /iphone|ipad/gi.test(navigator.appVersion),
	p = /hp-tablet/gi.test(navigator.appVersion),
	q = c("perspective") in e,
	r = "ontouchstart" in a && !p,
	s = f !== !1,
	t = c("transition") in e,
	u = "onorientationchange" in a ? "orientationchange": "resize",
	v = r ? "touchstart": "mousedown",
	w = r ? "touchmove": "mousemove",
	x = r ? "touchend": "mouseup",
	y = r ? "touchcancel": "mouseup",
	z = function() {
		if (f === !1) return ! 1;
		var a = {
			"": "transitionend",
			webkit: "webkitTransitionEnd",
			Moz: "transitionend",
			O: "otransitionend",
			ms: "MSTransitionEnd"
		};
		return a[f]
	} (),
	A = function() {
		return a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame ||
		function(a) {
			return setTimeout(a, 1)
		}
	} (),
	B = function() {
		return a.cancelRequestAnimationFrame || a.webkitCancelAnimationFrame || a.webkitCancelRequestAnimationFrame || a.mozCancelRequestAnimationFrame || a.oCancelRequestAnimationFrame || a.msCancelRequestAnimationFrame || clearTimeout
	} (),
	C = q ? " translateZ(0)": "",
	D = function(c, d) {
		var e, f = this;
		f.wrapper = "object" == typeof c ? c: b.getElementById(c),
		f.wrapper.style.overflow = "hidden",
		f.scroller = f.wrapper.children[0],
		f.options = {
			hScroll: !0,
			vScroll: !0,
			x: 0,
			y: 0,
			bounce: !0,
			bounceLock: !1,
			momentum: !0,
			lockDirection: !0,
			useTransform: !0,
			useTransition: !1,
			topOffset: 0,
			checkDOMChanges: !1,
			handleClick: !0,
			hScrollbar: !0,
			vScrollbar: !0,
			fixedScrollbar: n,
			hideScrollbar: o,
			fadeScrollbar: o && q,
			scrollbarClass: "",
			zoom: !1,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: "scroll",
			snap: !1,
			snapThreshold: 1,
			onRefresh: null,
			onBeforeScrollStart: function(a) {
				a.preventDefault()
			},
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null
		};
		for (e in d) f.options[e] = d[e];
		f.x = f.options.x,
		f.y = f.options.y,
		f.options.useTransform = s && f.options.useTransform,
		f.options.hScrollbar = f.options.hScroll && f.options.hScrollbar,
		f.options.vScrollbar = f.options.vScroll && f.options.vScrollbar,
		f.options.zoom = f.options.useTransform && f.options.zoom,
		f.options.useTransition = t && f.options.useTransition,
		f.options.zoom && n && (C = ""),
		f.scroller.style[i] = f.options.useTransform ? g + "transform": "top left",
		f.scroller.style[j] = "0",
		f.scroller.style[k] = "0 0",
		f.options.useTransition && (f.scroller.style[l] = "cubic-bezier(0.33,0.66,0.66,1)"),
		f.options.useTransform ? f.scroller.style[h] = "translate(" + f.x + "px," + f.y + "px)" + C: f.scroller.style.cssText += ";position:absolute;top:" + f.y + "px;left:" + f.x + "px",
		f.options.useTransition && (f.options.fixedScrollbar = !0),
		f.refresh(),
		f._bind(u, a),
		f._bind(v),
		r || "none" != f.options.wheelAction && (f._bind("DOMMouseScroll"), f._bind("mousewheel")),
		f.options.checkDOMChanges && (f.checkDOMTime = setInterval(function() {
			f._checkDOMChanges()
		},
		500))
	};
	D.prototype = {
		enabled: !0,
		x: 0,
		y: 0,
		steps: [],
		scale: 1,
		currPageX: 0,
		currPageY: 0,
		pagesX: [],
		pagesY: [],
		aniTime: null,
		wheelZoomCount: 0,
		handleEvent: function(a) {
			var b = this;
			switch (a.type) {
			case v:
				if (!r && 0 !== a.button) return;
				b._start(a);
				break;
			case w:
				b._move(a);
				break;
			case x:
			case y:
				b._end(a);
				break;
			case u:
				b._resize();
				break;
			case "DOMMouseScroll":
			case "mousewheel":
				b._wheel(a);
				break;
			case z:
				b._transitionEnd(a)
			}
		},
		_checkDOMChanges: function() {
			this.moved || this.zoomed || this.animating || this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale || this.refresh()
		},
		_scrollbar: function(a) {
			var c, e = this;
			return e[a + "Scrollbar"] ? (e[a + "ScrollbarWrapper"] || (c = b.createElement("div"), e.options.scrollbarClass ? c.className = e.options.scrollbarClass + a.toUpperCase() : c.style.cssText = "position:absolute;z-index:100;" + ("h" == a ? "height:7px;bottom:1px;left:2px;right:" + (e.vScrollbar ? "7": "2") + "px": "width:7px;bottom:" + (e.hScrollbar ? "7": "2") + "px;top:2px;right:1px"), c.style.cssText += ";pointer-events:none;" + g + "transition-property:opacity;" + g + "transition-duration:" + (e.options.fadeScrollbar ? "350ms": "0") + ";overflow:hidden;opacity:" + (e.options.hideScrollbar ? "0": "1"), e.wrapper.appendChild(c), e[a + "ScrollbarWrapper"] = c, c = b.createElement("div"), e.options.scrollbarClass || (c.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);" + g + "background-clip:padding-box;" + g + "box-sizing:border-box;" + ("h" == a ? "height:100%": "width:100%") + ";" + g + "border-radius:3px;border-radius:3px"), c.style.cssText += ";pointer-events:none;" + g + "transition-property:" + g + "transform;" + g + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);" + g + "transition-duration:0;" + g + "transform: translate(0,0)" + C, e.options.useTransition && (c.style.cssText += ";" + g + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"), e[a + "ScrollbarWrapper"].appendChild(c), e[a + "ScrollbarIndicator"] = c), "h" == a ? (e.hScrollbarSize = e.hScrollbarWrapper.clientWidth, e.hScrollbarIndicatorSize = d.max(d.round(e.hScrollbarSize * e.hScrollbarSize / e.scrollerW), 8), e.hScrollbarIndicator.style.width = e.hScrollbarIndicatorSize + "px", e.hScrollbarMaxScroll = e.hScrollbarSize - e.hScrollbarIndicatorSize, e.hScrollbarProp = e.hScrollbarMaxScroll / e.maxScrollX) : (e.vScrollbarSize = e.vScrollbarWrapper.clientHeight, e.vScrollbarIndicatorSize = d.max(d.round(e.vScrollbarSize * e.vScrollbarSize / e.scrollerH), 8), e.vScrollbarIndicator.style.height = e.vScrollbarIndicatorSize + "px", e.vScrollbarMaxScroll = e.vScrollbarSize - e.vScrollbarIndicatorSize, e.vScrollbarProp = e.vScrollbarMaxScroll / e.maxScrollY), void e._scrollbarPos(a, !0)) : void(e[a + "ScrollbarWrapper"] && (s && (e[a + "ScrollbarIndicator"].style[h] = ""), e[a + "ScrollbarWrapper"].parentNode.removeChild(e[a + "ScrollbarWrapper"]), e[a + "ScrollbarWrapper"] = null, e[a + "ScrollbarIndicator"] = null))
		},
		_resize: function() {
			var a = this;
			setTimeout(function() {
				a.refresh()
			},
			n ? 200 : 0)
		},
		_pos: function(a, b) {
			this.zoomed || (a = this.hScroll ? a: 0, b = this.vScroll ? b: 0, this.options.useTransform ? this.scroller.style[h] = "translate(" + a + "px," + b + "px) scale(" + this.scale + ")" + C: (a = d.round(a), b = d.round(b), this.scroller.style.left = a + "px", this.scroller.style.top = b + "px"), this.x = a, this.y = b, this._scrollbarPos("h"), this._scrollbarPos("v"))
		},
		_scrollbarPos: function(a, b) {
			var c, e = this,
			f = "h" == a ? e.x: e.y;
			e[a + "Scrollbar"] && (f = e[a + "ScrollbarProp"] * f, 0 > f ? (e.options.fixedScrollbar || (c = e[a + "ScrollbarIndicatorSize"] + d.round(3 * f), 8 > c && (c = 8), e[a + "ScrollbarIndicator"].style["h" == a ? "width": "height"] = c + "px"), f = 0) : f > e[a + "ScrollbarMaxScroll"] && (e.options.fixedScrollbar ? f = e[a + "ScrollbarMaxScroll"] : (c = e[a + "ScrollbarIndicatorSize"] - d.round(3 * (f - e[a + "ScrollbarMaxScroll"])), 8 > c && (c = 8), e[a + "ScrollbarIndicator"].style["h" == a ? "width": "height"] = c + "px", f = e[a + "ScrollbarMaxScroll"] + (e[a + "ScrollbarIndicatorSize"] - c))), e[a + "ScrollbarWrapper"].style[m] = "0", e[a + "ScrollbarWrapper"].style.opacity = b && e.options.hideScrollbar ? "0": "1", e[a + "ScrollbarIndicator"].style[h] = "translate(" + ("h" == a ? f + "px,0)": "0," + f + "px)") + C)
		},
		_start: function(b) {
			var c, e, f, g, i, j = this,
			k = r ? b.touches[0] : b;
			j.enabled && (j.options.onBeforeScrollStart && j.options.onBeforeScrollStart.call(j, b), (j.options.useTransition || j.options.zoom) && j._transitionTime(0), j.moved = !1, j.animating = !1, j.zoomed = !1, j.distX = 0, j.distY = 0, j.absDistX = 0, j.absDistY = 0, j.dirX = 0, j.dirY = 0, j.options.zoom && r && b.touches.length > 1 && (g = d.abs(b.touches[0].pageX - b.touches[1].pageX), i = d.abs(b.touches[0].pageY - b.touches[1].pageY), j.touchesDistStart = d.sqrt(g * g + i * i), j.originX = d.abs(b.touches[0].pageX + b.touches[1].pageX - 2 * j.wrapperOffsetLeft) / 2 - j.x, j.originY = d.abs(b.touches[0].pageY + b.touches[1].pageY - 2 * j.wrapperOffsetTop) / 2 - j.y, j.options.onZoomStart && j.options.onZoomStart.call(j, b)), j.options.momentum && (j.options.useTransform ? (c = getComputedStyle(j.scroller, null)[h].replace(/[^0-9\-.,]/g, "").split(","), e = +(c[12] || c[4]), f = +(c[13] || c[5])) : (e = +getComputedStyle(j.scroller, null).left.replace(/[^0-9-]/g, ""), f = +getComputedStyle(j.scroller, null).top.replace(/[^0-9-]/g, "")), (e != j.x || f != j.y) && (j.options.useTransition ? j._unbind(z) : B(j.aniTime), j.steps = [], j._pos(e, f), j.options.onScrollEnd && j.options.onScrollEnd.call(j))), j.absStartX = j.x, j.absStartY = j.y, j.startX = j.x, j.startY = j.y, j.pointX = k.pageX, j.pointY = k.pageY, j.startTime = b.timeStamp || Date.now(), j.options.onScrollStart && j.options.onScrollStart.call(j, b), j._bind(w, a), j._bind(x, a), j._bind(y, a))
		},
		_move: function(a) {
			var b, c, e, f = this,
			g = r ? a.touches[0] : a,
			i = g.pageX - f.pointX,
			j = g.pageY - f.pointY,
			k = f.x + i,
			l = f.y + j,
			m = a.timeStamp || Date.now();
			return f.options.onBeforeScrollMove && f.options.onBeforeScrollMove.call(f, a),
			f.options.zoom && r && a.touches.length > 1 ? (b = d.abs(a.touches[0].pageX - a.touches[1].pageX), c = d.abs(a.touches[0].pageY - a.touches[1].pageY), f.touchesDist = d.sqrt(b * b + c * c), f.zoomed = !0, e = 1 / f.touchesDistStart * f.touchesDist * this.scale, e < f.options.zoomMin ? e = .5 * f.options.zoomMin * Math.pow(2, e / f.options.zoomMin) : e > f.options.zoomMax && (e = 2 * f.options.zoomMax * Math.pow(.5, f.options.zoomMax / e)), f.lastScale = e / this.scale, k = this.originX - this.originX * f.lastScale + this.x, l = this.originY - this.originY * f.lastScale + this.y, this.scroller.style[h] = "translate(" + k + "px," + l + "px) scale(" + e + ")" + C, void(f.options.onZoom && f.options.onZoom.call(f, a))) : (f.pointX = g.pageX, f.pointY = g.pageY, (k > 0 || k < f.maxScrollX) && (k = f.options.bounce ? f.x + i / 2 : k >= 0 || f.maxScrollX >= 0 ? 0 : f.maxScrollX), (l > f.minScrollY || l < f.maxScrollY) && (l = f.options.bounce ? f.y + j / 2 : l >= f.minScrollY || f.maxScrollY >= 0 ? f.minScrollY: f.maxScrollY), f.distX += i, f.distY += j, f.absDistX = d.abs(f.distX), f.absDistY = d.abs(f.distY), void(f.absDistX < 6 && f.absDistY < 6 || (f.options.lockDirection && (f.absDistX > f.absDistY + 5 ? (l = f.y, j = 0) : f.absDistY > f.absDistX + 5 && (k = f.x, i = 0)), f.moved = !0, f._pos(k, l), f.dirX = i > 0 ? -1 : 0 > i ? 1 : 0, f.dirY = j > 0 ? -1 : 0 > j ? 1 : 0, m - f.startTime > 300 && (f.startTime = m, f.startX = f.x, f.startY = f.y), f.options.onScrollMove && f.options.onScrollMove.call(f, a))))
		},
		_end: function(c) {
			if (!r || 0 === c.touches.length) {
				var e, f, g, i, k, l, m, n = this,
				o = r ? c.changedTouches[0] : c,
				p = {
					dist: 0,
					time: 0
				},
				q = {
					dist: 0,
					time: 0
				},
				s = (c.timeStamp || Date.now()) - n.startTime,
				t = n.x,
				u = n.y;
				if (n._unbind(w, a), n._unbind(x, a), n._unbind(y, a), n.options.onBeforeScrollEnd && n.options.onBeforeScrollEnd.call(n, c), n.zoomed) return m = n.scale * n.lastScale,
				m = Math.max(n.options.zoomMin, m),
				m = Math.min(n.options.zoomMax, m),
				n.lastScale = m / n.scale,
				n.scale = m,
				n.x = n.originX - n.originX * n.lastScale + n.x,
				n.y = n.originY - n.originY * n.lastScale + n.y,
				n.scroller.style[j] = "200ms",
				n.scroller.style[h] = "translate(" + n.x + "px," + n.y + "px) scale(" + n.scale + ")" + C,
				n.zoomed = !1,
				n.refresh(),
				void(n.options.onZoomEnd && n.options.onZoomEnd.call(n, c));
				if (!n.moved) return r && (n.doubleTapTimer && n.options.zoom ? (clearTimeout(n.doubleTapTimer), n.doubleTapTimer = null, n.options.onZoomStart && n.options.onZoomStart.call(n, c), n.zoom(n.pointX, n.pointY, 1 == n.scale ? n.options.doubleTapZoom: 1), n.options.onZoomEnd && setTimeout(function() {
					n.options.onZoomEnd.call(n, c)
				},
				200)) : this.options.handleClick && (n.doubleTapTimer = setTimeout(function() {
					for (n.doubleTapTimer = null, e = o.target; 1 != e.nodeType;) e = e.parentNode;
					"SELECT" != e.tagName && "INPUT" != e.tagName && "TEXTAREA" != e.tagName && (f = b.createEvent("MouseEvents"), f.initMouseEvent("click", !0, !0, c.view, 1, o.screenX, o.screenY, o.clientX, o.clientY, c.ctrlKey, c.altKey, c.shiftKey, c.metaKey, 0, null), f._fake = !0, e.dispatchEvent(f))
				},
				n.options.zoom ? 250 : 0))),
				n._resetPos(400),
				void(n.options.onTouchEnd && n.options.onTouchEnd.call(n, c));
				if (300 > s && n.options.momentum && (p = t ? n._momentum(t - n.startX, s, -n.x, n.scrollerW - n.wrapperW + n.x, n.options.bounce ? n.wrapperW: 0) : p, q = u ? n._momentum(u - n.startY, s, -n.y, n.maxScrollY < 0 ? n.scrollerH - n.wrapperH + n.y - n.minScrollY: 0, n.options.bounce ? n.wrapperH: 0) : q, t = n.x + p.dist, u = n.y + q.dist, (n.x > 0 && t > 0 || n.x < n.maxScrollX && t < n.maxScrollX) && (p = {
					dist: 0,
					time: 0
				}), (n.y > n.minScrollY && u > n.minScrollY || n.y < n.maxScrollY && u < n.maxScrollY) && (q = {
					dist: 0,
					time: 0
				})), p.dist || q.dist) return k = d.max(d.max(p.time, q.time), 10),
				n.options.snap && (g = t - n.absStartX, i = u - n.absStartY, d.abs(g) < n.options.snapThreshold && d.abs(i) < n.options.snapThreshold ? n.scrollTo(n.absStartX, n.absStartY, 200) : (l = n._snap(t, u), t = l.x, u = l.y, k = d.max(l.time, k))),
				n.scrollTo(d.round(t), d.round(u), k),
				void(n.options.onTouchEnd && n.options.onTouchEnd.call(n, c));
				if (n.options.snap) return g = t - n.absStartX,
				i = u - n.absStartY,
				d.abs(g) < n.options.snapThreshold && d.abs(i) < n.options.snapThreshold ? n.scrollTo(n.absStartX, n.absStartY, 200) : (l = n._snap(n.x, n.y), (l.x != n.x || l.y != n.y) && n.scrollTo(l.x, l.y, l.time)),
				void(n.options.onTouchEnd && n.options.onTouchEnd.call(n, c));
				n._resetPos(200),
				n.options.onTouchEnd && n.options.onTouchEnd.call(n, c)
			}
		},
		_resetPos: function(a) {
			var b = this,
			c = b.x >= 0 ? 0 : b.x < b.maxScrollX ? b.maxScrollX: b.x,
			d = b.y >= b.minScrollY || b.maxScrollY > 0 ? b.minScrollY: b.y < b.maxScrollY ? b.maxScrollY: b.y;
			return c == b.x && d == b.y ? (b.moved && (b.moved = !1, b.options.onScrollEnd && b.options.onScrollEnd.call(b)), b.hScrollbar && b.options.hideScrollbar && ("webkit" == f && (b.hScrollbarWrapper.style[m] = "300ms"), b.hScrollbarWrapper.style.opacity = "0"), void(b.vScrollbar && b.options.hideScrollbar && ("webkit" == f && (b.vScrollbarWrapper.style[m] = "300ms"), b.vScrollbarWrapper.style.opacity = "0"))) : void b.scrollTo(c, d, a || 0)
		},
		_wheel: function(a) {
			var b, c, d, e, f, g = this;
			if ("wheelDeltaX" in a) b = a.wheelDeltaX / 12,
			c = a.wheelDeltaY / 12;
			else if ("wheelDelta" in a) b = c = a.wheelDelta / 12;
			else {
				if (! ("detail" in a)) return;
				b = c = 3 * -a.detail
			}
			return "zoom" == g.options.wheelAction ? (f = g.scale * Math.pow(2, 1 / 3 * (c ? c / Math.abs(c) : 0)), f < g.options.zoomMin && (f = g.options.zoomMin), f > g.options.zoomMax && (f = g.options.zoomMax), void(f != g.scale && (!g.wheelZoomCount && g.options.onZoomStart && g.options.onZoomStart.call(g, a), g.wheelZoomCount++, g.zoom(a.pageX, a.pageY, f, 400), setTimeout(function() {
				g.wheelZoomCount--,
				!g.wheelZoomCount && g.options.onZoomEnd && g.options.onZoomEnd.call(g, a)
			},
			400)))) : (d = g.x + b, e = g.y + c, d > 0 ? d = 0 : d < g.maxScrollX && (d = g.maxScrollX), e > g.minScrollY ? e = g.minScrollY: e < g.maxScrollY && (e = g.maxScrollY), void(g.maxScrollY < 0 && g.scrollTo(d, e, 0)))
		},
		_transitionEnd: function(a) {
			var b = this;
			a.target == b.scroller && (b._unbind(z), b._startAni())
		},
		_startAni: function() {
			var a, b, c, e = this,
			f = e.x,
			g = e.y,
			h = Date.now();
			if (!e.animating) {
				if (!e.steps.length) return void e._resetPos(400);
				if (a = e.steps.shift(), a.x == f && a.y == g && (a.time = 0), e.animating = !0, e.moved = !0, e.options.useTransition) return e._transitionTime(a.time),
				e._pos(a.x, a.y),
				e.animating = !1,
				void(a.time ? e._bind(z) : e._resetPos(0));
				c = function() {
					var i, j, k = Date.now();
					return k >= h + a.time ? (e._pos(a.x, a.y), e.animating = !1, e.options.onAnimationEnd && e.options.onAnimationEnd.call(e), void e._startAni()) : (k = (k - h) / a.time - 1, b = d.sqrt(1 - k * k), i = (a.x - f) * b + f, j = (a.y - g) * b + g, e._pos(i, j), void(e.animating && (e.aniTime = A(c))))
				},
				c()
			}
		},
		_transitionTime: function(a) {
			a += "ms",
			this.scroller.style[j] = a,
			this.hScrollbar && (this.hScrollbarIndicator.style[j] = a),
			this.vScrollbar && (this.vScrollbarIndicator.style[j] = a)
		},
		_momentum: function(a, b, c, e, f) {
			var g = 6e-4,
			h = d.abs(a) / b,
			i = h * h / (2 * g),
			j = 0,
			k = 0;
			return a > 0 && i > c ? (k = f / (6 / (i / h * g)), c += k, h = h * c / i, i = c) : 0 > a && i > e && (k = f / (6 / (i / h * g)), e += k, h = h * e / i, i = e),
			i *= 0 > a ? -1 : 1,
			j = h / g,
			{
				dist: i,
				time: d.round(j)
			}
		},
		_offset: function(a) {
			for (var b = -a.offsetLeft,
			c = -a.offsetTop; a = a.offsetParent;) b -= a.offsetLeft,
			c -= a.offsetTop;
			return a != this.wrapper && (b *= this.scale, c *= this.scale),
			{
				left: b,
				top: c
			}
		},
		_snap: function(a, b) {
			var c, e, f, g, h, i, j = this;
			for (f = j.pagesX.length - 1, c = 0, e = j.pagesX.length; e > c; c++) if (a >= j.pagesX[c]) {
				f = c;
				break
			}
			for (f == j.currPageX && f > 0 && j.dirX < 0 && f--, a = j.pagesX[f], h = d.abs(a - j.pagesX[j.currPageX]), h = h ? d.abs(j.x - a) / h * 500 : 0, j.currPageX = f, f = j.pagesY.length - 1, c = 0; f > c; c++) if (b >= j.pagesY[c]) {
				f = c;
				break
			}
			return f == j.currPageY && f > 0 && j.dirY < 0 && f--,
			b = j.pagesY[f],
			i = d.abs(b - j.pagesY[j.currPageY]),
			i = i ? d.abs(j.y - b) / i * 500 : 0,
			j.currPageY = f,
			g = d.round(d.max(h, i)) || 200,
			{
				x: a,
				y: b,
				time: g
			}
		},
		_bind: function(a, b, c) { (b || this.scroller).addEventListener(a, this, !!c)
		},
		_unbind: function(a, b, c) { (b || this.scroller).removeEventListener(a, this, !!c)
		},
		destroy: function() {
			var b = this;
			b.scroller.style[h] = "",
			b.hScrollbar = !1,
			b.vScrollbar = !1,
			b._scrollbar("h"),
			b._scrollbar("v"),
			b._unbind(u, a),
			b._unbind(v),
			b._unbind(w, a),
			b._unbind(x, a),
			b._unbind(y, a),
			b.options.hasTouch || (b._unbind("DOMMouseScroll"), b._unbind("mousewheel")),
			b.options.useTransition && b._unbind(z),
			b.options.checkDOMChanges && clearInterval(b.checkDOMTime),
			b.options.onDestroy && b.options.onDestroy.call(b)
		},
		refresh: function() {
			var a, b, c, e, f = this,
			g = 0,
			h = 0;
			if (f.scale < f.options.zoomMin && (f.scale = f.options.zoomMin), f.wrapperW = f.wrapper.clientWidth || 1, f.wrapperH = f.wrapper.clientHeight || 1, f.minScrollY = -f.options.topOffset || 0, f.scrollerW = d.round(f.scroller.offsetWidth * f.scale), f.scrollerH = d.round((f.scroller.offsetHeight + f.minScrollY) * f.scale), f.maxScrollX = f.wrapperW - f.scrollerW, f.maxScrollY = f.wrapperH - f.scrollerH + f.minScrollY, f.dirX = 0, f.dirY = 0, f.options.onRefresh && f.options.onRefresh.call(f), f.hScroll = f.options.hScroll && f.maxScrollX < 0, f.vScroll = f.options.vScroll && (!f.options.bounceLock && !f.hScroll || f.scrollerH > f.wrapperH), f.hScrollbar = f.hScroll && f.options.hScrollbar, f.vScrollbar = f.vScroll && f.options.vScrollbar && f.scrollerH > f.wrapperH, a = f._offset(f.wrapper), f.wrapperOffsetLeft = -a.left, f.wrapperOffsetTop = -a.top, "string" == typeof f.options.snap) for (f.pagesX = [], f.pagesY = [], e = f.scroller.querySelectorAll(f.options.snap), b = 0, c = e.length; c > b; b++) g = f._offset(e[b]),
			g.left += f.wrapperOffsetLeft,
			g.top += f.wrapperOffsetTop,
			f.pagesX[b] = g.left < f.maxScrollX ? f.maxScrollX: g.left * f.scale,
			f.pagesY[b] = g.top < f.maxScrollY ? f.maxScrollY: g.top * f.scale;
			else if (f.options.snap) {
				for (f.pagesX = []; g >= f.maxScrollX;) f.pagesX[h] = g,
				g -= f.wrapperW,
				h++;
				for (f.maxScrollX % f.wrapperW && (f.pagesX[f.pagesX.length] = f.maxScrollX - f.pagesX[f.pagesX.length - 1] + f.pagesX[f.pagesX.length - 1]), g = 0, h = 0, f.pagesY = []; g >= f.maxScrollY;) f.pagesY[h] = g,
				g -= f.wrapperH,
				h++;
				f.maxScrollY % f.wrapperH && (f.pagesY[f.pagesY.length] = f.maxScrollY - f.pagesY[f.pagesY.length - 1] + f.pagesY[f.pagesY.length - 1])
			}
			f._scrollbar("h"),
			f._scrollbar("v"),
			f.zoomed || (f.scroller.style[j] = "0", f._resetPos(400))
		},
		scrollTo: function(a, b, c, d) {
			var e, f, g = this,
			h = a;
			for (g.stop(), h.length || (h = [{
				x: a,
				y: b,
				time: c,
				relative: d
			}]), e = 0, f = h.length; f > e; e++) h[e].relative && (h[e].x = g.x - h[e].x, h[e].y = g.y - h[e].y),
			g.steps.push({
				x: h[e].x,
				y: h[e].y,
				time: h[e].time || 0
			});
			g._startAni()
		},
		scrollToElement: function(a, b) {
			var c, e = this;
			a = a.nodeType ? a: e.scroller.querySelector(a),
			a && (c = e._offset(a), c.left += e.wrapperOffsetLeft, c.top += e.wrapperOffsetTop, c.left = c.left > 0 ? 0 : c.left < e.maxScrollX ? e.maxScrollX: c.left, c.top = c.top > e.minScrollY ? e.minScrollY: c.top < e.maxScrollY ? e.maxScrollY: c.top, b = void 0 === b ? d.max(2 * d.abs(c.left), 2 * d.abs(c.top)) : b, e.scrollTo(c.left, c.top, b))
		},
		scrollToPage: function(a, b, c) {
			var d, e, f = this;
			c = void 0 === c ? 400 : c,
			f.options.onScrollStart && f.options.onScrollStart.call(f),
			f.options.snap ? (a = "next" == a ? f.currPageX + 1 : "prev" == a ? f.currPageX - 1 : a, b = "next" == b ? f.currPageY + 1 : "prev" == b ? f.currPageY - 1 : b, a = 0 > a ? 0 : a > f.pagesX.length - 1 ? f.pagesX.length - 1 : a, b = 0 > b ? 0 : b > f.pagesY.length - 1 ? f.pagesY.length - 1 : b, f.currPageX = a, f.currPageY = b, d = f.pagesX[a], e = f.pagesY[b]) : (d = -f.wrapperW * a, e = -f.wrapperH * b, d < f.maxScrollX && (d = f.maxScrollX), e < f.maxScrollY && (e = f.maxScrollY)),
			f.scrollTo(d, e, c)
		},
		disable: function() {
			this.stop(),
			this._resetPos(0),
			this.enabled = !1,
			this._unbind(w, a),
			this._unbind(x, a),
			this._unbind(y, a)
		},
		enable: function() {
			this.enabled = !0
		},
		stop: function() {
			this.options.useTransition ? this._unbind(z) : B(this.aniTime),
			this.steps = [],
			this.moved = !1,
			this.animating = !1
		},
		zoom: function(a, b, c, d) {
			var e = this,
			f = c / e.scale;
			e.options.useTransform && (e.zoomed = !0, d = void 0 === d ? 200 : d, a = a - e.wrapperOffsetLeft - e.x, b = b - e.wrapperOffsetTop - e.y, e.x = a - a * f + e.x, e.y = b - b * f + e.y, e.scale = c, e.refresh(), e.x = e.x > 0 ? 0 : e.x < e.maxScrollX ? e.maxScrollX: e.x, e.y = e.y > e.minScrollY ? e.minScrollY: e.y < e.maxScrollY ? e.maxScrollY: e.y, e.scroller.style[j] = d + "ms", e.scroller.style[h] = "translate(" + e.x + "px," + e.y + "px) scale(" + c + ")" + C, e.zoomed = !1)
		},
		isReady: function() {
			return ! this.moved && !this.zoomed && !this.animating
		}
	},
	e = null,
	"undefined" != typeof exports ? exports.iScroll = D: a.iScroll = D
} (window, document);
var TrimPath; !
function() {
	null == TrimPath && (TrimPath = new Object),
	null == TrimPath.evalEx && (TrimPath.evalEx = function(src) {
		return eval(src)
	});
	var UNDEFINED;
	null == Array.prototype.pop && (Array.prototype.pop = function() {
		return 0 === this.length ? UNDEFINED: this[--this.length]
	}),
	null == Array.prototype.push && (Array.prototype.push = function() {
		for (var a = 0; a < arguments.length; ++a) this[this.length] = arguments[a];
		return this.length
	}),
	TrimPath.parseTemplate = function(a, b, c) {
		null == c && (c = TrimPath.parseTemplate_etc);
		var d = parse(a, b, c),
		e = TrimPath.evalEx(d, b, 1);
		return null != e ? new c.Template(b, a, d, e, c) : null
	};
	try {
		String.prototype.process = function(a, b) {
			var c = TrimPath.parseTemplate(this, null);
			return null != c ? c.process(a, b) : this
		}
	} catch(e) {}
	TrimPath.parseTemplate_etc = {},
	TrimPath.parseTemplate_etc.statementTag = "forelse|for|if|elseif|else|var|macro",
	TrimPath.parseTemplate_etc.statementDef = {
		"if": {
			delta: 1,
			prefix: "if (",
			suffix: ") {",
			paramMin: 1
		},
		"else": {
			delta: 0,
			prefix: "} else {"
		},
		elseif: {
			delta: 0,
			prefix: "} else if (",
			suffix: ") {",
			paramDefault: "true"
		},
		"/if": {
			delta: -1,
			prefix: "}"
		},
		"for": {
			delta: 1,
			paramMin: 3,
			prefixFunc: function(a, b, c, d) {
				if ("in" != a[2]) throw new d.ParseError(c, b.line, "bad for loop statement: " + a.join(" "));
				var e = a[1],
				f = "__LIST__" + e;
				return ["var ", f, " = ", a[3], ";", "var __LENGTH_STACK__;", "if (typeof(__LENGTH_STACK__) == 'undefined' || !__LENGTH_STACK__.length) __LENGTH_STACK__ = new Array();", "__LENGTH_STACK__[__LENGTH_STACK__.length] = 0;", "if ((", f, ") != null) { ", "var ", e, "_ct = 0;", "for (var ", e, "_index in ", f, ") { ", e, "_ct++;", "if (typeof(", f, "[", e, "_index]) == 'function') {continue;}", "__LENGTH_STACK__[__LENGTH_STACK__.length - 1]++;", "var ", e, " = ", f, "[", e, "_index];"].join("")
			}
		},
		forelse: {
			delta: 0,
			prefix: "} } if (__LENGTH_STACK__[__LENGTH_STACK__.length - 1] == 0) { if (",
			suffix: ") {",
			paramDefault: "true"
		},
		"/for": {
			delta: -1,
			prefix: "} }; delete __LENGTH_STACK__[__LENGTH_STACK__.length - 1];"
		},
		"var": {
			delta: 0,
			prefix: "var ",
			suffix: ";"
		},
		macro: {
			delta: 1,
			prefixFunc: function(a) {
				var b = a[1].split("(")[0];
				return ["var ", b, " = function", a.slice(1).join(" ").substring(b.length), "{ var _OUT_arr = []; var _OUT = { write: function(m) { if (m) _OUT_arr.push(m); } }; "].join("")
			}
		},
		"/macro": {
			delta: -1,
			prefix: " return _OUT_arr.join(''); };"
		}
	},
	TrimPath.parseTemplate_etc.modifierDef = {
		eat: function() {
			return ""
		},
		escape: function(a) {
			return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
		},
		capitalize: function(a) {
			return String(a).toUpperCase()
		},
		"default": function(a, b) {
			return null != a ? a: b
		}
	},
	TrimPath.parseTemplate_etc.modifierDef.h = TrimPath.parseTemplate_etc.modifierDef.escape,
	TrimPath.parseTemplate_etc.Template = function(a, b, c, d, e) {
		this.process = function(a, b) {
			null == a && (a = {}),
			null == a._MODIFIERS && (a._MODIFIERS = {}),
			null == a.defined && (a.defined = function(b) {
				return void 0 != a[b]
			});
			for (var c in e.modifierDef) null == a._MODIFIERS[c] && (a._MODIFIERS[c] = e.modifierDef[c]);
			null == b && (b = {});
			var f = [],
			g = {
				write: function(a) {
					f.push(a)
				}
			};
			try {
				d(g, a, b)
			} catch(h) {
				if (1 == b.throwExceptions) throw h;
				var i = new String(f.join("") + "[ERROR: " + h.toString() + (h.message ? "; " + h.message: "") + "]");
				return i.exception = h,
				i
			}
			return f.join("")
		},
		this.name = a,
		this.source = b,
		this.sourceFunc = c,
		this.toString = function() {
			return "TrimPath.Template [" + a + "]"
		}
	},
	TrimPath.parseTemplate_etc.ParseError = function(a, b, c) {
		this.name = a,
		this.line = b,
		this.message = c
	},
	TrimPath.parseTemplate_etc.ParseError.prototype.toString = function() {
		return "TrimPath template ParseError in " + this.name + ": line " + this.line + ", " + this.message
	};
	var parse = function(a, b, c) {
		a = cleanWhiteSpace(a);
		for (var d = ["var TrimPath_Template_TEMP = function(_OUT, _CONTEXT, _FLAGS) { with (_CONTEXT) {"], e = {
			stack: [],
			line: 1
		},
		f = -1; f + 1 < a.length;) {
			var g = f;
			for (g = a.indexOf("{", g + 1); g >= 0;) {
				var h = a.indexOf("}", g + 1),
				i = a.substring(g, h),
				j = i.match(/^\{(cdata|minify|eval)/);
				if (j) {
					var k = j[1],
					l = g + k.length + 1,
					m = a.indexOf("}", l);
					if (m >= 0) {
						var n;
						n = 0 >= m - l ? "{/" + k + "}": a.substring(l + 1, m);
						var o = a.indexOf(n, m + 1);
						if (o >= 0) {
							emitSectionText(a.substring(f + 1, g), d);
							var p = a.substring(m + 1, o);
							"cdata" == k ? emitText(p, d) : "minify" == k ? emitText(scrubWhiteSpace(p), d) : "eval" == k && null != p && p.length > 0 && d.push("_OUT.write( (function() { " + p + " })() );"),
							g = f = o + n.length - 1
						}
					}
				} else if ("$" != a.charAt(g - 1) && "\\" != a.charAt(g - 1)) {
					var q = "/" == a.charAt(g + 1) ? 2 : 1;
					if (0 == a.substring(g + q, g + 10 + q).search(TrimPath.parseTemplate_etc.statementTag)) break
				}
				g = a.indexOf("{", g + 1)
			}
			if (0 > g) break;
			var h = a.indexOf("}", g + 1);
			if (0 > h) break;
			emitSectionText(a.substring(f + 1, g), d),
			emitStatement(a.substring(g, h + 1), e, d, b, c),
			f = h
		}
		if (emitSectionText(a.substring(f + 1), d), 0 != e.stack.length) throw new c.ParseError(b, e.line, "unclosed, unmatched statement(s): " + e.stack.join(","));
		return d.push("}}; TrimPath_Template_TEMP"),
		d.join("")
	},
	emitStatement = function(a, b, c, d, e) {
		var f = a.slice(1, -1).split(" "),
		g = e.statementDef[f[0]];
		if (null == g) return void emitSectionText(a, c);
		if (g.delta < 0) {
			if (b.stack.length <= 0) throw new e.ParseError(d, b.line, "close tag does not match any previous statement: " + a);
			b.stack.pop()
		}
		if (g.delta > 0 && b.stack.push(a), null != g.paramMin && g.paramMin >= f.length) throw new e.ParseError(d, b.line, "statement needs more parameters: " + a);
		if (c.push(null != g.prefixFunc ? g.prefixFunc(f, b, d, e) : g.prefix), null != g.suffix) {
			if (f.length <= 1) null != g.paramDefault && c.push(g.paramDefault);
			else for (var h = 1; h < f.length; h++) h > 1 && c.push(" "),
			c.push(f[h]);
			c.push(g.suffix)
		}
	},
	emitSectionText = function(a, b) {
		if (! (a.length <= 0)) {
			for (var c = 0,
			d = a.length - 1; c < a.length && "\n" == a.charAt(c);) c++;
			for (; d >= 0 && (" " == a.charAt(d) || "	" == a.charAt(d));) d--;
			if (c > d && (d = c), c > 0) {
				b.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');
				var e = a.substring(0, c).replace("\n", "\\n");
				"\n" == e.charAt(e.length - 1) && (e = e.substring(0, e.length - 1)),
				b.push(e),
				b.push('");')
			}
			for (var f = a.substring(c, d + 1).split("\n"), g = 0; g < f.length; g++) emitSectionTextLine(f[g], b),
			g < f.length - 1 && b.push('_OUT.write("\\n");\n');
			if (d + 1 < a.length) {
				b.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');
				var e = a.substring(d + 1).replace("\n", "\\n");
				"\n" == e.charAt(e.length - 1) && (e = e.substring(0, e.length - 1)),
				b.push(e),
				b.push('");')
			}
		}
	},
	emitSectionTextLine = function(a, b) {
		for (var c = "}",
		d = -1; d + c.length < a.length;) {
			var e = "${",
			f = "}",
			g = a.indexOf(e, d + c.length);
			if (0 > g) break;
			"%" == a.charAt(g + 2) && (e = "${%", f = "%}");
			var h = a.indexOf(f, g + e.length);
			if (0 > h) break;
			emitText(a.substring(d + c.length, g), b);
			var i = a.substring(g + e.length, h).replace(/\|\|/g, "#@@#").split("|");
			for (var j in i) i[j].replace && (i[j] = i[j].replace(/#@@#/g, "||"));
			b.push("_OUT.write("),
			emitExpression(i, i.length - 1, b),
			b.push(");"),
			d = h,
			c = f
		}
		emitText(a.substring(d + c.length), b)
	},
	emitText = function(a, b) {
		null == a || a.length <= 0 || (a = a.replace(/\\/g, "\\\\"), a = a.replace(/\n/g, "\\n"), a = a.replace(/"/g, '\\"'), b.push('_OUT.write("'), b.push(a), b.push('");'))
	},
	emitExpression = function(a, b, c) {
		var d = a[b];
		if (0 >= b) return void c.push(d);
		var e = d.split(":");
		c.push('_MODIFIERS["'),
		c.push(e[0]),
		c.push('"]('),
		emitExpression(a, b - 1, c),
		e.length > 1 && (c.push(","), c.push(e[1])),
		c.push(")")
	},
	cleanWhiteSpace = function(a) {
		return a = a.replace(/\t/g, "    "),
		a = a.replace(/\r\n/g, "\n"),
		a = a.replace(/\r/g, "\n"),
		a = a.replace(/^(\s*\S*(\s+\S+)*)\s*$/, "$1")
	},
	scrubWhiteSpace = function(a) {
		return a = a.replace(/^\s+/g, ""),
		a = a.replace(/\s+$/g, ""),
		a = a.replace(/\s+/g, " "),
		a = a.replace(/^(\s*\S*(\s+\S+)*)\s*$/, "$1")
	};
	TrimPath.parseDOMTemplate = function(a, b, c) {
		null == b && (b = document);
		var d = b.getElementById(a),
		e = d.value;
		return null == e && (e = d.innerHTML),
		e = e.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
		TrimPath.parseTemplate(e, a, c)
	},
	TrimPath.processDOMTemplate = function(a, b, c, d, e) {
		return TrimPath.parseDOMTemplate(a, d, e).process(b, c)
	}
} ();
var UrsUtil = {
	isIE6: function() {
		return window.XMLHttpRequest ? !1 : !0
	} (),
	isOpera: function() {
		return window.opera ? !0 : !1
	} (),
	trim: function(a) {
		return a.replace(/(^\s*)|(\s*$)/g, "")
	},
	getPos: function(a) {
		var b, c = {},
		d = window,
		e = a;
		if (d == window.top && e.offsetParent) for (; e.offsetParent;) {
			if (e = e.offsetParent, e.currentStyle && "fixed" == e.currentStyle.position) {
				a.fix = b = !0;
				break
			}
			if (document.defaultView && "fixed" == document.defaultView.getComputedStyle(e, null).position) {
				a.fix = b = !0;
				break
			}
		}
		for (c.top = a.getBoundingClientRect().top, c.left = a.getBoundingClientRect().left; d != window.top;) {
			for (var f = d.parent.document.getElementsByTagName("iframe"), g = 0, h = f.length; h > g; g++) if (f[g].contentWindow == d) {
				a = f[g];
				break
			}
			c.top += a.getBoundingClientRect().top,
			c.left += a.getBoundingClientRect().left,
			d = d.parent
		}
		return b || (c.top += d.document.documentElement.scrollTop + d.document.body.scrollTop, c.left += d.document.documentElement.scrollLeft + d.document.body.scrollLeft),
		c
	},
	getCookie: function(a) {
		var b = "(?:;)?" + a + "=([^;]*);?",
		c = new RegExp(b);
		return c.test(document.cookie) ? decodeURIComponent(RegExp.$1) : null
	},
	addEvent: function(a, b, c) {
		try {
			a.addEventListener(b, c, !1)
		} catch(d) {
			a.attachEvent("on" + b, c)
		}
	}
},
AutoUrs = {
	ini: function() {
		if (this.doc = window.self == window.top ? document: window.top.document, !this.doc.getElementById("RKS")) {
			var a = "#selCont{position:absolute; z-index:1000010; display:none;overflow:hidden; text-align:left;background-color:#FFFFFF; border:1px solid #ccc; font-size:12px;font-family:Arial,sans-serif;}#selCont h3{font-size:12px; padding:6px 6px 3px; margin:0; font-weight:normal; color:#999;height:auto;width:auto;line-height:1em;}#selCont div{position:relative; left:0; top:0; z-index:1000012}#selCont ul {list-style:none; text-align:left; margin:0; padding:0;font-size:0;}#selCont ul li{line-height:20px;font-size:12px; padding:2px 6px;cursor:pointer; color:#666;}#selCont ul li.on {background-color:#2d8bff; color:#fff;font-weight:bold;}.ursIni{color:#999;}",
			b = this.doc.createElement("style");
			b.type = "text/css",
			b.id = "RKS";
			try {
				b.styleSheet.cssText = a
			} catch(c) {
				try {
					b.innerHTML = a
				} catch(c) {
					b.appendChild(this.doc.createTextNode(a))
				}
			}
			this.doc.getElementsByTagName("head")[0].appendChild(b)
		}
		if (this.selCont = this.doc.getElementById("selCont")) return void(this.ulSel = this.doc.getElementById("ulSel"));
		this.selCont = this.doc.createElement("div"),
		this.selCont.id = "selCont",
		this.selCont.innerHTML = "<div><h3>--请选择帐号--</h3><ul id='ulSel'></ul></div>",
		UrsUtil.isIE6 && (this.selCont.innerHTML += "<iframe src='javascript:' frameborder='0' style='position:absolute;left:0;top:0;z-index:1000011;filter:alpha(opacity=0);margin:0;border:none;width:800px;height:800px;'></iframe>");
		var d = this;
		if (void 0 === this.doc.onreadystatechange) !
		function() {
			d.doc.body ? (d.doc.body.appendChild(d.selCont), d.ulSel = d.doc.getElementById("ulSel")) : setTimeout(arguments.callee, 20)
		} ();
		else {
			if ("complete" == this.doc.readyState) return this.doc.body.appendChild(d.selCont),
			void(this.ulSel = d.doc.getElementById("ulSel"));
			UrsUtil.addEvent(this.doc, "readystatechange",
			function() {
				"complete" == d.doc.readyState && (d.doc.body.appendChild(d.selCont), d.ulSel = d.doc.getElementById("ulSel"))
			})
		}
	},
	bind: function(a, b) {
		this.iUrs = document.getElementById(a);
		var b = b ? b: {};
		if (b.mailList = b.mailList ? b.mailList: ["163.com", "126.com", "yeah.net", "vip.163.com", "vip.126.com", "188.com", "netease.com"], b.cookie = b.cookie ? b.cookie: "none", this.iUrs.defaultUrs = b.placeholder ? b.placeholder: "如name@example.com", "" == this.iUrs.value) {
			if ("global" == b.cookie) var c = UrsUtil.getCookie("P_INFO") ? UrsUtil.getCookie("P_INFO").split("|")[0] : null;
			else if ("none" != b.cookie) var c = UrsUtil.getCookie(b.cookie);
			c ? this.iUrs.value = c: (this.iUrs.className += " ursIni", this.iUrs.value = this.iUrs.defaultUrs)
		}
		this.iUrs.tabTo = b.tabTo,
		this.iUrs.mails = b.mailList,
		this.iUrs.selIndex = 0,
		this.iUrs.inList = !1,
		this.eventHandler(),
		this.setPos()
	},
	eventHandler: function() {
		var a = this;
		UrsUtil.addEvent(window.top, "resize",
		function() {
			a.setPos.call(a)
		}),
		UrsUtil.addEvent(this.iUrs, "keydown",
		function(b) {
			a.down.call(a, b)
		}),
		UrsUtil.addEvent(a.iUrs, "keypress",
		function(b) {
			a.press.call(a, b)
		}),
		this.iUrs.onfocus = function() { - 1 != this.className.indexOf("ursIni") && (this.value = "", this.className = this.className.replace("ursIni", "")),
			this.select(),
			a.iUrs = this,
			a.iUrs.inList = !1,
			a.ulSel && (a.ulSel.innerHTML = ""),
			a.setPos()
		},
		this.iUrs.onblur = function() {
			a.setVal()
		},
		window.onscroll = function() {
			"block" == a.selCont.style.display && a.setPos()
		}
	},
	setPos: function() {
		var a = UrsUtil.getPos(this.iUrs);
		this.iUrs.fix && (this.selCont.style.position = "fixed"),
		this.selCont.style.left = a.left + "px",
		this.selCont.style.top = a.top + this.iUrs.offsetHeight + 1 + "px"
	},
	press: function(a) {
		var b = this,
		a = a || window.event,
		c = a.keyCode;
		if (UrsUtil.isOpera && setTimeout(function() {
			b.update(c)
		},
		20), 13 == c) {
			this.setVal();
			try {
				a.preventDefault()
			} catch(d) {
				a.returnValue = !1
			}
			b.doc.getElementById(b.iUrs.tabTo) && b.doc.getElementById(b.iUrs.tabTo).focus()
		}
	},
	down: function(a) {
		var b = this,
		a = a || window.event,
		c = a.keyCode;
		UrsUtil.isOpera || setTimeout(function() {
			b.update(c)
		},
		20)
	},
	setVal: function() {
		"" != UrsUtil.trim(this.iUrs.value) && this.iUrs.inList ? this.iUrs.value = this.ulSel.childNodes[this.iUrs.selIndex].innerHTML: "" == UrsUtil.trim(this.iUrs.value) && (this.iUrs.className += " ursIni", this.iUrs.value = this.iUrs.defaultUrs),
		this.selCont.style.display = "none"
	},
	update: function(a) {
		var b = UrsUtil.trim(this.iUrs.value);
		if (13 != a && 17 != a) {
			if ("" == b) return void(this.selCont.style.display = "none");
			if (16 == a || 9 == a) return;
			if (this.selCont.style.display = "block", 38 != a && 40 != a) {
				var c = [];
				if (b.indexOf("@") >= 0) {
					for (var d = b.indexOf("@"), e = b.substring(d + 1), f = !1, g = 0, h = this.iUrs.mails.length; h > g; g++) 0 == this.iUrs.mails[g].indexOf(e) ? (f = !0, c.push("<li>" + b.substring(0, d) + "@" + this.iUrs.mails[g] + "</li>")) : this.iUrs.selIndex = 0;
					if (this.iUrs.inList = f, !f) return void(this.selCont.style.display = "none")
				} else {
					this.iUrs.inList = !0;
					for (var g = 0,
					h = this.iUrs.mails.length; h > g; g++) c.push("<li>" + b + "@" + this.iUrs.mails[g] + "</li>")
				}
				c = c.join(""),
				this.ulSel.innerHTML = c,
				this.selCont.style.width = "auto",
				this.selCont.style.width = this.selCont.offsetWidth < this.iUrs.offsetWidth ? this.iUrs.offsetWidth - 2 + "px": "",
				this.ulSel.childNodes[this.iUrs.selIndex].className = "on";
				for (var i = this.ulSel.getElementsByTagName("li"), j = this, g = 0, h = i.length; h > g; g++) i[g].index = g,
				i[g].onmouseover = function() {
					i[j.iUrs.selIndex].className = "",
					j.iUrs.selIndex = this.index,
					i[j.iUrs.selIndex].className = "on"
				}
			}
			if (38 == a || 40 == a) try {
				this.ulSel.childNodes[this.iUrs.selIndex].className = "",
				38 == a ? this.iUrs.selIndex--:40 == a && this.iUrs.selIndex++;
				var i = this.ulSel.getElementsByTagName("li");
				this.iUrs.selIndex >= i.length && (this.iUrs.selIndex = 0),
				this.iUrs.selIndex < 0 && (this.iUrs.selIndex = i.length - 1),
				i[this.iUrs.selIndex].className = "on"
			} catch(k) {}
		}
	}
};
AutoUrs.ini();