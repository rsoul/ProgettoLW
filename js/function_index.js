/* GET TODAY DATE YYYY-MM-DD */
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

/* INITIALIZE DASHBOARD SETTING ADDEXAM, EDITEXAM, ADDCALENDAREVENT AND EDITCALENDAREVENT (date default, max, min) */
function initDashboard() {
	var today = getToday();
	var add_exam_date = document.getElementById("examAddDate");
	var edit_exam_date = document.getElementById("examEditDate");
	add_exam_date.setAttribute("max", today);
	add_exam_date.value = today;
	edit_exam_date.setAttribute("max", today);

	var add_calendar_date = document.getElementById("calendarAddDate");
	var edit_calendar_date = document.getElementById("calendarEditDate");
	add_calendar_date.setAttribute("min", today);
	edit_calendar_date.setAttribute("min", today);
	add_calendar_date.value = today;

	initStorageCFU();
	initStorageCalendar();
	initStorageExams();

	return true;
}

/* CHECK IF HAVE TO SHOW PRAISE RADIO BUTTON (GRADE == 30) ON ADDEXAM */
function showAddExamPraise() {
	var add_exam_grade = document.getElementById("examAddGrade").value;
	var add_exam_praise_div = document.getElementById("examAddPraiseDiv");
	if(add_exam_grade == "30") {
		add_exam_praise_div.style.visibility = "visible";
		add_exam_praise_div.style.display = "block";
	}
	else {
		add_exam_praise_div.style.visibility = "collapse";
		add_exam_praise_div.style.display = "none";
	}
	return true;
}

/* CHECK IF HAVE TO SHOW PRAISE RADIO BUTTON (GRADE == 30) ON EDITEXAM */
function showEditExamPraise() {
	var edit_exam_grade = document.getElementById("examEditGrade");
	var edit_exam_praise_div = document.getElementById("examEditPraiseDiv");
	if(edit_exam_grade.value == "30") {
		edit_exam_praise_div.style.visibility = "visible";
		edit_exam_praise_div.style.display = "block";
	}
	else {
		edit_exam_praise_div.style.visibility = "collapse";
		edit_exam_praise_div.style.display = "none";
	}
	return true;
}

/* CREATE AND SHOW A SAMPLCE CHART ON THE INDEX HTML */
function showSampleChart() {
	var ctx = document.getElementById("user_chart");
		new Chart(ctx,
			{"type":"doughnut",
			"data":{
				"labels": ["Esami Passati","Esami Mancanti","Idoneità"],
				"datasets":[{
					"label":"Dataset",
					"data":[18,3,2],
					"backgroundColor":[
						"rgb(255, 99, 132)",
						"rgb(54, 162, 235)",
						"rgb(255, 205, 86)"
					]
				}]
			}
		});
	return true;
}

/* SHOW FIELDS OF THE EXAM WHICH IS BEING EDITED */
function initEditExam(code, date, grade, cfu) {
	document.getElementById("examEditCode").value = code;
	document.getElementById("examEditDate").value = date;
	if (grade == 31) {
		document.getElementById("examEditGrade").value = "30";
		document.getElementById("examEditPraiseYes").checked = true;
		document.getElementById("examEditPraiseDiv").style.visibility = "visible";
		document.getElementById("examEditPraiseDiv").style.display = "block";
	}
	else {
		document.getElementById("examEditGrade").value = grade;
		document.getElementById("examEditPraiseNo").checked = true;
		document.getElementById("examEditPraiseDiv").style.visibility = "collapse";
		document.getElementById("examEditPraiseDiv").style.display = "none";
	}
	document.getElementById("examEditCFU").value = cfu;
}

/* SHOW FIELDS OF THE EXAM WHICH IS BEING EDITED */
function initEditEvent(name, date, time) {
	document.getElementById("calendarEditName").value = name;
	document.getElementById("calendarEditDate").value = date;
	document.getElementById("calendarEditTime").value = time;
}

/* GENERATES RANDOM DATA FOR PRESENTATION INSTEAD OF MANUALLY INPUTTING IT*/
function generateRandomData(n,ex,ev){
	/*
	int n = number of data you want to generate
	bool ex = true if you want to generate exams
	bool ev = true if you want to generate calendar events*/
	if(ex){
		for(i=0;i<n;i++){
			addExam(i+1 ,"2001/01/01",Math.floor(Math.random() * (30 - 18) ) + 18,"no",Math.floor(Math.random() * (24 - 2) ) + 2);
		}
	}
	if(ev){
		for(i=0;i<n;i++){
			addCalendarEvent(i+1,getToday(),"21:00");
		}
	}
	/*lo so che la generazione della data e dell'ora fanno schifo ma è davvero lavoro sprecato*/
}

