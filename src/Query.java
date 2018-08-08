import java.util.Arrays;
import java.util.HashMap;

public class Query {
	private String url;
	private String path;
	private String page;
	private HashMap<String, String> arguments = new HashMap<String, String>();
	
	public Query(String url) {
		this.url = url;
		setPath();
		setPage();
		setArguments();
	}
	
	// http://example.com/path/to/page.html?name=ferret&color=purple
	
	private void setPath() {
		int start = url.indexOf("/", url.indexOf("."))+1;
		int end = url.lastIndexOf("/", url.lastIndexOf("/"))+1;
		path = url.substring(start, end);
	}
	
	private void setPage() {
		int start = url.lastIndexOf("/") + 1;
		int end = (url+"?").indexOf("?");
		page = url.substring(start, end);
	}
	
	private void setArguments() {
		String sub = url+"&?=";
		sub = sub.substring(sub.indexOf("?") + 1);
		
		while (sub.contains("&")) {
			String arg = sub.substring(0, sub.indexOf("&"));
			String key = arg.substring(0, arg.indexOf("="));
			String value = arg.substring(arg.indexOf("=") + 1);
			arguments.put(key, value);
			
			sub = sub.substring(sub.indexOf("&") + 1);
		}
	}
	
	public String getPath() {
		return path;
	}
	
	public String getPage() {
		return page;
	}
	
	public HashMap<String, String> getArguments() {
		System.out.println(Arrays.asList(arguments)); // method 1
		return arguments;
	}
	
	//test
	
	public static void main(String[] args) {
		Query q1 = new Query("http://example.com/path/to/page.html?name=ferret&color=purple");
		System.out.println(q1.getPage());
		System.out.println(q1.getPath());
		q1.getArguments();
	}
	
}
