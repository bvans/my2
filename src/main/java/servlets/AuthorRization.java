package servlets;

import service.CoreService;
import util.SHA1;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

@SuppressWarnings("serial")
public class AuthorRization extends HttpServlet {

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
	   /**
     * 微信公众平台 成为开发者验证入口
     * 
     * @param request
     *            the request send by the client to the server
     * @param response
     *            the response send by the server to the client
     * @throws ServletException
     *             if an error occurred
     * @throws IOException
     *             if an error occurred
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 微信加密签名
        String signature = request.getParameter("signature");
        // 随机字符串
        String echostr = request.getParameter("echostr");
        // 时间戳
        String timestamp = request.getParameter("timestamp");
        // 随机数
        String nonce = request.getParameter("nonce");
        
        if (signature == null && echostr == null
		        		&& timestamp == null && nonce == null ){
        	response.getWriter().write("args error!");
        	return;
        }
        String TOKEN = "yalong5945";
        String[] str = { TOKEN, timestamp, nonce };
        Arrays.sort(str); // 字典序排序
        String bigStr = str[0] + str[1] + str[2];
        // SHA1加密
        String digest = new SHA1().getDigestOfString(bigStr.getBytes())
                .toLowerCase();

        // 确认请求来至微信
        if (digest.equals(signature)) {
            response.getWriter().print(echostr);
        }
        else {
        	response.getWriter().print(false);
        }
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

		// 将请求、响应的编码均设置为UTF-8（防止中文乱码）
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		// 调用核心业务类接收消息、处理消息
		String respMessage = CoreService.processRequest(request);
		
		// 响应消息
		PrintWriter out = response.getWriter();
		out.print(respMessage);
		out.close();
	}

}
