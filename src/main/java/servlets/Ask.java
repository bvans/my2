package servlets;

import net163.Trans;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class Ask extends HttpServlet {

	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setCharacterEncoding("UTF-8");
		response.setHeader("content-type","text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		//String baseURL = request.getRequestURL().toString();
		String baseURL = "http://mkey-phone.gm.163.com/cgi-bin/csa/" +
				"csa_sprite.py?act=ask";
		String param2 = "&product_name=xyq&log_name=mkey";
		//http://127.0.0.1/ch10/servlet/csa_sprite_py?act=ask&question=%E6%A2%A6%E5%B9%BB%E8%A5%BF%E6%B8%B8
		String param = request.getQueryString();
		Trans trans = new Trans(baseURL + "&" + param + param2);
		String answer = trans.getAnswer().toString();
		System.out.println(answer);
		if (answer.equals("")){
			answer = "对不起,参数错误!";
		}
		else if (answer.indexOf("[默认答案]") != -1){
			answer = answer.substring(6, answer.length());
		}
		out
				.println("<!DOCTYPE HTML\">");
		out.println("<HTML>");
		out.println("  <HEAD><TITLE>A Servlet</TITLE></HEAD>");
		out.println("<meta charset= \"utf-8\">");
		out.println("  <BODY>");
		System.out.println(answer.getBytes("utf8").toString());
		out.println(answer);
		out.println("  </BODY>");
		out.println("</HTML>");
		out.flush();
		out.close();
	}

	/**
	 * The doPost method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to post.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out
				.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");
		out.println("<HTML>");
		out.println("  <HEAD><TITLE>A Servlet</TITLE></HEAD>");
		out.println("  <BODY>");
		out.print("    This is ");
		out.print(this.getClass());
		out.println(", using the POST method");
		out.println("  </BODY>");
		out.println("</HTML>");
		out.flush();
		out.close();
	}

}
