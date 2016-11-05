package http;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;

public class Get {
	public static void main() {
		HttpGet httpget = new HttpGet(
				"http://www.google.com/search?hl=en&q=httpclient&btnG=Google+Search&aq=f&oq=");
		/*URI uri = new URIBuilder().setScheme("http").setHost("www.google.com")
				.setPath("/search").setParameter("q", "httpclient")
				.setParameter("btnG", "Google Search").setParameter("aq", "f")
				.setParameter("oq", "").build();*/
		HttpGet httpgGet = new HttpGet("http://www.google.com/search?hl=en&q=httpclient&btnG=Google+Search&aq=f&oq=");
		System.out.println(httpgGet.getURI());
	}

}
