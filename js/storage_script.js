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
function resetStorageExams(){localStorage.exams="[]";}

/* REMOVE ALL EXEMENTS FROM CALENDAR STORAGE (NOT USED) */
function resetStorageCalendar(){localStorage.calendar="[]";}

/* REMOVE ALL EXEMENTS FROM EXAMS STORAGE (NOT USED) */
function resetStorageCFU(){ if(localStorage.getItem("CFU") != null) localStorage.setItem('CFU', null);}


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


/* ---------------------------------------- */
/* FUNZIONI PER LA STAMPA O GENERICO OUTPUT */
/* ---------------------------------------- */

/* PRINT ALL EVENTS FROM CALENDAR STORAGE (WITH DELETE/EDIT BUTTONS) */
function printCalendar(){
	if (typeof(localStorage.calendar) == "undefined") return false;
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;
	var s = new String("");

	calendar.sort(function(a,b) { 
	    return new Date(a.date) - new Date(b.date); 
	});
	
	s += "<div style=\"text-align: center; padding-top:5px;\">";
	s += "<table class=\"table table-striped table-hover table-bordered  table-sm\" border=\"1px\"><tr><th>Esame</th><th>Data</th><th>Orario</th><th>Scadenza</th><th>Opzioni</th></tr>";
	for (i=0; i<len; i++) {
		var dateDiff = dateDiffInDays(new Date(getToday()), calendar[i].date);
		var name = calendar[i].name;
		var date = calendar[i].date;
		var time = calendar[i].time;

		var time_for_print = time;

		if(time == "") time_for_print = "N.D.";

		/* IF DISTANCE FROM TODAY > 10 -> NORMAL ROW, IF >5 AND <=10 WARNING, ELSE DANGER */
		if (dateDiff > 10) s += "<tr>";
		else if (dateDiff > 5) s += "<tr class=\"table table-warning\">";
		else if (dateDiff >= 0) s += "<tr class=\"table table-danger\">";
		else s += "<tr class=\"table table-success\">";

		var dateDiff_for_print = dateDiff;

		/* CHECK FOR DISTANCE FROM TODAY (TODAY, TOMORROW, ...) */
		if(dateDiff == 1) dateDiff_for_print = "Domani";
		else if(dateDiff == 0) dateDiff_for_print = "Oggi";
		else if(dateDiff == -1) dateDiff_for_print = "Ieri";
		
		s += "<td>" + name + "</td>";
		s += "<td>" + date + "</td>";
		s += "<td>" + time_for_print + "</td>";
		s += "<td>" + dateDiff_for_print + "</td>";

		s += "<td><button class=\"btn btn-danger btn-sm\" id=\"rmv_event_"+name+"\" onclick=\"removeEvent(\'"+name+"\')\"><i class=\"material-icons\">delete</i></button>";
		s += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#editCalendarForm\"  id=\"edit_event_"+name+"\" onclick=\"initEditEvent(\'"+name+"\',\'"+date+"\',\'"+time+"\')\"><i class=\"material-icons\">create</i></button></td></tr>";
	}

	s += "</table></div>";
	document.getElementById("my_calendar").innerHTML = s;
	return true;
}

/* PRINT A TABLE WITH ALL EXAMS FROM EXAMS STORAGE (WITH DELETE/EDIT BUTTONS) */
function printExams(){
	if (typeof(localStorage.exams) == "undefined") return false;
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var s = new String("");

	exams.sort(function(a,b) { 
	    return new Date(a.date) - new Date(b.date); 
	});
	
	s += "<div style=\"text-align: center; padding-top:5px;\">";
	s += "<table class=\"table table-striped table-hover table-bordered table-sm\" border=\"1px\"><tr><th>Codice</th><th>Data</th><th>Voto</th><th>CFU</th><th>Opzioni</th></tr>";
	for (i=0; i<len; i++) {
		var code = exams[i].code;
		var date = exams[i].date;
		var grade = exams[i].grade;
		var cfu = exams[i].cfu;
		var grade_for_print = grade;

		/* IF 30 WITH PRAISE -> SHOW GREEN BACKGROUND ROW */
		if (grade == 31) {
			grade_for_print = "30 e Lode";
			s += "<tr class=\"table table-success\">";
		}
		/* ELSE A NORMAL ROW */
		else s += "<tr>";
		s += "<td id=\"tableExamCode"+code+"\">" + code + "</td>";
		s += "<td id=\"tableExamDate"+code+"\">" + date + "</td>";
		s += "<td id=\"tableExamGrade"+code+"\">" + grade_for_print + "</td>";
		s += "<td id=\"tableExamCFU"+code+"\">" + cfu + "</td>";
		s += "<td><button class=\"btn btn-danger btn-sm\" id=\"rmv_exam_"+code+"\" onclick=\"removeExam(\'"+code+"\')\"><i class=\"material-icons\">delete</i></button>";
		s += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#editExamForm\"  id=\"edit_exam_"+code+"\")\" onclick=\"initEditExam(\'"+code+"\',\'"+date+"\',\'"+grade+"\',\'"+cfu+"\')\"><i class=\"material-icons\">create</i></button></td></tr>";		
	}
	s += "</table></div>";

	document.getElementById("my_exams").innerHTML = s;
	return true;
}

