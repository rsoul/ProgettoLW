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
	var exam_date = document.getElementById("inputDate").value;
	var exam_grade = document.getElementById("inputGrade").value;
	var exam_praise = document.getElementById("inputPraise").value;
	var exam_cfu = document.getElementById("inputCFU").value;

	if (!checkCode(exam_code)) {
		alert("Codice esame non valido!");
		return false;
	}
	if (!checkDate(new Date(exam_date))) {
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
				date: exam_date,
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

/* Inserimento calendario */
function insertCalendarEvent(){
	var calendar = JSON.parse(localStorage.calendar);
	var len=calendar.length;
	var calendar_name = document.getElementById("inputName").value;
	var calendar_date = document.getElementById("inputDateCalendar").value;
	var calendar_time = document.getElementById("inputTime").value;

	if (!checkDate(new Date(calendar_date))) {
		alert("Data non valida!");
		return false;
	}

	var obj={
		name: calendar_name,
		date: calendar_date,
		time: calendar_time
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
	if (a.name==b.name) 
		return true;
	return false;
}


function checkCode(code) {
	if (code != "") return true;
	else return false;
}

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

/* Calcola distanza tra date */
var _MS_PER_DAY = 1000 * 60 * 60 * 24;
// a e b sono oggetti Data
function dateDiffInDays(a, b) {
	a = new Date(a);
	b = new Date(b);
  // Esclude l'ora ed il fuso orario
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

/* Print all event on the calendar */
function printCalendar(){
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	var s = new String("");
	s += "<div style=\"text-align: center; padding-top:5px;\">";
	s += "<table class=\"table table-striped table-hover table-bordered\" border=\"1px\"><tr><th>Esame</th><th>Data</th><th>Orario</th><th>Giorni Mancanti</th></tr>";

	for (i=0; i<len; i++) {
		var dateDiff = dateDiffInDays(new Date("2017-11-16"), calendar[i].date);
		var name = calendar[i].name;
		var date = calendar[i].date;
		var time = calendar[i].time;

		if(time == "") time = "Not Defined";
		if (dateDiff > 10) {
			s += "<tr><td>" + name + "</td>";
			s += "<td>" + date + "</td>";
			s += "<td>" + time + "</td>";
			s += "<td>" + dateDiff + "</td></tr>";
		}
		else {
			s += "<tr><td class=\"table-danger\">" + name + "</td>";
			s += "<td class=\"table-danger\">" + date + "</td>";
			s += "<td class=\"table-danger\">" + time + "</td>";
			if (dateDiff == 0) {s += "<td class=\"table-danger\">Oggi</td></tr>";}
			else {s += "<td class=\"table-danger\">" + dateDiff + "</td></tr>";}
		}
	}

	s += "</table></div>";
	document.getElementById("my_calendar").innerHTML = s;
}

/* Print all the exam of the user on a div called my_exams */
function printExams(){
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;

	var s = new String("");
	s += "<div style=\"text-align: center; padding-top:5px;\">";
	s += "<table class=\"table table-striped table-hover table-bordered\" border=\"1px\"><tr><th>Codice</th><th>Data</th><th>Voto</th><th>CFU</th><th>Elimina</th></tr>";
	for (i=0; i<len; i++) {
		var code = exams[i].code;
		var date = exams[i].date;
		var grade = exams[i].grade;
		var cfu = exams[i].cfu;

		if (grade == "31") {
			s += "<tr><td class=\"table-success\">" + code + "</td>";
			s += "<td class=\"table-success\">" + date + "</td>";
			s += "<td class=\"table-success\">30 e Lode</td>";
			s += "<td class=\"table-success\">" + cfu + "</td>";
		} 
		else {
			s += "<tr><td>" + code + "</td>";
			s += "<td>" + date + "</td>";
			s += "<td>" + grade + "</td>";
			s += "<td>" + cfu + "</td>";
		}

		s += "<td><button class=\"btn btn-danger\" onclick=\"removeExam("+code+")\"><span>Remove</span></button></td></tr>";
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
				label: "Voto",
				data: voti,
				fill: false,
				borderColor: "rgb(0, 0, 0)",
				lineTension:0.1}
			]},
		options: {}
	});
}