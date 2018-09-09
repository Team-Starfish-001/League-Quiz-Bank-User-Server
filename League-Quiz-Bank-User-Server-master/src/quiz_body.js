var qbody;
var qButts;
var qPanes;

var template;

var questions = [];

var idctr = 0;
var totalQuestions = 0;

function Question(){
	this.type;
	this.answerDiv;
	this.question;
	this.totalChoices = 0;
	this.choices = [];
	this.answers = [];
}

window.onload = function(){
	qbody = document.getElementById("questionBody");

	qPanes = document.createElement("div");
	qButts = document.createElement("div");
	qbody.appendChild(qPanes);
	qbody.appendChild(qButts);

	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "./quiz_template.html", true);
    xmlHttp.send();
    xmlHttp.onreadystatechange = function() {
    	if(xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200) {
    		template = xmlHttp.responseText;
 		}
   	}

	qButts.innerHTML += "<button onclick='addMultipleAnswerQuestion()'>Add Multiple Answer Question</button>";
	qButts.innerHTML += "<button onclick='addSingleAnswerQuestion()'>Add Single Answer Question</button>";
	qButts.innerHTML += "<button onclick='addFillInQuestion()'>Add Fill-In Question</button>";
	qButts.innerHTML += "<br><hr size='3'><br>";
	qButts.innerHTML += "<button onclick='submitQuiz()'>Submit Quiz and Download</button>";
}

function rebuildQuiz(){
	qPanes.innerHTML = "";
	idctr = 0;
	totalQuestions = 0;
	var qdiv = document.createElement("div");
	qdiv.id = "qdiv" + idctr++;

	for(var i = 0; i < questions.length; i++){
		var q = questions[i];
		if(q.type == "MULT_ANS"){
			qdiv.innerHTML += "Question " + ++totalQuestions + ": ";
			qdiv.innerHTML += "<button onclick='removeQuestion("+(totalQuestions - 1)+")'>remove</button><br>";
			
			qdiv.innerHTML += "<textarea id='maques"+(totalQuestions - 1)+"' class='qbox' rows='10' cols='60'>"+q.question+"</textarea><br>";
			
			var adiv = document.createElement("div");
			adiv.id = "answer" + (totalQuestions - 1);

			for(var j = 0; j < q.choices.length; j++){
				if(q.answers.includes(j)){
					adiv.innerHTML += String.fromCharCode("A".charCodeAt(0) + j) + "<input type='checkbox' checked></input>";
				}else{				
					adiv.innerHTML += String.fromCharCode("A".charCodeAt(0) + j) + "<input type='checkbox'></input>";
				}				
				adiv.innerHTML += "<textarea id='ma"+(totalQuestions - 1)+"ans"+j+"' rows='5' cols='40'>"+q.choices[j]+"</textarea>";
				adiv.innerHTML += "<button onclick='removeChoice("+(totalQuestions - 1)+", "+j+")'>x</button><br>";

		
				qdiv.appendChild(adiv);
			}

			qdiv.innerHTML += "<button onclick='addChoice("+(totalQuestions - 1)+")'>add another choice</button><br>";
			qdiv.innerHTML += "<hr size='3'>";
			qPanes.appendChild(qdiv);
		}else if(q.type == "SING_ANS"){
			qdiv.innerHTML += "Question " + ++totalQuestions + ": ";
			qdiv.innerHTML += "<button onclick='removeQuestion("+(totalQuestions - 1)+")'>remove</button><br>";
			
			qdiv.innerHTML += "<textarea id='saques"+(totalQuestions - 1)+"' class='qbox' rows='10' cols='60'>"+q.question+"</textarea><br>";
			
			var adiv = document.createElement("div");
			adiv.id = "answer" + (totalQuestions - 1);

			for(var j = 0; j < q.choices.length; j++){
				if(q.answers == j){
					adiv.innerHTML += String.fromCharCode("A".charCodeAt(0) + j) + "<input type='radio' name='ans"+(totalQuestions - 1)+"' checked></input>";
				}else{
					adiv.innerHTML += String.fromCharCode("A".charCodeAt(0) + j) + "<input type='radio' name='ans"+(totalQuestions - 1)+"'></input>";
				}
				
				adiv.innerHTML += "<textarea id='sa"+(totalQuestions - 1)+"ans"+j+"' rows='5' cols='40'>"+q.choices[j]+"</textarea>";
				adiv.innerHTML += "<button onclick='removeChoice("+(totalQuestions - 1)+", "+j+")'>x</button><br>";

		
				qdiv.appendChild(adiv);
			}

			qdiv.innerHTML += "<button onclick='addChoice("+(totalQuestions - 1)+")'>add another choice</button><br>";
			qdiv.innerHTML += "<hr size='3'>";
			qPanes.appendChild(qdiv);
		}else if(q.type == "FILL_IN"){
			qdiv.innerHTML += "Question " + ++totalQuestions + ": ";
			qdiv.innerHTML += "<button onclick='removeQuestion("+(totalQuestions - 1)+")'>remove</button><br>";
			qdiv.innerHTML += "<textarea id='fiques"+(totalQuestions - 1)+"' class='qbox' rows='10' cols='60'>"+q.question+"</textarea><br>";

			var adiv = document.createElement("div");
			adiv.id = "answer" + (totalQuestions - 1);

			adiv.innerHTML += "ANSWER <textarea id='fians"+(totalQuestions - 1)+"' rows='5' cols='40'>"+q.answers+"</textarea>";

		
			qdiv.appendChild(adiv);
			qdiv.innerHTML += "<hr size='3'>";
			qPanes.appendChild(qdiv);
		}
	}
}

