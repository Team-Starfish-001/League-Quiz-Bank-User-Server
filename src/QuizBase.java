import java.util.*;

public class QuizBase {
	
	ArrayList<HashMap<String, ArrayList<String>>> quizes;
	
	public QuizBase() {
		quizes = new ArrayList<HashMap<String, ArrayList<String>>>();
	}
	
	public void addQuiz(HashMap<String, ArrayList<String>> input) {
		quizes.add(input);
	}
	
	public ArrayList<HashMap<String, ArrayList<String>>> getAllQuizzes() {
		return quizes;
	}
	
	public ArrayList<String> getQuizzesFor(String username) {
		ArrayList<String> ret = new ArrayList<String>();
		for(int i = 0; i<quizes.size(); i++) {
			HashMap<String, ArrayList<String>> temp = quizes.get(i);
			for(Map.Entry<String, ArrayList<String>> entry: temp.entrySet()) {
				ArrayList<String> names = entry.getValue();
				for(int j = 0; j<names.size(); j++) {
					if(names.get(j).equals(username)) {
						ret.add(entry.getKey());
						break;
					}
				}
			}
		}
		
		return ret;
	}
}