/* PRINT STATISTICS FOR EXAMS */
function printStatistics() {
	if (typeof(localStorage.calendar) == "undefined") return false;
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var s = new String("");

	var media = 0.0;
	var media_ponderata = 0.0;
	var cfu_totali = 0.0;

	for (i=0; i<len; i++) {
		media += parseFloat(exams[i].grade);
		media_ponderata += parseFloat(exams[i].grade)*parseFloat(exams[i].cfu);
		cfu_totali += parseFloat(exams[i].cfu);
	}

	media = (media/len).toFixed(2);
	media_ponderata = (media_ponderata/cfu_totali).toFixed(2);

	s += "<div id=\"mediaDiv\">";
	s += "<table class=\"table table-striped table-bordered table-sm\" border=\"1px\"><tr><th>Media</th><th>Media Ponderata</th></tr>";
	s += "<tr><td style=\"vertical-align: middle;\">" + media + "</td><td style=\"vertical-align: middle;\">" + media_ponderata + "</td></tr></table></div>";

	document.getElementById("my_statistics").innerHTML = s;
	return true;
}


/* PRINT CHART OF EXAMS VOTES FROM EXAMS STORAGE (USING CHARTJS) */
function printChart() {
	if (typeof(localStorage.calendar) == "undefined") return false;
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var voti = [];
	var date = [];

	exams.sort(function(a,b) { 
	    return new Date(a.date) - new Date(b.date); 
	});

	for (i=0; i<len; i++) {
		voti[i] = exams[i].grade;
		date[i] = exams[i].date;
	}

	var ctx = document.getElementById("user_chart").getContext('2d');
	new Chart(ctx,{
		type: "line",
		data: {
			labels: date,
			datasets: [{
				label: "Voto",
				data: voti,
				pointStyle: "circle",
				borderColor: "rgb(0, 0, 0)",
				lineTension:0.1}
			]},
		options: {
			yAxisID: "Voto",
			xAxisID: "Data"
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
	getPercentageCFU();
	printStatistics();
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
function editExam() {
	var exam_code = $('#examEditCode').val();
    var exam_date = $('#examEditDate').val();
    var exam_grade = $('#examEditGrade').val();
    var exam_praise = $("input[name=inputEditPraise]:checked").val();
    var exam_cfu = $('#examEditCFU').val();

	if (!checkCode(exam_code)) {
		alert("Codice esame non valido!");
		return false;
	}
	if (!checkDate(new Date(exam_date))) {
		alert("Data non valida!");
		return false;
	}
	if (!checkDateMax(new Date(exam_date))) {
		alert("Data futura non valida!");
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
	var len = exams.length;

	for (i=0; i<len; i++) {
		if(exams[i].code == exam_code) {
			exams[i].date = exam_date;
			exams[i].grade = getGrade(exam_grade, exam_praise);
			exams[i].cfu = exam_cfu;
			break;
		}
	}

	localStorage.exams = JSON.stringify(exams);
	getPercentageCFU();	
	printStatistics();
	printExams();
	printChart();
	return true;
}

/* EDIT A SELECTED (FROM BUTTON) EVENT FROM THE CALENDAR STORAGE */
function editCalendarEvent() {
	var calendar_name = $('#calendarEditName').val();
	var calendar_date = $('#calendarEditDate').val();
	var calendar_time = $('#calendarEditTime').val();

	if (!checkDate(new Date(calendar_date))) {
		alert("Data non valida!");
		return false;
	}
	if (!checkDateMin(new Date(calendar_date))) {
		alert("Data passata non valida!");
		return false;
	}

	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

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
function addExam(){
	var exam_code = $('#examAddCode').val();
	var exam_date = $('#examAddDate').val();
    var exam_grade = $('#examAddGrade').val();
    var exam_praise = $("input[name=examAddPraise]:checked").val();
    var exam_cfu = $('#examAddCFU').val();
	

	if (!checkCode(exam_code)) {
		alert("Codice non valido!");
		return false;
	}
	if (!checkDate(new Date(exam_date))) {
		alert("Data non valida!");
		return false;
	}
	if (!checkDateMax(new Date(exam_date))) {
		alert("Data futura non valida!");
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
	var len = exams.length;	

	var exam = { 
		code: exam_code,
		date: exam_date,
		grade: getGrade(exam_grade, exam_praise),
		cfu: exam_cfu
	};
	
	for (i=0; i<len; i++) {
		if(sameExam(exams[i], exam)) {
			alert("Esame già presente!");
			return false;
		}
	}

	exams[len] = exam;
	localStorage.exams = JSON.stringify(exams);
	getPercentageCFU();
	printStatistics();
	printExams();
	printChart();
	return true;
}

/* INSERT NEW EVENT ON CALENDAR STORAGE (CHECK ALL FIELDS) */
function addCalendarEvent(){
	var calendar_name = $('#calendarAddName').val();
	var calendar_date = $('#calendarAddDate').val();
	var calendar_time = $('#calendarAddTime').val();

	if(!checkName(calendar_name)) {
		alert("Nome non valido!");
		return false;
	}
	if (!checkDate(new Date(calendar_date))) {
		alert("Data non valida!");
		return false;
	}
	if (!checkDateMin(new Date(calendar_date))) {
		alert("Data passata non valida!");
		return false;
	}

	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	var event = {
		name: calendar_name,
		date: calendar_date,
		time: calendar_time
	};
	
	for (i=0; i<len; i++) {
		if(sameEvent(calendar[i], event)) {
			alert("Evento già presente!");
			return false;
		}
	}

	calendar[len] = event;
	localStorage.calendar = JSON.stringify(calendar);
	printCalendar();
	return true;
}
