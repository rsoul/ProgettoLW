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

/* Set date default and max on add_exam html form */
function setExamDate(today) {
	exam_date = document.getElementById("exam_date");
	exam_date.setAttribute("max", today);
	exam_date.value = today;
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
	var code = document.getElementById("exam_code");
	code.value = "";
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
		new Chart(ctx,
			{"type":"doughnut",
			"data":{
				"labels": ["Red","Blue","Yellow"],
				"datasets":[{
					"label":"My First Dataset",
					"data":[300,50,100],
					"backgroundColor":[
						"rgb(255, 99, 132)",
						"rgb(54, 162, 235)",
						"rgb(255, 205, 86)"
					]
				}]
			}
		});
}