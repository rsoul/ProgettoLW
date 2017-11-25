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

/* REMOVE COURSE CFU (NOT USED) */
function resetStorageCFU(){localStorage.setItem('CFU', null);}


/* ---------------------------------------- */
/* FUNZIONI DI INSERIMENTO ESAME/EVENTO     */
/* ---------------------------------------- */

/* INSERT NEW EXAM ON EXAMS STORAGE (CHECK ALL FIELDS) */
function addExam(){
	var exam_code = $('#examAddCode').val();
	var exam_date = $('#examAddDate').val();
    var exam_grade = $('#examAddGrade').val();
    var exam_praise = $("input[name=examAddPraise]:checked").val();
    var exam_cfu = $('#examAddCFU').val();

    var exam_add_alert = "examAddAlert";
    var exam_add_alert_text = "examAddAlertText";
	

    /* CHECK ALL FIELDS' VALUES */
	if (!checkCode(exam_code)) {
		showAlert(exam_add_alert, exam_add_alert_text, "Codice non valido!");
		$("#examAddCode").select();
		return false;
	}
	if (!checkDate(new Date(exam_date))) {
		showAlert(exam_add_alert, exam_add_alert_text, "Data non valida!");
		$("#examAddDate").select();
		return false;
	}
	if (!checkDateMax(new Date(exam_date))) {
		showAlert(exam_add_alert, exam_add_alert_text, "Data futura non valida!");
		$("#examAddDate").select();
		return false;
	}
	if (!checkGrade(exam_grade)) {
		showAlert(exam_add_alert, exam_add_alert_text, "Voto non valido!");
		$("#examAddGrade").select();
		return false;
	}
	if (!checkCFU(exam_cfu)) {
		showAlert(exam_add_alert, exam_add_alert_text, "CFU non validi!");
		$("#examAddCFU").select();
		return false;
	}

	/* PARSING LOCAL STORAGE */
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;	

	/* CREATE EXAM OBJECT WITH FIELDS' VALUE */
	var exam = { 
		code: exam_code,
		date: exam_date,
		grade: getGrade(exam_grade, exam_praise),
		cfu: exam_cfu
	};
	
	/* CHECK IF THE EXAM IS ALREADY IN THE STORAGE */
	for (i=0; i<len; i++) {
		if(sameExam(exams[i], exam)) {
			showAlert(exam_add_alert, exam_add_alert_text, "Esame già presente!");
			return false;
		}
	}

	/* INSERT EXAM IN STORAGE AND UPDATE EXAM TABLE/STATISTICS/PROGRESS BAR */
	exams[len] = exam;
	localStorage.exams = JSON.stringify(exams);
	getPercentageCFU();
	printStatistics();
	printExams();
	return true;
}

/* INSERT NEW EVENT ON CALENDAR STORAGE (CHECK ALL FIELDS) */
function addCalendarEvent(){
	var calendar_name = $('#calendarAddName').val();
	var calendar_date = $('#calendarAddDate').val();
	var calendar_time = $('#calendarAddTime').val();

	var calendar_add_alert = "calendarAddAlert";
	var calendar_add_alert_text = "calendarAddAlertText";

	/* CHECK ALL FIELDS' VALUES */
	if(!checkName(calendar_name)) {
		showAlert(calendar_add_alert, calendar_add_alert_text, "Nome non valido!");
		$("#calendarAddName").select();
		return false;
	}
	if (!checkDate(new Date(calendar_date))) {
		showAlert(calendar_add_alert, calendar_add_alert_text, "Data non valida!");
		$("#calendarAddDate").select();
		return false;
	}
	if (!checkDateMin(new Date(calendar_date))) {
		showAlert(calendar_add_alert, calendar_add_alert_text, "Data passata non valida!");
		$("#calendarAddDate").select();
		return false;
	}

	/* PARSING LOCAL STORAGE */
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	/* CREATE EVENT OBJECT WITH FIELDS' VALUE */
	var event = {
		name: calendar_name,
		date: calendar_date,
		time: calendar_time
	};
	
	/* CHECK IF THE EVENT IS ALREADY ON THE STORAGE */
	for (i=0; i<len; i++) {
		if(sameEvent(calendar[i], event)) {
			showAlert(calendar_add_alert, calendar_add_alert_text, "Evento già presente!");
			return false;
		}
	}

	/* ADD EVENT ON STORAGE AND UPDATE CALENDAR TABLE */
	calendar[len] = event;
	localStorage.calendar = JSON.stringify(calendar);
	printCalendar();
	return true;
}

/*------------------------------------------*/


/* ---------------------------------------- */
/* FUNZIONI PER LA MODIFICA                 */
/* ---------------------------------------- */

