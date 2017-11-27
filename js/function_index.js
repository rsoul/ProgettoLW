/* -------------- */
/* UTIL FUNCTIONS */
/* -------------- */

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


/* --------------- */
/* ON LOAD METHODS */
/* --------------- */

/* INITIALIZE DASHBOARD SETTING ADDEXAM, EDITEXAM, ADDCALENDAREVENT AND EDITCALENDAREVENT (date default, max, min) */
function initDashboard() {
	var today = getToday();
	loadAddCalendar(today);
	loadAddExam(today);
	loadEditCalendar(today);
	loadEditExam(today);

	checkStorageCFU();
	initStorageExams();
	initStorageCalendar();
	return true;
}

/* LOADING CALENDAR ADD */
function loadAddCalendar(today) {
	var add_calendar_date = $("#calendarAddDate");
	add_calendar_date.attr("min", today);
	add_calendar_date.val(today);
}

/* LOADING CALENDAR EDIT */
function loadEditCalendar(today) {
	var edit_calendar_date = $("#calendarEditDate");
	edit_calendar_date.attr("min", today);
}

/* LOADING EXAM ADD */
function loadAddExam(today) {
	var add_exam_date = $("#examAddDate");
	add_exam_date.attr("max", today);
	add_exam_date.val(today);
	
}

/* LOADING EXAM EDIT */
function loadEditExam(today) {
	var edit_exam_date = $("#examEditDate");
	edit_exam_date.attr("max", today);
}

/* ------------------------------- */


/* SHOW FIELDS OF THE --EDIT EXAM-- */
function initEditExam(code, date, grade, cfu) {
	$("#examEditCode").val(code);
	$("#examEditDate").val(date);
	if (grade == 31) {
		$("#examEditGrade").val("30");
		$("#examEditPraiseYes").prop("checked", true);
		$("#examEditPraiseDiv").css("visibility", "visible");
		$("#examEditPraiseDiv").css("display", "block");
	}
	else {
		$("#examEditGrade").val(grade);
		$("#examEditPraiseNo").prop("checked", true);
		if (grade == 30) {
			$("#examEditPraiseDiv").css("visibility", "visible");
			$("#examEditPraiseDiv").css("display", "block");
		}
		else {
			$("#examEditPraiseDiv").css("visibility", "collapse");
			$("#examEditPraiseDiv").css("display", "none");
		}
	}
	$("#examEditCFU").val(cfu);
	hideAlert("examEditAlert");
}

/* SHOW FIELDS OF THE --EDIT EVENT-- */
function initEditEvent(name, date, time) {
	$("#calendarEditName").val(name);
	$("#calendarEditDate").val(date);
	$("#calendarEditTime").val(time);
	hideAlert("calendarEditAlert");
}

/* RESET --ADD EXAM-- FIELDS (NOT EDIT EXAM FIELDS) */
function resetAddExamFields() {
	$("#examAddCode").val("");
	$("#examAddDate").val(getToday());
	$("#examAddGrade").val("");
	$("#examAddPraiseDiv").css("visibility", "collapse");
	$("#examAddPraiseDiv").css("display", "none");
	$("#examAddPraiseNo").attr("checked", true);
	$("#examAddCFU").val("");
	hideAlert("examAddAlert");
	$("#examAddCode").select();
}

/* RESET --ADD EVENT-- FIELDS (NOT EDIT EVENT FIELDS) */
function resetAddEventFields() {
	$("#calendarAddName").val("");
	$("#calendarAddDate").val(getToday());
	$("#calendarAddTime").val("");
	hideAlert("calendarAddAlert");
	$("#calendarAddName").select();
}

/* CHECK IF HAVE TO SHOW PRAISE RADIO BUTTON (GRADE == 30) ON --ADD EXAM-- */
function showAddExamPraise() {
	var add_exam_grade = $("#examAddGrade").val();
	var add_exam_praise_div = $("#examAddPraiseDiv");
	if(add_exam_grade == "30") {
		add_exam_praise_div.css("visibility", "visible");
		add_exam_praise_div.css("display", "block");
	}
	else {
		add_exam_praise_div.css("visibility", "collapse");
		add_exam_praise_div.css("display", "none");
	}
	return true;
}

