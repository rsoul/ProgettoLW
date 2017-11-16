/* Inizialize the exam storage */
function initStorageExams(){
	if (typeof(localStorage.exams) == "undefined") {
		localStorage.exams="[]";
	}
}

/* Inizialize the calendar storage */
function initStorageCalendar(){
	if (typeof(localStorage.calendar) == "undefined") {
		localStorage.calendar="[]";
	}
}

/* Reset all exams on the storage */
function resetStorageExams(){ 
	localStorage.exams="[]";
}

/* Reset all calendar events */
function resetStorageCalendar(){
	localStorage.calendar="[]";
}


/* Script insert exam on the local storage, after checking the validity of every field */
function insertExam(){
	var exam_code = document.getElementById("inputCode").value;
	var exam_date = new Date(document.getElementById("inputDate").value);
	var exam_grade = document.getElementById("inputGrade").value;
	var exam_praise = document.getElementById("inputPraise").value;
	var exam_cfu = document.getElementById("inputCFU").value;

	if (!checkCode(exam_code)) {
		alert("Codice esame non valido!");
		return false;
	}

	if (!checkDate(exam_date)) {
		alert("Data non valida!");
		return false;
	}
	if (!checkGrade(exam_grade, exam_praise)) {
		alert("Voto non valido!");
		return false;
	}
	if (!checkCFU(exam_cfu)) {
		alert("CFU non validi!");
		return false;
	}

	var exams = JSON.parse(localStorage.exams);
	var where = exams.length;	
	var obj = { code: exam_code,
				date: getExamDate(exam_date),
				grade: getGrade(exam_grade, exam_praise),
				cfu: exam_cfu
			};
	
	for (i=0; i<where; i++)
		if(sameExam(exams[i], obj)) {
			alert("Esame già presente!");
			return false;
		}

	exams[where] = obj;
	localStorage.exams = JSON.stringify(exams);
	return true;
}

function insertCalendarEvent(){
	var calendar = JSON.parse(localStorage.calendar);
	var len=calendar.length;
	var calendar_name = document.getElementById("inputName").value;
	var calendar_date = new Date(document.getElementById("inputDateCalendar").value);

	if (!checkDate(calendar_date)) {
		alert("Data non valida!");
		return false;
	}

	var obj={
		name: calendar_name,
		date: getExamDate(calendar_date)
	};
	
	for (i=0; i<len; i++)
		if(sameEvent(calendar[i], obj)) {
			alert("Evento già presente!");
			return false;
		}

	calendar[len]=obj;
	localStorage.calendar=JSON.stringify(calendar);
}

function sameExam(a,b){
	if (a.code==b.code)
		return true;
	return false;
}

function sameEvent(a,b) {
	if (a.name == b.name) 
		return true;
	return false;
}


function checkCode(code) {
	if (code != "") return true;
	else return false;
}

function checkDate(date) {
	var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();

	if (isNaN(day) || isNaN(month) || isNaN(year)) {
		return false;
	}
	if (day < 1 || year < 1)
		return false;
	if(month>12||month<1)
   		return false;
	if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day > 31)
    	return false;
	if ((month == 4 || month == 6 || month == 9 || month == 11 ) && day > 30)
    	return false;
	if (month == 2) {
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

function checkGrade(grade, praise) {
	if (isNaN(grade) || grade < 18 || grade > 30) {return false;}
	else if ((grade == 30 && praise != "praise_yes" && praise == "praise_no")) {
		return false;
	}
	return true;
}

function checkCFU(cfu) {
	if (!isNaN(cfu)) {
		if (cfu >= 1 && cfu <= 24) {
			return true;
		}
	}
	return false;
}

function getGrade(grade, praise) {
	if (grade == 30 && praise == "praise_yes") return 31;
	else return grade;
}

function getExamDate(date) {
	return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
}

/* Print all event on the calendar */
function printCalendar(){
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	var s = new String("");
	s += "<div style=\"text-align: center; padding-top:5px;\">"
	s += "<table class=\"table table-striped table-hover table-bordered\" border=\"1px\"><tr><th>Esame</th><th>Data</th><th>Giorni Mancanti</th></tr>";
	for (i=0; i<len; i++) {
		s += "<tr><td>" + calendar[i].name + "</td>";
			s += "<td>" + calendar[i].date + "</td>";
			s += "<td>rimanenti</td></tr>";
	}

	/*for (i=0; i<len; i++) {
		var remaining= Math.abs(calendar[i].date - getToday());
		if remaining<10{
			s += "<tr class=\"table-danger\"><td>" + calendar[i].name + "</td>";
			s += "<td class=\"table-danger\">" + calendar[i].date + "</td>";
			s += "<td class=\"table-danger\">" +remaining+ "</td></tr>";
		}
		else{
			s += "<tr><td>" + calendar[i].name + "</td>";
			s += "<td>" + calendar[i].date + "</td>";
			s += "<td>" +remaining+ "</td></tr>";
		}
	}*/
	s += "</table></div>";
	document.getElementById("my_calendar").innerHTML = s;
}

/* Print all the exam of the user on a div called my_exams */
function printExams(){
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var s = new String("");
	s += "<table class=\"table table-striped table-hover table-bordered\" border=\"1px\"><tr><th>Codice</th><th>Data</th><th>Voto</th><th>CFU</th></tr>";
	for (i=0; i<len; i++) {
		s += "<tr><td>" + exams[i].code + "</td>";
		s += "<td>" + exams[i].date + "</td>";
		
		s += "<td>";
		if (exams[i].grade == "31") s += "30 e Lode";
		else s += exams[i].grade;
		s += "</td>";

		s += "<td>" + exams[i].cfu + "</td></tr>";
	}
	s += "</table></div>";
	document.getElementById("my_exams").innerHTML = s;
}

function printChart() {
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var voti = [];
	var codici = [];

	for (i=0; i<len; i++) {
		voti[i] = exams[i].grade;
		codici[i] = exams[i].code;
	}

	var ctx = document.getElementById("user_chart").getContext('2d');
	new Chart(ctx,{
		type: "line",
		data: {
			labels: codici,
			datasets: [{
				label: "Voti",
				data: voti,
				fill: false,
				borderColor: "rgb(0, 0, 0)",
				lineTension:0.1}
			]},
		options: {}
	});
}