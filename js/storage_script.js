/* ---------------------------------------- */
/* FUNZONI PER L'UTILIZZO DI STORAGE        */
/* ---------------------------------------- */

/* INIZIALIZE EXAMS STORAGE (EMPTY) IF NOT ALREADY DEFINED */
function initStorageExams(){
	if (typeof(localStorage.exams) == "undefined") {
		localStorage.exams="[]";
	}
}

/* INIZIALIZE CALENDAR STORAGE (EMPTY) IF NOT ALREADY DEFINED */
function initStorageCalendar(){
	if (typeof(localStorage.calendar) == "undefined") {
		localStorage.calendar="[]";
	}
}

/* REMOVE ALL EXEMENTS FROM EXAMS STORAGE (NOT USED) */
function resetStorageExams(){ 
	localStorage.exams="[]";
}

/* REMOVE ALL EXEMENTS FROM CALENDAR STORAGE (NOT USED) */
function resetStorageCalendar(){
	localStorage.calendar="[]";
}



/* ---------------------------------------- */
/* FUNZIONI PER LA STAMPA O GENERICO OUTPUT */
/* ---------------------------------------- */

/* PRINT ALL EVENTS FROM CALENDAR STORAGE (WITH DELETE/EDIT BUTTONS) */
function printCalendar(){
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;
	var s = new String("");
	
	s += "<div style=\"text-align: center; padding-top:5px;\">";
	s += "<table class=\"table table-striped table-hover table-bordered  table-sm\" border=\"1px\"><tr><th>Esame</th><th>Data</th><th>Orario</th><th>Giorni Mancanti</th><th>Opzioni</th></tr>";
	for (i=0; i<len; i++) {
		var dateDiff = dateDiffInDays(new Date(getToday()), calendar[i].date);
		var name = calendar[i].name;
		var date = calendar[i].date;
		var time = calendar[i].time;

		if(time == "") time = "Not Defined";
		/* IF DISTANCE FROM A DATE IS >10 -> SHOW NORMAL TD */
		if (dateDiff > 10) {
			s += "<tr><td>" + name + "</td>";
			s += "<td>" + date + "</td>";
			s += "<td>" + time + "</td>";
			s += "<td>" + dateDiff + "</td>";
			s += "<td><button class=\"btn btn-danger btn-sm\" id=rmv_event_\""+name+"\" onclick=\"removeEvent(\'"+name+"\')\">Remove</button>";
			s += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#editCalendarForm\" id=\"edit_event_"+name+"\" onclick=\"editingEvent(\'"+name+"\',\'"+date+"\',\'"+time+"\');\">Edit</button></td></tr>";
		}
		/* ELSE (<=10) SHOW RED BACKGROUND TD */
		else {
			s += "<tr><td class=\"table-danger\">" + name + "</td>";
			s += "<td class=\"table-danger\">" + date + "</td>";
			s += "<td class=\"table-danger\">" + time + "</td>";
			if (dateDiff == 0) {s += "<td class=\"table-danger\">Oggi</td>";}
			else {s += "<td class=\"table-danger\">" + dateDiff + "</td>";}
			s += "<td class=\"table-danger\"><button class=\"btn btn-danger btn-sm\" id=\"rmv_event_"+name+"\" onclick=\"removeEvent(\'"+name+"\')\">Remove</button>";
			s += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#editCalendarForm\"  id=\"edit_event_"+name+"\" onclick=\"editingEvent(\'"+name+"\',\'"+date+"\',\'"+time+"\')\">Edit</button></td></tr>";
		}
	}

	s += "</table></div>";
	document.getElementById("my_calendar").innerHTML = s;
	return true;
}

/* PRINT A TABLE WITH ALL EXAMS FROM EXAMS STORAGE (WITH DELETE/EDIT BUTTONS) */
function printExams(){
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var s = new String("");
	
	s += "<div style=\"text-align: center; padding-top:5px;\">";
	s += "<table class=\"table table-striped table-hover table-bordered table-sm\" border=\"1px\"><tr><th>Codice</th><th>Data</th><th>Voto</th><th>CFU</th><th>Opzioni</th></tr>";
	for (i=0; i<len; i++) {
		var code = exams[i].code;
		var date = exams[i].date;
		var grade = exams[i].grade;
		var cfu = exams[i].cfu;

		/* IF 30 WITH PRAISE -> SHOW GREEN BACKGROUND TR */
		if (grade == 31) {
			s += "<tr><td class=\"table-success\" id=\"tableExamCode"+code+"\">" + code + "</td>";
			s += "<td class=\"table-success\" id=\"tableExamDate"+code+"\">" + date + "</td>";
			s += "<td class=\"table-success\" id=\"tableExamGrade"+code+"\">30 e Lode</td>";
			s += "<td class=\"table-success\" id=\"tableExamCFU"+code+"\">" + cfu + "</td>";
			s += "<td class=\"table-success\"><button class=\"btn btn-danger btn-sm\" id=\"rmv_exam_"+code+"\" onclick=\"removeExam(\'"+code+"\')\">Remove</button>";
			s += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#editExamForm\"  id=\"edit_exam_"+code+"\")\" onclick=\"editingExam(\'"+code+"\',\'"+date+"\',\'"+grade+"\',\'"+cfu+"\')\">Edit</button></td></tr>";
		} 
		/* ELSE A NORMAL TD */
		else {
			s += "<tr><td id=\"tableExamCode"+code+"\">" + code + "</td>";
			s += "<td id=\"tableExamDate"+code+"\">" + date + "</td>";
			s += "<td id=\"tableExamGrae"+code+"\">" + grade + "</td>";
			s += "<td id=\"tableExamCFU"+code+"\">" + cfu + "</td>";
			s += "<td><button class=\"btn btn-danger btn-sm\" id=\"rmv_exam_"+code+"\" onclick=\"removeExam(\'"+code+"\')\">Remove</button>";
			s += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#editExamForm\" id=\"edit_exam_"+code+"\")\" onclick=\"editingExam(\'"+code+"\',\'"+date+"\',\'"+grade+"\',\'"+cfu+"\')\">Edit</button></td></tr>";
		}		
	}
	s += "</table></div>";
	document.getElementById("my_exams").innerHTML = s;
	return true;
}

