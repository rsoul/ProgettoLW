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
	var add_exam_date = document.getElementById("inputAddDate");
	var edit_exam_date = document.getElementById("inputEditDate");
	add_exam_date.setAttribute("max", today);
	add_exam_date.value = today;
	edit_exam_date.setAttribute("max", today);

	var add_calendar_date = document.getElementById("inputAddDateCalendar");
	var edit_calendar_date = document.getElementById("inputEditDateCalendar");
	add_calendar_date.setAttribute("min", today);
	edit_calendar_date.setAttribute("min", today);
	add_calendar_date.value = today;

	return true;
}

/* CHECK IF HAVE TO SHOW PRAISE RADIO BUTTON (GRADE == 30) ON ADDEXAM */
function showAddPraise() {
	var add_exam_grade = document.getElementById("inputAddGrade").value;
	var add_exam_praise_div = document.getElementById("praiseAddDiv");
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
function showEditPraise() {
	var edit_exam_grade = document.getElementById("inputEditGrade");
	var edit_exam_praise_div = document.getElementById("praiseEditDiv");
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
					"data":[300,50,100],
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
function editingExam(code, date, grade, cfu) {
	document.getElementById("inputEditCode").value = code;
	document.getElementById("inputEditDate").value = date;
	if (grade == 31) {
		document.getElementById("inputEditGrade").value = "30";
		document.getElementById("inputEditPraiseYes").checked = true;
		document.getElementById("praiseEditDiv").style.visibility = "visible";
		document.getElementById("praiseEditDiv").style.display = "block";
	}
	else {
		document.getElementById("inputEditGrade").value = grade;
		document.getElementById("inputEditPraiseNo").checked = true;
		document.getElementById("praiseEditDiv").style.visibility = "collapse";
		document.getElementById("praiseEditDiv").style.display = "none";
	}
	document.getElementById("inputEditCFU").value = cfu;
}

/* SHOW FIELDS OF THE EXAM WHICH IS BEING EDITED */
function editingEvent(name, date, time) {
	document.getElementById("inputEditName").value = name;
	document.getElementById("inputEditDateCalendar").value = date;
	document.getElementById("inputEditTime").value = time;
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

function checkDateMin(date) {
	if (dateDiffInDays(new Date(getToday()), date) < 0) return false;
	return true;
}

function checkDateMax(date) {
	if (dateDiffInDays(new Date(getToday()), date) > 0) return false;
	return true;
}