/* CHECK IF HAVE TO SHOW PRAISE RADIO BUTTON (GRADE == 30) ON --EDIT EXAM-- */
function showEditExamPraise() {
	var edit_exam_grade = $("#examEditGrade");
	var edit_exam_praise_div = $("#examEditPraiseDiv");
	if(edit_exam_grade.val() == "30") {
		edit_exam_praise_div.css("visibility", "visible");
		edit_exam_praise_div.css("display", "block");
	}
	else {
		edit_exam_praise_div.css("visibility", "collapse");
		edit_exam_praise_div.css("display", "none");
	}
	return true;
}

/* SET THE PROGRESS BAR WITH THE PERCENT */
function getPercentageCFU(){
	var takenCFU = getProgress();
	var totalCFU = parseInt(localStorage.getItem("CFU"));
	var percentageCFU = Math.floor((takenCFU * 100)/totalCFU);
	var progressBar = $("#progressBar");
	if(percentageCFU > 100) percentageCFU = 100;
	progressBar.css("width", percentageCFU + "%");
	if (percentageCFU>3){
	progressBar.html(percentageCFU + "%");}
	progressBar.attr("aria-valuenow", percentageCFU);
	return true;
}


/* CREATE AND SHOW A SAMPLCE CHART ON THE INDEX HTML */
function showSampleChart() {
	var ctx = $("#user_chart");
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

/* PERSONALIZED BOOTSTRAP ALERT WITH ELEMENT WHERE ALERT, WHERE THE TEXT IS IN AND THE TEXT TO BE WRITTEN */
function showAlert(elem_alert, elem_alert_text, s){
	$("#" + elem_alert).css("visibility", "visible");
	$("#" + elem_alert_text).text(s);
}

/* HIDE ALERT ON CLOSE CLICK */


function hideAlert(elem_alert) {
	$("#" + elem_alert).css("visibility", "hidden");
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

/* CHECK EVENT NAME */
function checkName(name) {
	if (name != "") return true;
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
	var email = $("#registerEmail");
	var password = $("#registerPassword");
	var repeat_password = $("#registerRepeatPassword");
	var university = $("#registerUniversity");
	var course = $("#registerCourse");

	var email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email_regex.test(email.val())) {
		alert("Email non valida!");
		return false;
	}

	var password_regex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/;
	if (!password_regex.test(password.val())) {
		alert("Password non valida!");
		return false;
	}

	if (password.val() != repeat_password.val()) {
		alert("Passowrd differenti");
		return false;
	}
	
	if (university.val() == "") {
		alert("Inserisci l'università!");
		return false;
	}

	if (course.val() == "") {
		alert("Inserisci il corso");
		return false;
	}

	return true;
}

/* SMALL CHECK FOR LOGIN FIELDS */
function checkLogin() {
	var email = $("#loginEmail");
	var password = $("#loginPassword");

	if (email.val() == "") {
		alert("Inserisci l'email!");
		return false;
	}

	if (password.val() == "") {
		alert("Inserisci la password!");
		return false;
	}

	return true;
}

/* SHOW INPUT CFU BUTTON IF THE CFU LOCAL STORAGE ISN'T INITIALIZED, ELSE HIDE BUTTON AND SHOW PROGRESS BAR AND ADD EXAM BUTTON */
function checkStorageCFU() {
	if(localStorage.getItem("CFU") != null) {
		$("#initCourseCFUDiv").hide();
		$("#mainAddExamButton").show();
		$("#progressBar").show();
		getPercentageCFU();
	}
	else {
		$("#initCourseCFUDiv").show();
		$("#mainAddExamButton").hide();	
		$("#progressBar").hide();
	}
}