function saveQuizState(){
	questions = [];
	
	var tbxs = qPanes.getElementsByTagName("textarea");
	var inpts = qPanes.getElementsByTagName("input");
	var rbtns = sortInputs(inpts, "radio");
	var cbxs = sortInputs(inpts, "checkbox");

	var cbCtr = 0;
	var rbCtr = 0;
	
	for(var i = 0; i < tbxs.length; i++){
		var id = tbxs[i].id;
		if(id.includes("maques")){
			var q = new Question();
			q.type = "MULT_ANS";
			q.question = tbxs[i].value;
			
			var an = tbxs[++i];
			while(an.id.toString().includes("ans")){
				q.choices.push(an.value);
				q.totalChoices++;
				
				if(!cbxs[cbCtr]) break;
				if(cbxs[cbCtr].checked){
					q.answers.push(q.totalChoices - 1);
				}
				cbCtr++;
				if(!tbxs[++i]) break;
				an = tbxs[i];
			}
			questions.push(q);
			i--;
		}else if(id.includes("saques")){
			var q = new Question();
			q.type = "SING_ANS";
			q.question = tbxs[i].value;

			var an = tbxs[++i];
			while(an.id.toString().includes("ans")){
				q.choices.push(an.value);
				q.totalChoices++;
				if(!rbtns[rbCtr]) break;
				if(rbtns[rbCtr].checked){
					q.answers = q.totalChoices - 1;
				}
				rbCtr++;
				if(!tbxs[++i]) break;
				an = tbxs[i];
			}
			questions.push(q);
			i--;
		}else if(id.includes("fiques")){
			var q = new Question();
			q.type = "FILL_IN";
			q.question = tbxs[i].value;
			q.answers = tbxs[++i].value;
			questions.push(q);
		}	
	}

	//printQuestions();
}

function removeQuestion(number){
	saveQuizState();
	questions.splice(number, 1);
	rebuildQuiz();
}

function removeChoice(q, num){
	saveQuizState();
	
	if(questions[q].choices.length <= 1) return;

	questions[q].choices.splice(num, 1);
	questions[q].totalChoices--;
	rebuildQuiz();
}

