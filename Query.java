import java.util.HashMap;

public class Query {
	private String url;
	
	private String path;
	private String page;
	private HashMap<String, String> arguments = new HashMap<String, String>();
	
	public Query(String url) {
		this.url = url;
	}
	
	// http://example.com/path/to/page?name=ferret&color=purple
	
	public String getPath() {
		int start = url.indexOf("/", url.indexOf("/", url.indexOf("/") + 1) + 1) + 1;
		int end = url.lastIndexOf("/", url.lastIndexOf("/"));
		
		path = url.substring(start, end);
		
		return path;
	}
	
	public String getPage() {
		int start = url.lastIndexOf("/") + 1;
		int end = url.indexOf("?");
		
		page = url.substring(start, end);
		
		return page;
	}
	
	public HashMap getArguments() {
		String sub = url.substring(url.indexOf("?") + 1);
				
		while (sub.contains("&")) {
			String arg = sub.substring(0, sub.indexOf("&"));
			String key = arg.substring(0, arg.indexOf("="));
			String value = arg.substring(arg.indexOf("=") + 1);
			
			arguments.put(key, value);
			
			sub = url.substring(url.indexOf("&") + 1);
		}
		
		String arg = sub;
		String key = arg.substring(0, arg.indexOf("="));
		String value = arg.substring(arg.indexOf("=") + 1);
		
		arguments.put(key, value);

		return arguments;
	}
	
	
}