/* EDIT A SELECTED EXAM (FROM BUTTON) FROM THE EXAMS STORAGE */
function editExam() {
	var exam_code = $('#examEditCode').val();
    var exam_date = $('#examEditDate').val();
    var exam_grade = $('#examEditGrade').val();
    var exam_praise = $("input[name=examEditPraise]:checked").val();
    var exam_cfu = $('#examEditCFU').val();

    var exam_edit_alert = "examEditAlert";
    var exam_edit_alert_text = "examEditAlertText";

    /* CHECK ALL FIELDS' VALUES */
	if (!checkCode(exam_code)) {
		showAlert(exam_edit_alert, exam_edit_alert_text, "Codice esame non valido!");
		$("#examEditCode").select();
		return false;
	}
	if (!checkDate(new Date(exam_date))) {
		showAlert(exam_edit_alert, exam_edit_alert_text, "Data non valida!");
		$("examEditDate").select();
		return false;
	}
	if (!checkDateMax(new Date(exam_date))) {
		showAlert(exam_edit_alert, exam_edit_alert_text, "Data futura non valida!");
		$("#examEditDate").select();
		return false;
	}
	if (!checkGrade(exam_grade)) {
		showAlert(exam_edit_alert, exam_edit_alert_text, "Voto non valido!");
		$("#examEditGrade").select();
		return false;
	}
	if (!checkCFU(exam_cfu)) {
		showAlert(exam_edit_alert, exam_edit_alert_text, "CFU non validi!");
		$("#examEditCFU").select();
		return false;
	}

	/* PARSING LOCAL STORAGE */
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;

	/* FIND THE EXAM WHICH HAVE TO BE MODIFIED AND EDIT ITS VALUES */
	for (i=0; i<len; i++) {
		if(exams[i].code == exam_code) {
			exams[i].date = exam_date;
			exams[i].grade = getGrade(exam_grade, exam_praise);
			exams[i].cfu = exam_cfu;
			break;
		}
	}

	/* UPDATE STORAGE WITH NEW VALUES AND UPDATE TABLES AND CHARTS */
	localStorage.exams = JSON.stringify(exams);
	getPercentageCFU();	
	printStatistics();
	printExams();
	return true;
}

/* EDIT A SELECTED (FROM BUTTON) EVENT FROM THE CALENDAR STORAGE */
function editCalendarEvent() {
	var calendar_name = $('#calendarEditName').val();
	var calendar_date = $('#calendarEditDate').val();
	var calendar_time = $('#calendarEditTime').val();

    var calendar_edit_alert = "calendarEditAlert";
    var calendar_edit_alert_text = "calendarEditAlertText";

    /* CHECK ALL FIELDS' VALUES */
	if (!checkDate(new Date(calendar_date))) {
		showAlert(calendar_edit_alert, calendar_edit_alert_text, "Data non valida!");
		$("#calendarEditDate").select();
		return false;
	}
	if (!checkDateMin(new Date(calendar_date))) {
		showAlert(calendar_edit_alert, calendar_edit_alert_text, "Data passata non valida!");
		$("#calendarEditDate").select();
		return false;
	}

	/* PARSING LOCAL STORAGE */
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	/* FIND THE EVENT WHICH HAVE TO BE MODIFIED AND EDIT ITS VALUES */
	for (i=0; i<len; i++) {
		if(calendar[i].name == calendar_name) {
			calendar[i].date = calendar_date;
			calendar[i].time = calendar_time;
			break; 
		}
	}

	/* UPDATE LOCAL STORAGE WITH NEW VALUES AND UPDATE CALENDAR TABLLE */
	localStorage.calendar = JSON.stringify(calendar);
	printCalendar();
	return true;
}

/*------------------------------------------*/


/* ---------------------------------------- */
/* FUNZIONI PER LA RIMOZIONE                */
/* ---------------------------------------- */

/* REMOVE A SELECTED EXAM FROM THE EXAMS STORAGE BY KEY (code) */
function removeExam(code) {
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;

	/* FIND THE EXAM WHICH HAVE TO BE DELETED AND SPLIT LOCALSTORAGE */
	for (i=0; i<len; i++) {
		if(exams[i].code == code) {
			exams.splice(i,1);
			break;
		}
	}

	/* UPDATE LOCAL STORAGE AND TABLES */
	localStorage.exams = JSON.stringify(exams);
	getPercentageCFU();
	printStatistics();
	printExams();
	return true;
}

