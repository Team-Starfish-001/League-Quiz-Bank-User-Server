import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

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
	private Map<String, String> map;

	ThreadedSocket(Socket insocket) {
		initiateMap();
		this.insocket = insocket;
		this.start();
	}
	
	private void initiateMap() {
		map = new HashMap<String, String>();
		map.put(".html", "Content-Type: text/html; charset=utf-8");
		map.put(".css", "Content-Type: text/css; charset=utf-8");
		map.put(".js", "Content-Type: applications/javascript; charset=utf-8");
		map.put(".png", "Content-Type: image/png");
		map.put(".jpeg", "Content-Type: image/jpeg");
		map.put(".jpg", "Content-Type: image/jpg");
	}

	@Override
	public void run() {
		try {
			InputStream is = insocket.getInputStream();
			PrintWriter out = new PrintWriter(insocket.getOutputStream());
			BufferedReader in = new BufferedReader(new InputStreamReader(is));
			String line;
			
			line = in.readLine();
			String request_method = line;
			
			line = "";
			int postDataI = -1;
			while ((line = in.readLine()) != null && (line.length() != 0)) {
				//System.out.println(line);
				if (line.indexOf("Content-Length:") > -1) {
					postDataI = new Integer(line.substring(line.indexOf("Content-Length:") + 16, line.length()))
							.intValue();
				}
			}

			String postData = "";
			if (postDataI > 0) {
				char[] charArray = new char[postDataI];
				in.read(charArray, 0, postDataI);
				postData = new String(charArray);
			}

			Query q = new Query(shortenString(request_method));
			String fullPath = q.getPath()+q.getPage();
			
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
	
	public String mimeType(String input) {
		for(Map.Entry<String, String> entry: map.entrySet()) {
			if(input.contains(entry.getKey())) {
				return entry.getValue();
			}
		}
		return "";
	}

	public String readFile(String filename) {
		String s = "";
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

	public String shortenString(String s) {
		String ret = s.substring(s.indexOf(" ")+2);
		ret = ret.substring(0, ret.indexOf("HTTP")-1);
		return ret;
	}
}