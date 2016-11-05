package bean;
import java.io.Serializable;
import java.sql.*;

public class DBBean implements Serializable{
	
	private static final long serialVersionUID = 8173811109735675695L;
	private String driver = "com.mysql.jdbc.Driver";
	
	private String DBurl = "jdbc:mysql://localhost:3306/my2?characterEncoding=utf8";
	private String user = "root";
	private String passwd = "root";
	
	private Connection conn = null;
	private PreparedStatement pStatement = null;
	
	public DBBean(){
		try {
			Class.forName(driver);
			conn = DriverManager.getConnection(DBurl, user, passwd);
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			System.out.println("加载数据库驱动失败.");
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("同数据库建立连接失败.");
			e.printStackTrace();
		}	
	}
	
	public int executeUpdate(String sql, String...args){
		int result = 0;
		try {
			pStatement = conn.prepareStatement(sql);
			for (int i = 1; i <= args.length; i++){
				pStatement.setString(i, args[i-1]);
			}
			pStatement.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("数据库连接错误");
			e.printStackTrace();
		}
		
		return result;
	}
	
	public ResultSet executeQuery(String sql, String...args){
		ResultSet result = null;
		try {
			pStatement = conn.prepareStatement(sql);
			for (int i = 1; i <= args.length; i++){
				pStatement.setString(i, args[i-1]);
			}
			result = pStatement.executeQuery(sql);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("执行查询错误!");
			e.printStackTrace();
		}
		return result;
	}
	
	public void close(){
		try {
			pStatement.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("关闭连接错误");
			e.printStackTrace();
		}	
	}
	
	public String getFreshKey(){
		ResultSet result = null;
		String key = null;
		String sql = "SELECT freshcdkey FROM `fresh` LIMIT 0, 1; ";
		result = this.executeQuery(sql);
		try {
			result.next();
			key = result.getString("freshcdkey");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.print("数据库返回的数据集有误");
			e.printStackTrace();
		}
		this.delFreshKey(key);
		this.close();
		return key;
	}
	
	private int delFreshKey(String s){
		String del = "DELETE FROM `fresh` WHERE freshcdkey=?" ;
		try {
			PreparedStatement pStatement = conn.prepareStatement(del);
			pStatement.setString(1, s);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("数据库连接问题");
			e.printStackTrace();
		}
		int result = this.executeUpdate(del, s);
		return result;
	}
	
	public String getOldKey(){
		ResultSet result = null;
		String key = null;
		String sql = "SELECT oldkey FROM `old` LIMIT 0, 1; ";
		result = this.executeQuery(sql);
		try {
			result.next();
			key = result.getString("oldkey");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.print("数据库返回的数据集有误");
			e.printStackTrace();
		}
		this.delOldKey(key);
		this.close();
		return key;
	}
	
	private int delOldKey(String s){
		String del = "DELETE FROM `old` WHERE oldkey=?" ;
		try {
			PreparedStatement pStatement = conn.prepareStatement(del);
			pStatement.setString(1, s);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("数据库连接问题");
			e.printStackTrace();
		}
		int result = this.executeUpdate(del, s);
		return result;
	}
	public static void main(String args[]){
		DBBean bean = new DBBean();
		System.out.println(bean.getOldKey());
	}
}