/* REMOVE A SELECTED EVENT FROM THE CALENDAR STORAGE BY KEY (name) */
function removeEvent(name) {
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	/* FIND THE EVENT WHICH HAVE TO BE DELETED AND SPLIT LOCALSTORAGE */
	for (i=0; i<len; i++) {
		if(calendar[i].name == name) {
			calendar.splice(i,1);
			break;
		}
	}

	/* UPDATE LOCAL STORAGE AND CALENDAR TABLE */
	localStorage.calendar = JSON.stringify(calendar);	
	printCalendar();
	return true;
}

/*------------------------------------------*/



/* ---------------------------------------- */
/* FUNZIONI PER LA STAMPA O GENERICO OUTPUT */
/* ---------------------------------------- */


/* PRINT A TABLE WITH ALL EXAMS FROM EXAMS STORAGE (WITH DELETE/EDIT BUTTONS) */
function printExams(){
	/* OPEN STORAGE IF ITS DEFINED */
	if (typeof(localStorage.exams) == "undefined") return false;
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var s = new String("");

	/* SORT EXAMS BY DATE */
	exams.sort(function(a,b) { 
	    return new Date(a.date) - new Date(b.date); 
	});
	
	/* PREPARE EXAMS TABLE */
	s += "<div style=\"text-align: center; padding-top:5px;\">";
	s += "<table class=\"table table-striped table-hover table-bordered table-sm\" border=\"1px\"><tr><th>Codice</th><th>Data</th><th>Voto</th><th>CFU</th><th>Opzioni</th></tr>";
	
	/* TAKE ALL VALUES FROM THE STORAGE AND INSERT THEM ON EACH ROW OF THE TABLE */
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
		/* REMOVE AND EDIT BUTTONS */
		s += "<td><button class=\"btn btn-danger btn-sm\" id=\"rmv_exam_"+code+"\" onclick=\"removeExam(\'"+code+"\')\"><i class=\"material-icons\">delete</i></button>";
		s += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#examEditForm\"  id=\"edit_exam_"+code+"\")\" onclick=\"initEditExam(\'"+code+"\',\'"+date+"\',\'"+grade+"\',\'"+cfu+"\')\"><i class=\"material-icons\">create</i></button></td></tr>";		
	}
	s += "</table></div>";

	$("#my_exams").html(s);
	return true;
}

/* PRINT ALL EVENTS FROM CALENDAR STORAGE (WITH DELETE/EDIT BUTTONS) */
function printCalendar(){
	/* OPEN STORAGE IF ITS DEFINED */
	if (typeof(localStorage.calendar) == "undefined") return false;
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;
	var s = new String("");

	/* SORT EVENTS BY DATE */
	calendar.sort(function(a,b) { 
	    return new Date(a.date) - new Date(b.date); 
	});
	
	/* PREPARE TABLE */
	s += "<div style=\"text-align: center; padding-top:5px;\">";
	s += "<table class=\"table table-striped table-hover table-bordered  table-sm\" border=\"1px\"><tr><th>Esame</th><th>Data</th><th>Orario</th><th>Scadenza</th><th>Opzioni</th></tr>";
	/* TAKE ALL VALUES FROM THE LOCAL STORAGE AND INSERT EACH EVENT ON A ROW */
	for (i=0; i<len; i++) {
		var name = calendar[i].name;
		var date = calendar[i].date;
		var time = calendar[i].time;
		var dateDiff = dateDiffInDays(new Date(getToday()), date);
		var dateDiff_for_print = dateDiff;
		var time_for_print = time;


		/* IF TIME IS NOT DEFINED, PRINTS N.D. INSTEAD OF AN EMPTY STRING */
		if(time == "") time_for_print = "N.D.";

		/* IF DISTANCE FROM TODAY > 10 -> NORMAL ROW, IF >5 AND <=10 WARNING, ELSE DANGER */
		if (dateDiff > 10) s += "<tr>";
		else if (dateDiff > 5) s += "<tr class=\"table table-warning\">";
		else if (dateDiff >= 0) s += "<tr class=\"table table-danger\">";
		else s += "<tr class=\"table table-success\">";

		
		/* CHECK FOR DISTANCE FROM TODAY (TODAY, TOMORROW OR YESTERDAY) */
		if(dateDiff == 1) dateDiff_for_print = "Domani";
		else if(dateDiff == 0) dateDiff_for_print = "Oggi";
		else if(dateDiff == -1) dateDiff_for_print = "Ieri";
		
		s += "<td>" + name + "</td>";
		s += "<td>" + date + "</td>";
		s += "<td>" + time_for_print + "</td>";
		s += "<td>" + dateDiff_for_print + "</td>";

		/* REMOVE AND EDIT BUTTONS */
		s += "<td><button class=\"btn btn-danger btn-sm\" id=\"rmv_event_"+name+"\" onclick=\"removeEvent(\'"+name+"\')\"><i class=\"material-icons\">delete</i></button>";
		s += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#calendarEditForm\"  id=\"edit_event_"+name+"\" onclick=\"initEditEvent(\'"+name+"\',\'"+date+"\',\'"+time+"\')\"><i class=\"material-icons\">create</i></button></td></tr>";
	}

	s += "</table></div>";
	$("#my_calendar").html(s);
	return true;
}

