var login_page = '<form name="login" method="POST" action="">\
			<table>\
				<tr><td>Username</td><td><input title="Enter your username" type="text" id="login_username" required></td></tr>\
				<tr><td>Password</td><td><input title="Enter your password" type="password" id="login_password" required></td></tr>\
				<tr><td><input type="submit" id="login_submit" class="button button_submit" value="Entra"></td><td><input type="reset" class="button button_submit" value="Cancella"></td></tr>\
			</table>\
			<a href="#" id="register_link" onclick="showPage(\'login_register\',\'register\')">Se non sei registrato, registrati!</a>\
		</form>';

var register_page = '<form name="register" method="POST" action="">\
			<table>\
				<tr><td>Username</td><td><input title="Enter your username" type="text" id="register_username" required></td></tr>\
				<tr><td>Password</td><td><input title="Enter your password" type="password" id="register_password" required></td></tr>\
				<tr><td>Ripeti password</td><td><input title="Repeat the password" type="password" id="register_repeat_password" onchange="checkPassword()" required></td></tr>\
				<tr><td>E-Mail</td><td><input title="Enter your email" type="email" id="register_email" required></td></tr>\
				<tr><td>Università</td><td><input title="Enter your university name" type="text" id="register_university" required></td></tr>\
				<tr><td><input type="submit" id="register_submit" class="button button_submit" value="Registrati"></td><td><input type="reset" class="button button_submit" value="Cancella"></td></tr>\
			</table>\
			<a href="#" id="login_link" onclick="showPage(\'login_register\',\'login\')">Se sei già registrato, loggati!</a>\
		</form>';

function getToday() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10){
	        dd='0'+dd;
	} 
	if(mm<10){
	    mm='0'+mm;
	} 

	today = yyyy+'-'+mm+'-'+dd;
	return today;
}

function setTitle(title) {document.title = title;}
function setDateMax(today) {document.getElementById("exam_date").setAttribute("max", today);}
function setDateDefault(today) {document.getElementById("exam_date").value = today;}

/* On body load, set maxium (and default) date of the exam_date field and the title of the page */
function loadingExamPage() {
	var today = getToday();
	var title = "CFU Book";
	setTitle(title);
	setDateMax(today);
	setDateDefault(today);
}

/* Check if exam grade is == 30, then show praise radio buttons */
function showPraise() {
	var td_grade = document.getElementById("td_grade");
	var grade = document.getElementById("exam_grade");
	if(grade.value == "30") {
		td_grade.style.visibility = "visible";
	}
	else {
		td_grade.style.visibility = "collapse";
	}
}

/* Reset function for exam fields */
function resetExamFields() {
	var today = getToday();
	setDateDefault(today);
	var grade = document.getElementById("exam_grade");
	grade.value = "18";
	var td_grade = document.getElementById("td_grade");
	td_grade.style.visibility = "collapse";
	var exam_cfu = document.getElementById("exam_cfu");
	exam_cfu.value = "6";
}

/* Show login or register HTML */
function showPage(id, page) {
	if (page == "login") document.getElementById(id).innerHTML = login_page;
	else if (page == "register") document.getElementById(id).innerHTML = register_page;
}

/* Function for showing FAQS */
function showQuestion(id) {
	var elem = document.getElementById(id);
	if (elem.style.visibility == "visible") {
		elem.style.visibility = "collapse";
		elem.style.display = "none";
	}
	else {
		elem.style.visibility = "visible";
		elem.style.display = "block";
	}
}

function checkPassword() {
	if (document.getElementById("register_password").value != document.getElementById("register_repeat_password").value) {
		alert("Password non uguali");
	} 
}

function showSampleChart() {
	var ctx = document.getElementById("user_chart");
		new Chart(ctx,{"type":"doughnut","data":{"labels":["Red","Blue","Yellow"],"datasets":[{"label":"My First Dataset","data":[300,50,100],"backgroundColor":["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"]}]}});
}