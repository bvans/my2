package net163;

import bean.DBBean;
import org.apache.http.client.ClientProtocolException;

import java.io.IOException;

public class Question {

	public static String getOriginalAnswer(String keyWords)
			throws ClientProtocolException, IOException {
		String baseURL = "http://mkey-phone.gm.163.com/cgi-bin/csa/"
				+ "csa_sprite.py?act=ask";
		String param2 = "&product_name=xyq&log_name=mkey";
		String answer = "";
		{
			// http://127.0.0.1/ch10/servlet/csa_sprite_py?act=ask&question=%E6%A2%A6%E5%B9%BB%E8%A5%BF%E6%B8%B8
			answer = new Trans(baseURL + "&question=" + keyWords + param2)
					.getAnswer();
		}
		return answer;
	}

	public static String getSimpAnswer(String keyWords) {
		String finalAnswer = "";
		if (keyWords.equals("1")
				|| keyWords.contains("礼包")
				|| keyWords.contains("新手")
				|| keyWords.contains("码")) {
			/*finalAnswer = "\n--------------------\n\n"
						+"<a href=\"http://vanvan.sinaapp.com/freshkey.jsp\">领取新手至尊激活码</a>\n\n"
						+"--------------------";*/
			finalAnswer = "恭喜您! 幸运的获得了:\n\n"
				+ "\"微信专享至尊新手卡\""
				+"\n------------------------\n\n"
				+ new DBBean().getFreshKey()
				+ "\n------------------------\n\n"
				+ "<a href=\"http://mhxy.me/my2/specification.htm\">点击查看激活说明</a>\n\n"
				+ "------------------------";
		}else if(keyWords.equals("2") 
				|| keyWords.contains("老玩家")
				|| keyWords.contains("老朋友")
				|| keyWords.contains("回归")
				|| keyWords.contains("回流")){
			finalAnswer = "恭喜您! 幸运的获得了:\n\n"
				+ "\"老玩家回流大奖\"[蛋糕]"
				+"\n------------------------\n\n"
				+ new DBBean().getOldKey()
				+ "\n------------------------\n\n"
				+ "<a href=\"http://mhxy163.duapp.com/vanvan/old.html\">点击查看激活说明</a>\n\n"
				+ "------------------------";
		}
		else {
			try {
				String originalAnswer = Question.getOriginalAnswer(keyWords);
				if (originalAnswer.indexOf("[默认答案]") == 0) {
					finalAnswer = "您好，可能是因为您的问题描述的不够详细，暂时无法回答您.[难过]\n建议使用\"师门\"、" +
							"\"押镖\"等具体关键词提问.[握手]"
							+ "\n------------------------"
							+ "\n[礼物][礼物][礼物][礼物][礼物][礼物][礼物][礼物][礼物]\n"
							+ "回复\"1\"可直接领取新手卡"
							+ "\n[礼物][礼物][礼物][礼物][礼物][礼物][礼物][礼物][礼物]\n"
							+ "回复\"2\"拿老玩家大奖[蛋糕]"
							+ "\n------------------------\n"
							;
				} else {
					finalAnswer = originalAnswer.replaceAll("<br/>", "\n");
					//finalAnswer = finalAnswer.replaceAll("<span class=\"sprite_color_text\">", "");
					//finalAnswer = finalAnswer.replaceAll("</span>", "");
					finalAnswer = finalAnswer.replaceAll("<\\S[^>]+>", "");//去除标签
					finalAnswer = finalAnswer.replace("&nbsp;", " ");//转换html的空格
					finalAnswer = finalAnswer.replace("&gt;", "");//转换html的空格
					finalAnswer = finalAnswer.replace("点击", "");//
					int start = finalAnswer.indexOf("如需GM帮助");
					if (start != -1){
						finalAnswer = finalAnswer.substring(0, start).trim();
					}
					
				}
			} catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		finalAnswer = finalAnswer.trim();
		System.out.println(finalAnswer);
		return finalAnswer;
	}

	public static void main(String args[]) {
		System.out.println(Question.getSimpAnswer("神兽"));
	}
}