/* GET A SUM OF ALL CFU TAKEN */
function getProgress(){
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var progress = 0;
	for (i=0; i<len; i++) progress += parseInt(exams[i].cfu);
	return progress;
}

function getPercentageCFU(){
	var takenCFU = getProgress();
	var totalCFU = parseInt(localStorage.getItem("CFU"));
	var percentageCFU = Math.floor((takenCFU * 100)/totalCFU);
	var progressBar = document.getElementById("progressBar");
	if(percentageCFU > 100) percentageCFU = 100;
	progressBar.style.width = percentageCFU + "%";
	progressBar.innerHTML = percentageCFU + "%";
	progressBar.setAttribute("aria-valuenow", percentageCFU);
	return true;
}

/* RESET ADD EXAM FIELDS (NOT EDIT EXAM FIELDS) */
function resetAddExamFields() {
	document.getElementById("examAddCode").value = "";
	document.getElementById("examAddDate").value = getToday();
	document.getElementById("examAddGrade").value = "";
	document.getElementById("examAddCFU").value = "";
}

/* RESET ADD EVENT FIELDS (NOT EDIT EVENT FIELDS) */
function resetAddEventFields() {
	document.getElementById("calendarAddName").value = "";
	document.getElementById("calendarAddDate").value = getToday();
	document.getElementById("calendarAddTime").value = "";
}



/* ---------------------------------------- */
/* FUNZIONI PER CONTROLLI O CHECK VARI      */
/* ---------------------------------------- */

/* CHECK FOR EXAM (KEY code) */
function sameExam(a,b){
	if (a.code==b.code)
		return true;
	return false;
}

/* CHECK FOR EVENT (KEY name) */
function sameEvent(a,b) {
	if (a.name==b.name) 
		return true;
	return false;
}

/* CHECK EXAM CODE */
function checkCode(code) {
	if (code != "") return true;
	else return false;
}

/* CHECK IF INPUT DATE IS VALID (DON'T CHECK IF IS > OR < OF TODAY!) */
function checkDate(date) {
	var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

	if (isNaN(day) || isNaN(month) || isNaN(year)) {
		return false;
	}

	if (day < 1 || year < 1)
		return false;
	if(month>11||month<0)
   		return false;
	if ((month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) && day > 31)
    	return false;
	if ((month == 3 || month == 5 || month == 8 || month == 10 ) && day > 30)
    	return false;
	if (month == 1) {
    	if (((year % 4) == 0 && (year % 100) != 0) || ((year % 400) == 0 && (year % 100) == 0)) {
			if (day > 29)
				return false;
		} else {
			if (day > 28)
				return false;
		}      
	}
	return true;
}

/* CHECK IF EXAM GRADE IS VALID */
function checkGrade(grade) {
	if (isNaN(grade) || grade < 18 || grade > 30) {return false;}
	return true;
}

/* CHECK IF EXAM CFU IS VALID */
function checkCFU(cfu) {
	if (!isNaN(cfu)) {
		if (cfu >= 1 && cfu <= 24) {
			return true;
		}
	}
	return false;
}

/* (FOR INPUT STORAGE) RETURN GRADE VALUE (IF 30 WITH PRAISE -> 31) */
function getGrade(grade, praise) {
	if (grade == 30 && praise == "praise_yes") return 31;
	else return grade;
}

/* CALCULATE DATE DISTANCE (<0 IF B COME BEFORE A) */
function dateDiffInDays(a, b) {
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;
	a = new Date(a);
	b = new Date(b);
	var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

/* CHECK IF DATE EVENT IS VALID */
function checkDateMin(date) {
	if (dateDiffInDays(new Date(getToday()), date) < 0) return false;
	return true;
}

/* CHECK IF DATE EXAM IS VALID */
function checkDateMax(date) {
	if (dateDiffInDays(new Date(getToday()), date) > 0) return false;
	return true;
}

/* CHECK IF ALL FIELDS ON REGISTER FORM ARE VALID */
function checkRegister() {
	var email = document.getElementById("registerEmail");
	var password = document.getElementById("registerPassword");
	var repeat_password = document.getElementById("registerRepeatPassword");
	var university = document.getElementById("registerUniversity");
	var course = document.getElementById("registerCourse");

	var email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email_regex.test(email.value)) {
		alert("Email non valida!");
		email.focus;
		return false;
	}

	var password_regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
	if (!password_regex.test(password.value)) {
		alert("Password non valida!");
		password.focus;
		return false;
	}

	if (password.value != repeat_password.value) {
		alert("Passowrd differenti");
		repeat_password.focus;
		return false;
	}
	
	if (university.value == "") {
		alert("Inserisci l'università!");
		university.focus;
		return false;
	}

	if (course.value == "") {
		alert("Inserisci il corso");
		course.focus;
		return false;
	}

	return true;
}