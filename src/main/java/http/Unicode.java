package http;

public class  Unicode {
	String unicodeStr = "";
	String chinese = "";
	
	public Unicode(String unicodeStr){
		this.setUnicodeStr(unicodeStr);
		
		StringBuffer buffer = new StringBuffer();
		String tmpStr = unicodeStr;
		
		while (tmpStr.indexOf("\\u") != -1){
			  int start = tmpStr.indexOf("\\u") + 2;
			  int end = start + 4;
			  buffer.append(tmpStr.substring(0, start - 2));
			  String subNum = tmpStr.substring(start, end);
			  char letter = (char) Integer.parseInt(subNum , 16);
	          buffer.append( String.valueOf(letter));
	          tmpStr = tmpStr.substring(end, tmpStr.length());
		  }
		this.setChinese(buffer.toString());
	}
	
	public String getUnicodeStr() {
		return unicodeStr;
	}
	public void setUnicodeStr(String unicodeStr) {
		this.unicodeStr = unicodeStr;
	}
	public String getChinese() {
		return chinese;
	}
	public void setChinese(String chinese) {
		this.chinese = chinese;
	}
}