/* PRINT STATISTICS FOR EXAMS */
function printStatistics() {
	/* OPEN STORAGE IF ITS DEFINED */
	if (typeof(localStorage.calendar) == "undefined") return false;
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;

	var s = new String("");
	var voti = new Array();
	var date = new Array();
	var media_time = new Array();
	var media_const_array = new Array();
	var media_ponderata_const_array = new Array();
	var media = 0.0;
	var media_ponderata = 0.0;
	var cfu_totali = 0.0;	// TOTAL CFU FOR WEIGHTED AVERAGE
	var cfu_corso = localStorage.getItem("CFU");

	/* SORT EXAMS BY DATE */
	exams.sort(function(a,b) { 
	    return new Date(a.date) - new Date(b.date); 
	});

	/* GENERATE GRADES, DATES AND AVERAGE VARIATION ARRAYS */
	for (i=0; i<len; i++) {
		var grade_for = exams[i].grade;
		var date_for = exams[i].date;
		var cfu_for = exams[i].cfu;
		
		media += parseFloat(grade_for);
		media_ponderata += parseFloat(grade_for)*parseFloat(cfu_for);
		cfu_totali += parseFloat(cfu_for);

		voti[i] = grade_for;
		date[i] = date_for;

		/* CALCULATE AVERAGE ON THE I-TIME */
		var avg = 0.0;
		for (j=0; j<voti.length; j++) {
			avg += parseFloat(voti[j]);
		}
		media_time[i] = (avg/voti.length).toFixed(2);
	}

	media = (media/len).toFixed(2);
	media_ponderata = (media_ponderata/cfu_totali).toFixed(2);

	/* FILL TWO ARRAY WITH THE AVERAGE AND THE WEIGHTED AVERAGE (WITH ONLY 1 VALUES ON ALL THE CELLS) */
	for (i=0; i<len; i++) {
		media_const_array[i] = media;
		media_ponderata_const_array[i] = media_ponderata;
	}

	/* GENERATE THE TABLE */
	s += "<div id=\"mediaDiv\">";
	s += "<table class=\"table table-striped table-bordered table-sm\" border=\"1px\"><tr><th>Media</th><th>Media Ponderata</th><th>Esami Dati</th><th>CFU Ottenuti</th><th>CFU Richiesti</th></tr>";
	s += "<tr><td>" + media + "</td><td>" + media_ponderata + "</td><td>" + len + "</td><td>" + cfu_totali + "</td><td>" + cfu_corso + "</td></tr></table></div>";

	/* DRAW THE GRAPHIC */
	var ctx = $("#user_chart").get(0).getContext('2d');
	new Chart(ctx,{
		type: "line",
		
		data: {
			labels: date,
			datasets: [
			/* GRADES */
			{
				label: "Voti",
				data: voti,
				pointBackgroundColor: "#3cba9f",
				borderColor: "#3cba9f",
				lineTension: 0.1,
				fill: false
			},
			/* AVERAGE VARIATION */
			{
				label: "Variazione della media",
				data: media_time,
				pointBackgroundColor: "#995f03",
				borderColor: "#995f03",
				lineTension: 0.1,
				fill: false
			},
			/* AVERAGE LINE */
			{
				label: "Media",
				pointRadius: 0,
				pointBackgroundColor: "#fc7171",
				data: media_const_array,
				borderColor: "#fc7171",
				fill: false
			},
			/* WEIGHTED AVERAGE LINE */
			{
				label: "Media ponderata",
				pointRadius: 0,
				pointBackgroundColor: "#6bcc66",
				data: media_ponderata_const_array,
				borderColor: "#6bcc66",
				fill: false
			}]
		},

		options: {
			maintainAspectRatio: false,
			scales: {
            	yAxes: [{
            		ticks: {
						min: 18,
						max: 31,
						stepSize: 1
					}
				}]
            }
            /* DRAW AVERAGE LINE (UNUSED - ANNOTATION CHART JS PLUGIN)
            annotation: {
		      annotations: [{
		        type: 'line',
		        mode: 'horizontal',
		        scaleID: 'y-axis-0',
		        value: media,
		        borderColor: 'rgb(255, 0, 0)',
		        borderWidth: 1,
		        label: {
		          enabled: false,
		          content: 'Media'
		        }
		      }]
		    }
		    */
        }
	});

	$("#my_statistics").html(s);
	return true;
}