function addChoice(qnum){
	saveQuizState();
	rebuildQuiz();	

	var q = questions[qnum];
	var dv = document.getElementById("answer" + qnum);
	var a = String.fromCharCode("A".charCodeAt(0) + q.totalChoices++);
	
	if(q.type == "MULT_ANS"){
		dv.innerHTML += a + " <input type='checkbox'></input>";
		dv.innerHTML += "<textarea id='ma"+qnum+"ans"+(q.totalChoices - 1)+"' rows='5' cols='40'></textarea>";
		dv.innerHTML += "<button onclick='removeChoice("+qnum+", "+(q.totalChoices - 1)+")'>x</button><br>";
	}else if(q.type == "SING_ANS"){
		dv.innerHTML += a + " <input type='radio' name='ans"+qnum+"'></input>";
		dv.innerHTML += "<textarea id='sa"+qnum+"ans"+(q.totalChoices - 1)+"' rows='5' cols='40'></textarea>";
		dv.innerHTML += "<button onclick='removeChoice("+qnum+", "+(q.totalChoices - 1)+")'>x</button><br>";
	}
}

function addMultipleAnswerQuestion(){
	var q = new Question();
	q.type = "MULT_ANS";
	q.totalChoices = 1;
	
	var qdiv = document.createElement("div");

	qdiv.id = "qdiv" + idctr++;
	qdiv.innerHTML = "Question " + ++totalQuestions + ": ";
	qdiv.innerHTML += "<button onclick='removeQuestion("+(totalQuestions - 1)+")'>remove</button><br>";
	qdiv.innerHTML += "<textarea id='maques"+(totalQuestions - 1)+"' class='qbox' rows='10' cols='60'></textarea><br>";

	var adiv = document.createElement("div");
	adiv.id = "answer" + (totalQuestions - 1);

	adiv.innerHTML += "A <input type='checkbox'></input>";
	adiv.innerHTML += "<textarea id='ma"+(totalQuestions - 1)+"ans0' rows='5' cols='40'></textarea>";
	adiv.innerHTML += "<button onclick='removeChoice("+(totalQuestions - 1)+", 0)'>x</button><br>";

		
	qdiv.appendChild(adiv);

	qdiv.innerHTML += "<button onclick='addChoice("+(totalQuestions - 1)+")'>add another choice</button><br>";
	qdiv.innerHTML += "<hr size='3'>";
	qPanes.appendChild(qdiv);

	questions.push(q);
}

function addSingleAnswerQuestion(){
	var q = new Question();
	q.type = "SING_ANS";
	q.totalChoices = 1;
	
	var qdiv = document.createElement("div");

	qdiv.id = "qdiv" + idctr++;
	qdiv.innerHTML = "Question " + ++totalQuestions + ": ";
	qdiv.innerHTML += "<button onclick='removeQuestion("+(totalQuestions - 1)+")'>remove</button><br>";
	qdiv.innerHTML += "<textarea id='saques"+(totalQuestions - 1)+"' class='qbox' rows='10' cols='60'></textarea><br>";

	var adiv = document.createElement("div");
	adiv.id = "answer" + (totalQuestions - 1);

	adiv.innerHTML += "A <input type='radio' name='ans"+(totalQuestions - 1)+"'></input>";
	adiv.innerHTML += "<textarea id='sa"+(totalQuestions - 1)+"ans0' rows='5' cols='40'></textarea>";
	adiv.innerHTML += "<button onclick='removeChoice("+(totalQuestions - 1)+", 0)'>x</button><br>";

		
	qdiv.appendChild(adiv);

	qdiv.innerHTML += "<button onclick='addChoice("+(totalQuestions - 1)+")'>add another choice</button><br>";
	qdiv.innerHTML += "<hr size='3'>";
	qPanes.appendChild(qdiv);

	questions.push(q);
}

function addFillInQuestion(){
	var q = new Question();
	q.type = "FILL_IN";
	
	var qdiv = document.createElement("div");

	qdiv.id = "qdiv" + idctr++;
	qdiv.innerHTML = "Question " + ++totalQuestions + ": ";
	qdiv.innerHTML += "<button onclick='removeQuestion("+(totalQuestions - 1)+")'>remove</button><br>";
	qdiv.innerHTML += "<textarea id='fiques"+(totalQuestions - 1)+"' class='qbox' rows='10' cols='60'></textarea><br>";

	var adiv = document.createElement("div");
	adiv.id = "answer" + (totalQuestions - 1);

	adiv.innerHTML += "ANSWER <textarea id='fians"+(totalQuestions - 1)+"' rows='5' cols='40'></textarea>";

		
	qdiv.appendChild(adiv);

	qdiv.innerHTML += "<hr size='3'>";
	qPanes.appendChild(qdiv);

	questions.push(q);
}

