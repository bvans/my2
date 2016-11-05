
var sp;
$(function(){
	nav = new nav_bar('nav_sprite', 's1');

	var sprite_product = "xyq";
	if(!sprite_product){
		alert('请指定产品')
		return;
	}
	$('#sprite_icon').addClass(sprite_product + '_userThum');

	sp = new sprite('dialogue', 'evaluation', '谢谢反馈，您还可以：<br /><a href="/submit_question.html">&lt;去提交问题，等答复&gt;</a><br />', '', sprite_product, 'mkey');
	$('#ask').click(function(){
		ask();
	});

	$('#question').keypress(function(e){
		if(e.keyCode == 13){
			ask();
		}
	});

	// fixed bug of ios virtual keyboard
	$('input,textarea').bind('focus', function(){
		$('#evaluation').css('position', 'absolute');
	});

	$('input,textarea').bind('blur', function() {
		$('#evaluation').css('position', 'fixed');
            setTimeout(function() {
                window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
            }, 20);
        });
});

function ask(){
	var question = $('#question').val().trim();
	if(question.length > 30){
		alert('你的提问超过30字，请重新输入。');
		return;
	}
	if(!question) return;
	$('#question').val('');
	sp.ask_one_question(question);
	nav.hide();
}

function reask(question){
	sp.ask_one_question(question);
	nav.hide();
	return false;
}