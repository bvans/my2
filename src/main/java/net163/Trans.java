package net163;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;


public class Trans {
    public static final String NETEASE = "http://mkey-phone.gm.163.com/cgi-bin/csa/";
    private String json = "";
    private String url = "";
    private String answer = "";

    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Trans(String url) throws ClientProtocolException, IOException {
        /*int start = url.indexOf("servlet") + 8;
		int end = url.length();
		String fileName = url.substring(start, end);
		String line = "";
		
		if (fileName.equals("Guide_csa_py")){
			fileName = "Guide_csa.py";
		}
		else if(fileName.equals("csa_sprite_py")){
			fileName = "Csa_sprite.py";
		}
		String targetURL = (NETEASE + fileName + "?" + param).toLowerCase();*/
        this.setUrl(url);
        //System.out.println(targetURL);
        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(this.url);
        HttpResponse httpResponse = httpClient.execute(httpGet);
        HttpEntity httpEntity = httpResponse.getEntity();
        InputStream is = httpEntity.getContent();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int i = -1;
        while ((i = is.read()) != -1) {
            baos.write(i);
        }
        String answerJSON = baos.toString();
        this.setJson(answerJSON);

        this.setAnswer("question error");

//        JSONObject jsonobject = new JSONObject();
//        jsonobject = JSONObject.fromObject(answerJSON);
//        if (answerJSON.indexOf("question error") != -1) {
//            //一般为参数错误
//            this.setAnswer("question error");
//        } else if (jsonobject.get("answer") != null) {
//            //正确答案
//            this.setAnswer(jsonobject.get("answer").toString());
//        } else {
//            //其他错误,返回空串
//            this.setAnswer(answer);
//        }

    }
	/*public static void main(String args[]) throws ClientProtocolException, IOException{
		Trans trans = new Trans("http://127.0.0.1/ch10/servlet/csa_sprite_py", "act=ask&question=标准&product_name=xyq&log_name=mkey");
		
		jsonobject = JSONObject.fromObject(utfString);
		System.out.println(trans.getAnswer());
	//	Unicode unicode = new Unicode(trans.getJson());
		//System.out.println(unicode.getChinese());
	}*/
    //http://mkey-phone.gm.163.com/cgi-bin/csa/guide_csa.py?act=login_status
}