function specialParseStr(str){
	var nstr = "";
	for(var i = 0; i < str.length; i++){
		var c = str.charAt(i);
		if(c == '\"'){
			nstr += "\\\"";
		}else if(c == '<'){
			nstr += "&lt";
		}else if(c == '\n' || c == ' '){
			
		}else{
			nstr += c;
		}
	}
	return nstr;
}

function parseStr(str){
	var nstr = "";
	for(var i = 0; i < str.length; i++){
		var c = str.charAt(i);
		if(c == '\n'){
			nstr += "<br>"	
		}else if(c == '\"'){
			nstr += "\\\"";
		}else if(c == ' '){
			nstr += "&nbsp";	
		}else if(c == '\t'){
			nstr += "&nbsp&nbsp&nbsp&nbsp";
		}else if(c == '<'){
			nstr += "&lt";
		}else{
			nstr += c;
		}
	}
	return nstr.trim();
}

function buildQuestionString(){
	var qs = "";
	
	for(var i = 0; i < questions.length; i++){
		var q = questions[i];		
		if(q.type == "MULT_ANS"){
			qs += "questions["+i+"] = new Question();\n";
			qs += "questions["+i+"].number="+(i+1)+";\n";
			qs += "questions["+i+"].type=\"MULT_ANS\";\n";
			qs += "questions["+i+"].question=\""+parseStr(q.question)+"\";\n";
			for(var j = 0; j < q.choices.length; j++){
				qs += "questions["+i+"].choices["+j+"]=\""+parseStr(q.choices[j])+"\";\n";
			}
			for(var j = 0; j < q.answers.length; j++){
				qs += "questions["+i+"].correctAnswers["+j+"]="+q.answers[j]+";\n";
			}
		}else if(q.type == "SING_ANS"){
			qs += "questions["+i+"] = new Question();\n";
			qs += "questions["+i+"].number="+(i+1)+";\n";
			qs += "questions["+i+"].type=\"SING_ANS\";\n";
			qs += "questions["+i+"].question=\""+parseStr(q.question)+"\";\n";
			for(var j = 0; j < q.choices.length; j++){
				qs += "questions["+i+"].choices["+j+"]=\""+parseStr(q.choices[j])+"\";\n";
			}
			qs += "questions["+i+"].correctAnswers="+q.answers+";\n";
			
		}else if(q.type == "FILL_IN"){
			qs += "questions["+i+"] = new Question();\n";
			qs += "questions["+i+"].number="+(i+1)+";\n";
			qs += "questions["+i+"].type=\"FILL_IN\";\n";
			qs += "questions["+i+"].question=\""+parseStr(q.question)+"\";\n";
			qs += "questions["+i+"].correctAnswers=\""+specialParseStr(q.answers.trim())+"\";\n";
		}
	}

	return qs;
}

function submitQuiz(){
	saveQuizState();
	
	var ttl = document.getElementById("title").value;
	
	template = template.replace("<!--@QUIZTITLE@-->", ttl);
	template = template.replace("/**@TOTALQUESTIONS@**/", questions.length);
	template = template.replace("/**@QUIZQUESTIONS@**/", buildQuestionString());	

	var element = document.createElement('a');
  	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(template));
  	element.setAttribute('download', ttl + ".html");
  	element.style.display = 'none';
  	document.body.appendChild(element);
  	element.click();
  	document.body.removeChild(element);
	
}

function sortInputs(inpts, type){
	var sz = inpts.length;
	var results = [];
	for(var i = 0; i < sz; i++){	
		if(type == inpts[i].type){
			results.push(inpts[i]);
		}else if(type == inpts[i].type){
			results.push(inpts[i]);
		}
	}
	return results;
}

function printQuestions(){
	for(var i = 0; i < questions.length; i++){
		console.log(questions[i].type);
		console.log(questions[i].question);
		console.log(questions[i].choices);
		console.log(questions[i].answers + "\n\n\n");
	}
}
