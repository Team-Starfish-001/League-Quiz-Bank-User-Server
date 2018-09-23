import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

/**
 * 
 * How to send a request to redirect
 * 
 * 	var xhr = XMLHttpRequest();
 * 	xhr.get('GET', "http://localhost:8080/...", true);
 * 	xhr.send();
 * 
 */

public class Server {

	private static final int PORT = 8080;

	public static void main(String[] args) {
		try {
			ServerSocket server = new ServerSocket(PORT);
			System.out.println("MiniServer active " + PORT);
			while (true) {
				new ThreadedSocket(server.accept());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
	

class ThreadedSocket extends Thread {

	private Socket insocket;
	private Map<String, String> mimeMap;
	ThreadedSocket(Socket insocket) {
		initiateMap();
		this.insocket = insocket;
		this.start();
	}
	
	//Chooses content type
	private void initiateMap() {
		mimeMap = new HashMap<String, String>();
		mimeMap.put(".html", "Content-Type: text/html; charset=utf-8");
		mimeMap.put(".css", "Content-Type: text/css; charset=utf-8");
		mimeMap.put(".php", "Content-Type: text/html");
		mimeMap.put(".js", "Content-Type: applications/javascript; charset=utf-8");
		mimeMap.put(".png", "Content-Type: image/png");
		mimeMap.put(".jpeg", "Content-Type: image/jpeg");
		mimeMap.put(".jpg", "Content-Type: image/jpg");
	}

	@Override
	public void run() {
		try {
			
			//Gets the input request from the site
			InputStream is = insocket.getInputStream();
			PrintWriter out = new PrintWriter(insocket.getOutputStream());
			BufferedReader in = new BufferedReader(new InputStreamReader(is));
			String line;
			
			line = in.readLine();
			String request_method = line;
			
			line = "";
			int postDataI = -1;
			while ((line = in.readLine()) != null && (line.length() != 0)) {
				System.out.println(line);
				if (line.indexOf("Content-Length:") > -1) {
					postDataI = new Integer(line.substring(line.indexOf("Content-Length:") + 16, line.length()))
							.intValue();
				}
			}
			System.out.println("\n\n\n");

			String postData = "";
			if (postDataI > 0) {
				char[] charArray = new char[postDataI];
				in.read(charArray, 0, postDataI);
				postData = new String(charArray);
			}

			Query q = new Query(shortenString(request_method));
			String fullPath = q.getPath()+q.getPage();
			
			//HashMap<String, String> arguments = q.getArguments();
			//checkArguments(arguments);
			
			//loads the page based on the query
			if (fullPath.length()==0) {
				out.println("HTTP/1.0 200 OK");
				out.println("Content-Type: text/html; charset=utf-8");
				out.println("Server: MINISERVER");
				out.println("");

				out.println(readFile("Main.html"));

			} else {
				out.println("HTTP/1.0 200 OK");
				out.println(mimeType(fullPath));
				out.println("Server: MINISERVER");
				out.println("");

				// shows the file in the extension
				out.println(readFile(fullPath));

			}
			
			q.getArguments();
			out.close();
			insocket.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	//
	public void checkArguments(HashMap<String, String> arguments) {
		for(Map.Entry<String, String> entry: arguments.entrySet()) {
			switch(entry.getValue()) {
			case "userLogin":
				//check github base
				//redirect to password page
				break;
			case "quizID":
				//create an arrayList and read through students
				break;
			}
		}
	}
	
	//gets the mime type from a hashmap
	public String mimeType(String input) {
		for(Map.Entry<String, String> entry: mimeMap.entrySet()) {
			if(input.contains(entry.getKey())) {
				return entry.getValue();
			}
		}
		return "";
	}

	//reads the file
	public String readFile(String filename) {
		String s = "";
		
		if(filename.equals("favicon.ico")) {
			return null;
		}
		
		try {
			BufferedReader br = new BufferedReader(new FileReader("src/" + filename));
			String line = br.readLine();

			while (line != null) {
				s += line;
				line = br.readLine();
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return s;

	}

	//shortens the request string
	public String shortenString(String s) {
		String ret = s.substring(s.indexOf(" ")+2);
		ret = ret.substring(0, ret.indexOf("HTTP")-1);
		return ret;
	}
}