/* PRINT CHART OF EXAMS VOTES FROM EXAMS STORAGE (USING CHARTJS) */
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
		options: {
			yAxisID: "Voti",
			xAxisID: "Codici"
		}
	});
	return true;
}



/* ---------------------------------------- */
/* FUNZIONI PER LA RIMOZIONE                */
/* ---------------------------------------- */

/* REMOVE A SELECTED EXAM FROM THE EXAMS STORAGE BY KEY (code) */
function removeExam(code) {
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;

	for (i=0; i<len; i++) {
		if(exams[i].code == code) {
			exams.splice(i,1);
			break;
		}
	}

	localStorage.exams = JSON.stringify(exams);	
	printExams();
	printChart();
	return true;
}

/* REMOVE A SELECTED EVENT FROM THE CALENDAR STORAGE BY KEY (name) */
function removeEvent(name) {
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	for (i=0; i<len; i++) {
		if(calendar[i].name == name) {
			calendar.splice(i,1);
			break;
		}
	}

	localStorage.calendar = JSON.stringify(calendar);	
	printCalendar();
	return true;
}



/* ---------------------------------------- */
/* FUNZIONI PER LA MODIFICA                 */
/* ---------------------------------------- */

/* EDIT A SELECTED EXAM (FROM BUTTON) FROM THE EXAMS STORAGE */
function editExam(exam_code, exam_date, exam_grade, exam_praise, exam_cfu) {
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;

	if (!checkCode(exam_code)) {
		alert("Codice esame non valido!");
		return false;
	}
	if (!checkDate(new Date(exam_date))) {
		alert("Data non valida!");
		return false;
	}
	if (!checkGrade(exam_grade)) {
		alert("Voto non valido!");
		return false;
	}
	if (!checkCFU(exam_cfu)) {
		alert("CFU non validi!");
		return false;
	}

	for (i=0; i<len; i++) {
		if(exams[i].code == exam_code) {
			exams[i].date = exam_date;
			exams[i].grade = getGrade(exam_grade, exam_praise);
			exams[i].cfu = exam_cfu;
			break;
		}
	}

	localStorage.exams = JSON.stringify(exams);	
	printExams();
	printChart();
	return true;
}

/* EDIT A SELECTED (FROM BUTTON) EVENT FROM THE CALENDAR STORAGE */
function editCalendarEvent(calendar_name, calendar_date, calendar_time) {
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	if (!checkDate(new Date(calendar_date))) {
		alert("Data non valida!");
		return false;
	}

	for (i=0; i<len; i++) {
		if(calendar[i].name == calendar_name) {
			calendar[i].date = calendar_date;
			calendar[i].time = calendar_time;
			break; 
		}
	}

	localStorage.calendar = JSON.stringify(calendar);
	printCalendar();
	return true;
}



/* ---------------------------------------- */
/* FUNZIONI DI INSERIMENTO E INPUT VARI     */
/* ---------------------------------------- */

/* INSERT NEW EXAM ON EXAMS STORAGE (CHECK ALL FIELDS) */
function addExam(exam_code, exam_date, exam_grade, exam_praise, exam_cfu){
	if (!checkCode(exam_code)) {
		alert("Codice esame non valido!");
		return false;
	}
	if (!checkDate(new Date(exam_date))) {
		alert("Data non valida!");
		return false;
	}
	if (!checkGrade(exam_grade)) {
		alert("Voto non valido!");
		return false;
	}
	if (!checkCFU(exam_cfu)) {
		alert("CFU non validi!");
		return false;
	}

	var exams = JSON.parse(localStorage.exams);
	var where = exams.length;	
	var exam = { 
		code: exam_code,
		date: exam_date,
		grade: getGrade(exam_grade, exam_praise),
		cfu: exam_cfu
	};
	
	for (i=0; i<where; i++)
		if(sameExam(exams[i], exam)) {
			alert("Esame già presente!");
			return false;
		}

	exams[where] = exam;
	localStorage.exams = JSON.stringify(exams);
	printExams();
	printChart();
	return true;
}

/* INSERT NEW EVENT ON CALENDAR STORAGE (CHECK ALL FIELDS) */
function addCalendarEvent(calendar_name, calendar_date, calendar_time){
	var calendar = JSON.parse(localStorage.calendar);
	var len=calendar.length;

	if (!checkDate(new Date(calendar_date))) {
		alert("Data non valida!");
		return false;
	}

	var event = {
		name: calendar_name,
		date: calendar_date,
		time: calendar_time
	};
	
	for (i=0; i<len; i++)
		if(sameEvent(calendar[i], event)) {
			alert("Evento già presente!");
			return false;
		}

	calendar[len]=event;
	localStorage.calendar=JSON.stringify(calendar);
	printCalendar();
	return true;
}
