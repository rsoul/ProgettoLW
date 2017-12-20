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
	initStorageExams();	// IF NOT INITIALIZATED
	var exam_type = $("#examAddType :selected").val();
	var exam_code = $('#examAddCode').val();
	var exam_date = $('#examAddDate').val();
    var exam_grade = $('#examAddGrade').val();
    var exam_praise = $("input[name=examAddPraise]:checked").val();
    var exam_cfu = $('#examAddCFU').val();

    var exam_add_alert = "examAddAlert";
    var exam_add_alert_text = "examAddAlertText";

    var flag = true;
	
	/* CHECK IF MAXIUM CFU REACHED */
	if((parseInt(getProgress()) + parseInt(exam_cfu)) > localStorage.getItem('CFU')) {
		showAlert(exam_add_alert, exam_add_alert_text, "CFU Massimi raggiunti!");
		$("#examAddCFU").select();
		flag = false;
	}

    /* CHECK ALL FIELDS' VALUES */
    if (!checkType(exam_type)) {
    	showAlert(exam_add_alert, exam_add_alert_text, "Tipo non valido!");
		$("#examAddType").select();
		flag = false;
    }
	if (!checkCode(exam_code)) {
		changeExamAddCode();
		showAlert(exam_add_alert, exam_add_alert_text, "Codice non valido!");
		$("#examAddCode").select();
		flag = false;
	}
	if (!checkDate(new Date(exam_date))) {
		changeExamAddDate();
		showAlert(exam_add_alert, exam_add_alert_text, "Data non valida!");
		$("#examAddDate").select();
		flag = false;
	}
	if (!checkDateMax(new Date(exam_date))) {
		showAlert(exam_add_alert, exam_add_alert_text, "Data futura non valida!");
		$("#examAddDate").select();
		flag = false;
	}
	if (exam_type != "Idoneità") {
		if (!checkGrade(exam_grade)) {
			changeExamAddGrade();
			showAlert(exam_add_alert, exam_add_alert_text, "Voto non valido!");
			$("#examAddGrade").select();
			flag = false;
		}
	}
	if (!checkCFU(exam_cfu)) {
		changeExamAddCFU();
		showAlert(exam_add_alert, exam_add_alert_text, "CFU non validi!");
		$("#examAddCFU").select();
		flag = false;
	}

	if (!flag) return false;

	var grade_for_print;
	if(exam_type == "Idoneità") grade_for_print = "Idoneo";
	else grade_for_print = getGrade(exam_grade, exam_praise);

	/* PARSING LOCAL STORAGE */
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;	

	/* CREATE EXAM OBJECT WITH FIELDS' VALUE */
	var exam = { 
		type: exam_type,
		code: exam_code,
		date: exam_date,
		grade: grade_for_print,
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
	getPercentageCFU();	// UPDATE PERCENTAGE BAR
	printStatistics();	// UPDATE CHART
	printExams();	// UPDATE EXAMS
	return true;
}

/* INSERT NEW EVENT ON CALENDAR STORAGE (CHECK ALL FIELDS) */
function addCalendarEvent(){
	initStorageCalendar();
	var calendar_name = $('#calendarAddName').val();
	var calendar_date = $('#calendarAddDate').val();
	var calendar_time_start = $('#calendarAddTimeStart').val();
	var calendar_time_end = $('#calendarAddTimeEnd').val();

	var calendar_add_alert = "calendarAddAlert";
	var calendar_add_alert_text = "calendarAddAlertText";

	var flag = true;

	/* CHECK ALL FIELDS' VALUES */
	if(!checkName(calendar_name)) {
		changeCalendarAddName();
		showAlert(calendar_add_alert, calendar_add_alert_text, "Nome non valido!");
		$("#calendarAddName").select();
		flag = false;
	}
	if (!checkDate(new Date(calendar_date))) {
		changeCalendarAddDate();
		showAlert(calendar_add_alert, calendar_add_alert_text, "Data non valida!");
		$("#calendarAddDate").select();
		flag = false;
	}
	if (!checkDateMin(new Date(calendar_date))) {
		showAlert(calendar_add_alert, calendar_add_alert_text, "Data passata non valida!");
		$("#calendarAddDate").select();
		flag = false;
	}
	if (!checkTimes(calendar_time_start, calendar_time_end)) {
		changeCalendarAddTimes();
		showAlert(calendar_add_alert, calendar_add_alert_text, "Gli orari si sovrappongono!");
		$("#calendarAddTimeStart").select();
		flag = false;
	}

	if(!flag) return false;

	/* PARSING LOCAL STORAGE */
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	/* CREATE EVENT OBJECT WITH FIELDS' VALUE */
	var calendar_event = {
		name: calendar_name,
		date: calendar_date,
		time_start: calendar_time_start,
		time_end: calendar_time_end
	};
	
	/* CHECK IF THE EVENT IS ALREADY ON THE STORAGE */
	for (i=0; i<len; i++) {
		if(sameEvent(calendar[i], calendar_event)) {
			showAlert(calendar_add_alert, calendar_add_alert_text, "Evento già presente!");
			return false;
		}
	}

	/* ADD EVENT ON STORAGE AND UPDATE CALENDAR TABLE */
	calendar[len] = calendar_event;
	localStorage.calendar = JSON.stringify(calendar);
	printCalendar();	// UPDATE CALENDAR
	return true;
}

/*------------------------------------------*/


/* ---------------------------------------- */
/* FUNZIONI PER LA MODIFICA                 */
/* ---------------------------------------- */

/* EDIT A SELECTED EXAM (FROM BUTTON) FROM THE EXAMS STORAGE */
function editExam() {
	var exam_type = $("#examEditType :selected").val();
	var exam_code = $('#examEditCode').val();
    var exam_date = $('#examEditDate').val();
    var exam_grade = $('#examEditGrade').val();
    var exam_praise = $("input[name=examEditPraise]:checked").val();
    var exam_cfu = $('#examEditCFU').val();

    var exam_edit_alert = "examEditAlert";
    var exam_edit_alert_text = "examEditAlertText";

    var flag = true;

    /* CHECK ALL FIELDS' VALUES */
	if (!checkDate(new Date(exam_date))) {
		changeExamAddDate();
		showAlert(exam_edit_alert, exam_edit_alert_text, "Data non valida!");
		$("examEditDate").select();
		flag = false;
	}
	if (!checkDateMax(new Date(exam_date))) {
		showAlert(exam_edit_alert, exam_edit_alert_text, "Data futura non valida!");
		$("#examEditDate").select();
		flag = false;
	}
	if(exam_type != "Idoneità") {
		if (!checkGrade(exam_grade)) {
			changeExamEditGrade();
			showAlert(exam_edit_alert, exam_edit_alert_text, "Voto non valido!");
			$("#examEditGrade").select();
			flag = false;
		}
	}
	if (!checkCFU(exam_cfu)) {
		changeExamEditCFU();
		showAlert(exam_edit_alert, exam_edit_alert_text, "CFU non validi!");
		$("#examEditCFU").select();
		flag = false;
	}

	if(!flag) return false;

	var grade_for_print;
	if(exam_type == "Idoneità") grade_for_print = "Idoneo";
	else grade_for_print = getGrade(exam_grade, exam_praise);

	/* PARSING LOCAL STORAGE */
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;

	/* FIND THE EXAM WHICH HAVE TO BE MODIFIED AND EDIT ITS VALUES */
	for (i=0; i<len; i++) {
		if(exams[i].code == exam_code) {
			exams[i].date = exam_date;
			exams[i].grade = grade_for_print;
			exams[i].cfu = exam_cfu;
			break;
		}
	}

	/* UPDATE STORAGE WITH NEW VALUES AND UPDATE TABLES AND CHARTS */
	localStorage.exams = JSON.stringify(exams);
	getPercentageCFU();		// UPDATE PERCENTAGE BAR
	printStatistics();	// UPDATE CHART
	printExams();	// UPDATE EXAMS
	return true;
}

/* EDIT A SELECTED (FROM BUTTON) EVENT FROM THE CALENDAR STORAGE */
function editCalendarEvent() {
	var calendar_name = $('#calendarEditName').val();
	var calendar_date = $('#calendarEditDate').val();
	var calendar_time_start = $('#calendarEditTimeStart').val();
	var calendar_time_end = $('#calendarEditTimeEnd').val();

    var calendar_edit_alert = "calendarEditAlert";
    var calendar_edit_alert_text = "calendarEditAlertText";

    var flag = true;

    /* CHECK ALL FIELDS' VALUES */
	if (!checkDate(new Date(calendar_date))) {
		changeCalendarEditDate();
		showAlert(calendar_edit_alert, calendar_edit_alert_text, "Data non valida!");
		$("#calendarEditDate").select();
		flag = false;
	}
	if (!checkDateMin(new Date(calendar_date))) {
		showAlert(calendar_edit_alert, calendar_edit_alert_text, "Data passata non valida!");
		$("#calendarEditDate").select();
		flag = false;
	}
	if (!checkTimes(calendar_time_start, calendar_time_end)) {
		changeCalendarEditTimes();
		showAlert(calendar_add_alert, calendar_add_alert_text, "Gli orari si sovrappongono!");
		$("#calendarEditTimeStart").select();
		flag = false;
	}

	if(!flag) return false;

	/* PARSING LOCAL STORAGE */
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;

	/* FIND THE EVENT WHICH HAVE TO BE MODIFIED AND EDIT ITS VALUES */
	for (i=0; i<len; i++) {
		if(calendar[i].name == calendar_name) {
			calendar[i].date = calendar_date;
			calendar[i].time_start = calendar_time_start;
			calendar[i].time_end = calendar_time_end;
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
	getPercentageCFU();	// UPDATE PERCENTAGE BAR
	printStatistics();	// UPDATE CHART
	printExams();	// UPDATE EXAMS
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
	printCalendar();	// UPDATE CALENDAR
	return true;
}

/*------------------------------------------*/



/* ---------------------------------------- */
/* FUNZIONI PER LA STAMPA O GENERICO OUTPUT */
/* ---------------------------------------- */

/* PRINT ALL EXAMS IN A BOOTSTRAP TABLE */
function printExams(ordering = "date", mode = "asc"){ // DEFAULT VALUES DATE, ASCENDENT
	if (typeof(localStorage.exams) == "undefined") return false;
	//var cfu_corso = localStorage.getItem("CFU");
	//if (cfu_corso == null) return false;
	var exams = JSON.parse(localStorage.exams);
	var len = exams.length;
	var table_body = new String("");
	var table_paging = new String("");

	/* PAGING */

	/* SHOW VALUES BASED ON WINDOW HEIGHT */
	var values_to_show = $( window ).height() - 397; // 397 -> PIXELS TAKEN BY OTHER ELEMENTS  
	var tab_height = 48;

	values_to_show = parseInt(values_to_show/tab_height)-1;
	var page_number = parseFloat(len/values_to_show);
	if (page_number > parseInt(page_number)) page_number = parseInt(page_number) + 1;
	else page_number = parseInt(page_number);

	table_paging += "\
	<nav aria-label=\"Exams pages\" id=\"examPages\">\
		<ul class=\"pagination justify-content-end\">\
			<li class=\"page-item disabled\" id=\"exam_page_previous\">\
				<a class=\"page-link\" href=\"#\" aria-label=\"Previous\" onclick=\"examShowBodyPrevious(exam_page_previous)\">\
	     			<span aria-hidden=\"true\">&laquo;</span>\
	     			<span class=\"sr-only\">Previous</span>\
	    		</a>\
	    	</li>";

	for (i=0; i<page_number; i++) {
		if (i==0) table_paging += "<li class=\"page-item active\" id=\"exam_page_button_" + (i+1) + "\"><a class=\"page-link\" href=\"#\" onclick=\"examShowBody(exam_table_body_" + (i+1) + ", exam_page_button_" + (i+1) + ", " + page_number + ")\">" + (i+1) + "</a></li>";
	  	else table_paging += "<li class=\"page-item\" id=\"exam_page_button_" + (i+1) + "\"><a class=\"page-link\" href=\"#\" onclick=\"examShowBody(exam_table_body_" + (i+1) + ", exam_page_button_"+(i+1)+", " + page_number + ")\">" + (i+1) + "</a></li>";
	}

	if (page_number <= 1) table_paging += "<li class=\"page-item disabled\" id=\"exam_page_next\">";
	else table_paging += "<li class=\"page-item\" id=\"exam_page_next\">";
	
	table_paging += "\
		<a class=\"page-link\" href=\"#\" aria-label=\"Next\" onclick=\"examShowBodyNext(exam_page_next, " + page_number + ")\">\
        	<span aria-hidden=\"true\">&raquo;</span>\
        	<span class=\"sr-only\">Next</span>\
      	</a>\
    </li>\
    </ul>\
    </nav>";
    /* --- END PAGING --- */

    if(ordering == null || ordering == "") ordering = "date";
    if(mode == null || mode == "") mode = "asc";

    /* ADD ARROW TO ORDERING PARAMETER */
	var code_string = "Codice";
	var date_string = "Data";
	var grade_string = "Voto";
	var cfu_string = "CFU";

	var arrow_up = "&#x25B2;";
	var arrow_down = "&#x25BC;";

	/* CHECK ORDERING MODE AND PARAMETER AND UPDATE STRING OF THE PARAMETER WHICH IS BEING ORDERED BY WITH ARROW */
	if (mode == "asc") {
		/* &#x25BC; -> ASCII Arrow Down */
		switch (ordering) {
			case "code": 
					code_string += arrow_down;
					break;
			case "date":
					date_string += arrow_down;
					break;
			case "grade":
					grade_string += arrow_down;
					break;
			case "cfu":
					cfu_string += arrow_down;
					break;
			default:
					date_string += arrow_down;
					break;
		}
	} else {
		/* &#x25BC; -> ASCII Arrow Down */
		switch (ordering) {
			case "code": 
					code_string += arrow_up;
					break;
			case "date":
					date_string += arrow_up;
					break;
			case "grade":
					grade_string += arrow_up;
					break;
			case "cfu":
					cfu_string += arrow_up;
					break;
			default:
					date_string += arrow_up;
					break;
		}
	}


    /* ORDERING */
	exams.sort(function(a,b) {
		/* ASCENDENT ORDERING */
		if (mode == "asc") {
			if (ordering == "code") return a.code.localeCompare(b.code);
			else if (ordering == "date") return new Date(a.date) - new Date(b.date); 
			else if (ordering == "grade"){
				if (a.grade == "Idoneo") return -1;
				if (b.grade == "Idoneo") return 1;
				return a.grade - b.grade;
			}
			else if (ordering == "cfu") return a.cfu - b.cfu;
		}
		/* DESCENDENT ORDERING */
		else {
			if (ordering == "code") return b.code.localeCompare(a.code);
			else if (ordering == "date") return new Date(b.date) - new Date(a.date); 
			else if (ordering == "grade") {
				if (a.grade == "Idoneo") return 1;
				if (b.grade == "Idoneo") return -1;
				return b.grade - a.grade;
			}
			else if (ordering == "cfu") return b.cfu - a.cfu;
		}
	});

	/* CONTROLS WHICH ONE HAS BEEN PRESSED AND CHANGE ASC/DESC MODE ON NEXT CLICK, ASC DEFAULT*/
	table_body += "\
	<table class=\"table table-striped table-hover table-bordered table-sm\" border=\"1px\" id=\"examTable\">\
			<thead>\
				<tr>";

	/* CHECK ORDERING FOR STRING ON TABLE HEADER */
	table_body += "<th width=\"40%\">";
	if(ordering == "code" && mode == "asc") table_body += "<a class=\"th-link\" id=\"exam_th_code\" onclick=\"printExams(\'code\', \'desc\')\">" + code_string + "</a></th>";
	else table_body += "<a class=\"th-link\" id=\"exam_th_code\" onclick=\"printExams(\'code\', \'asc\')\">" + code_string + "</a></th>";

	table_body += "<th width=\"15%\">";
	if(ordering == "date" && mode == "asc") table_body += "<a class=\"th-link\" id=\"exam_th_date\" onclick=\"printExams(\'date\', \'desc\')\">" + date_string + "</a></th>";
	else table_body += "<a class=\"th-link\" id=\"exam_th_date\" onclick=\"printExams(\'date\', \'asc\')\">" + date_string + "</a></th>";

	table_body += "<th width=\"15%\">";
	if(ordering == "grade" && mode == "asc") table_body += "<a class=\"th-link\" id=\"exam_th_grade\" onclick=\"printExams(\'grade\', \'desc\')\">"+ grade_string + "</a></th>";
	else table_body += "<a class=\"th-link\" id=\"exam_th_grade\" onclick=\"printExams(\'grade\', \'asc\')\">"+ grade_string + "</a></th>";

	table_body += "<th width=\"10%\">";
	if(ordering == "cfu" && mode == "asc") table_body += "<a class=\"th-link\" id=\"exam_th_cfu\" onclick=\"printExams(\'cfu\', \'desc\')\">" + cfu_string + "</a></th>";
	else table_body += "<a class=\"th-link\" id=\"exam_th_cfu\" onclick=\"printExams(\'cfu\', \'asc\')\">" + cfu_string + "</a></th>";
	
	table_body += "<th width=\"20%\"><i class=\"material-icons\">settings</i></th>\
				</tr>\
			</thead>";
	
	var i=0;
	/* PRINTS ALL TABLE BODIES */
	for (j=0; j<page_number; j++) {
		if (j==0) { table_body += "<tbody id=\"exam_table_body_"+ (j+1) +"\" style=\"visibility: visible;\">"; }	// SHOW ONLY FIRST TABLE'S PAGE
		else { table_body += "<tbody id=\"exam_table_body_"+ (j+1) +"\" style=\"visibility: collapse; display: none;\">"; }	// OTHERS HIDDEN
		var next_table_max = (j+1)*values_to_show;
		for (i=i; i<next_table_max && i<len; i++) {
			var type = exams[i].type;
			var code = exams[i].code;
			var date = exams[i].date;
			var grade = exams[i].grade;
			var cfu = exams[i].cfu;
			var grade_for_print = grade;	// IDONEO IF IDONEITA'

			// FOR 30 WITH PRAISE
			if (grade == 31) {
				grade_for_print = "30 e Lode";
				table_body += "<tr class=\"table table-success\">";
			}
			else table_body += "<tr>";

			table_body += "<td id=\"tableExamCode"+code+"\">" + code + "</td>";
			table_body += "<td id=\"tableExamDate"+code+"\">" + date + "</td>";
			table_body += "<td id=\"tableExamGrade"+code+"\">" + grade_for_print + "</td>";
			table_body += "<td id=\"tableExamCFU"+code+"\">" + cfu + "</td>";
			table_body += "<td id=\"tableExamSetting"+code+"\"><button class=\"btn btn-danger btn-sm\" id=\"rmv_exam_"+code+"\" onclick=\"removeExam(\'"+code+"\')\" style=\"margin-right: 10px;\"><i class=\"material-icons\">delete</i></button>";
			table_body += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#examEditForm\"  id=\"edit_exam_"+code+"\")\" onclick=\"initEditExam(\'" + type + "\',\'" + code+"\',\'"+date+"\',\'"+grade+"\',\'"+cfu+"\')\"><i class=\"material-icons\">create</i></button></td></tr>";
		}
		table_body += "</tbody>";
	}

	table_body += "</table>";

	$("#my_exams").html(table_body);
	$("#my_exams_paging").html(table_paging);
	return true;
}


/* PRINT ALL EVENTS FROM CALENDAR STORAGE (WITH DELETE/EDIT BUTTONS) */
function printCalendar(){
	/* OPEN STORAGE IF ITS DEFINED */
	if (typeof(localStorage.calendar) == "undefined") return false;
	var calendar = JSON.parse(localStorage.calendar);
	var len = calendar.length;
	var table_body = new String("");	// CONTAINS TABLE
	var table_paging = new String("");	// CONTAINS PAGING

	/* PAGING */
	var values_to_show = $( window ).height() - 397; // 397 -> PIXELS TAKEN BY OTHER ELEMENTS  
	var tab_height = 48;

	values_to_show = parseInt(values_to_show/tab_height)-1;
	var page_number = parseFloat(len/values_to_show);
	if (page_number > parseInt(page_number)) page_number = parseInt(page_number) + 1;
	else page_number = parseInt(page_number);

	/* INIT PAGING AND PRINT PREVIOUS BUTTON DISACTIVATED */
	table_paging += "\
	<nav aria-label=\"Calendar pages\" id=\"calendarPages\">\
		<ul class=\"pagination justify-content-end\">\
			<li class=\"page-item disabled\" id=\"calendar_page_previous\">\
				<a class=\"page-link\" href=\"#\" aria-label=\"Previous\" onclick=\"calendarShowBodyPrevious(calendar_page_previous)\">\
	     			<span aria-hidden=\"true\">&laquo;</span>\
	     			<span class=\"sr-only\">Previous</span>\
	    		</a>\
	    	</li>";

	/* PRINT PAGE_NUMBER BUTTONS */
	for (i=0; i<page_number; i++) {
		if (i==0) table_paging += "<li class=\"page-item active\" id=\"calendar_page_button_" + (i+1) + "\"><a class=\"page-link\" href=\"#\" onclick=\"calendarShowBody(calendar_table_body_" + (i+1) + ", calendar_page_button_" + (i+1) + ", " + page_number + ")\">" + (i+1) + "</a></li>";
	  	else table_paging += "<li class=\"page-item\" id=\"calendar_page_button_" + (i+1) + "\"><a class=\"page-link\" href=\"#\" onclick=\"calendarShowBody(calendar_table_body_" + (i+1) + ", calendar_page_button_"+(i+1)+", " + page_number + ")\">" + (i+1) + "</a></li>";
	}

	/* CHECK IF ACTIVE NEXT BUTTON */
	if (page_number <= 1) table_paging += "<li class=\"page-item disabled\" id=\"calendar_page_next\">";
	else table_paging += "<li class=\"page-item\" id=\"calendar_page_next\">";
	
	/* PRINT NEXT BUTTON AND CLOSE PAGING */
	table_paging += "\
		<a class=\"page-link\" href=\"#\" aria-label=\"Next\" onclick=\"calendarShowBodyNext(calendar_page_next, " + page_number + ")\">\
        	<span aria-hidden=\"true\">&raquo;</span>\
        	<span class=\"sr-only\">Next</span>\
      	</a>\
    </li>\
    </ul>\
    </nav>";


	/* SORT EVENTS BY DATE ASCENDENT */
	calendar.sort(function(a,b) { 
	    return new Date(a.date+" "+a.time_start) - new Date(b.date+" "+b.time_start); 
	});
	
	/* PREPARE TABLE */
	table_body += "\
			<table class=\"table table-striped table-hover table-bordered table-sm\" border=\"1px\" id=\"calendarTable\">\
				<thead>\
					<tr>\
						<th width=\"20%\">Evento</th>\
						<th width=\"15%\">Data</th>\
						<th width=\"10%\">Inizio</th>\
						<th width=\"10%\">Fine</th>\
						<th width=\"20%\">Scadenza</th>\
						<th width=\"25%\"><i class=\"material-icons\">settings</i></th>\
					</tr>\
				</thead>";

	/* TAKE ALL VALUES FROM THE LOCAL STORAGE AND INSERT EACH EVENT ON A ROW */
	var i=0;
	for (j=0; j<page_number; j++) {
		if (j==0) { table_body += "<tbody id=\"calendar_table_body_"+ (j+1) +"\" style=\"visibility: visible;\">"; }	// SHOW ONLY FIRST TABLE'S PAGE
		else { table_body += "<tbody id=\"calendar_table_body_"+ (j+1) +"\" style=\"visibility: collapse; display: none;\">"; }	// OTHERS HIDDEN
		var next_table_max = (j+1)*values_to_show;
		for (i=i; i<next_table_max && i<len; i++) {
			var name = calendar[i].name;
			var date = calendar[i].date;
			var time_start = calendar[i].time_start;
			var time_end = calendar[i].time_end;
			var dateDiff = dateDiffInDays(new Date(getToday()), date);
			var dateDiff_for_print = dateDiff;
			var time_start_for_print = time_start;
			var time_end_for_print = time_end;

			/* IF TIME IS NOT DEFINED, PRINTS N.D. INSTEAD OF AN EMPTY STRING */
			if(time_start == "") time_start_for_print = "N.D.";
			if(time_end == "") time_end_for_print = "N.D.";

			/* IF DISTANCE FROM TODAY > 10 -> NORMAL ROW, IF >5 AND <=10 WARNING, ELSE DANGER */
			if (dateDiff > 10) table_body += "<tr>";
			else if (dateDiff > 0) table_body += "<tr class=\"table table-warning\">";
			else if (dateDiff == 0) table_body += "<tr class=\"table table-success\">";
			else table_body += "<tr class=\"table table-danger\">";

			
			/* CHECK FOR DISTANCE FROM TODAY (TODAY, TOMORROW OR YESTERDAY) */
			if(dateDiff == 1) dateDiff_for_print = "Domani";
			else if(dateDiff == 0) dateDiff_for_print = "Oggi";
			else if(dateDiff == -1) dateDiff_for_print = "Ieri";
			
			table_body += "<td id=\"tableCalendarName"+name+"\">" + name + "</td>";
			table_body += "<td id=\"tableCalendarDate"+name+"\">" + date + "</td>";
			table_body += "<td id=\"tableCalendarTimeStart"+name+"\">" + time_start_for_print + "</td>";
			table_body += "<td id=\"tableCalendarTimeEnd"+name+"\">" + time_end_for_print + "</td>";
			table_body += "<td id=\"tableCalendarDiff"+name+"\">" + dateDiff_for_print + "</td>";

			/* REMOVE AND EDIT BUTTONS */
			table_body += "<td id=\"tableCalendarSetting"+name+"\"><button class=\"btn btn-danger btn-sm\" id=\"rmv_event_"+name+"\" onclick=\"removeEvent(\'"+name+"\')\" style=\"margin-right: 10px;\"><i class=\"material-icons\">delete</i></button>";
			table_body += "<button class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#calendarEditForm\"  id=\"edit_event_"+name+"\" onclick=\"initEditEvent(\'"+name+"\',\'"+date+"\',\'"+time_start+"\',\'"+time_end+"\')\"><i class=\"material-icons\">create</i></button></td></tr>";
		}
		table_body += "</tbody>";
	}
	table_body += "</table>";
	$("#my_calendar").html(table_body);
	$("#my_calendar_paging").html(table_paging);
	return true;
}

/* PRINT STATISTICS FOR EXAMS */
function printStatistics() {
	/* OPEN STORAGE IF ITS DEFINED */
	if (typeof(localStorage.exams) == "undefined") return false;
	var cfu_corso = localStorage.getItem("CFU");
	//if (cfu_corso == null) return false;
	var exams = JSON.parse(localStorage.exams);
	var total_len = exams.length;

	var s = new String("");	// TABLE STRING

	var voti = new Array();	// GRADES ARRAY
	var date = new Array();	// DATES ARRAY
	var codici = new Array();	// CODES ARRAY 
	var media_time = new Array();	// AVERAGE VARIATION EXAM BY EXAM
	var media_const_array = new Array();	// AVERAGE LINE (CONST)
	var media_ponderata_const_array = new Array();	// WEIGHTED AVERAGE LINE (CONST)

	var media = 0.0;	// AVERAGE
	var media_ponderata = 0.0;	// WEIGHTED AVERAGE
	var cfu_totali = 0.0;	// TOTAL CFU FOR WEIGHTED AVERAGE

	/* EXCLUDES IDONEITIES */
	exams = exams.filter(function(a) {return a.type == "Esame"});

	/* SORT EXAMS BY DATE */
	exams.sort(function(a,b) { 
	    return new Date(a.date) - new Date(b.date); 
	});

	/* LENGTH ONLY EXAMS */
	var len = exams.length;

	/* GENERATE GRADES, DATES AND AVERAGE VARIATION ARRAYS */
	for (i=0; i<len; i++) {
		var codice = exams[i].code;
		var voto = exams[i].grade;
		var data = exams[i].date;
		var cfu = exams[i].cfu;
		
		/* INCREMENTS */
		media += parseFloat(voto);
		media_ponderata += parseFloat(voto)*parseFloat(cfu);
		cfu_totali += parseFloat(cfu);

		codici[i] = codice;
		voti[i] = voto;
		date[i] = data;

		/* CALCULATE AVERAGE ON THE I-TIME */
		var avg = 0.0;
		for (j=0; j<voti.length; j++) {
			avg += parseFloat(voti[j]);
		}
		media_time[i] = (avg/voti.length).toFixed(2);
	}

	media = (media/len).toFixed(2);	// ONLY 2 NUMBERS AFTER POINT
	media_ponderata = (media_ponderata/cfu_totali).toFixed(2);	// ONLY 2 NUMBERS AFTER POINT

	/* FILL TWO ARRAY WITH THE AVERAGE AND THE WEIGHTED AVERAGE (WITH ONLY 1 VALUES ON ALL THE CELLS) */
	for (i=0; i<len; i++) {
		media_const_array[i] = media;
		media_ponderata_const_array[i] = media_ponderata;
	}

	/* GENERATE THE TABLE */
	s += "<div id=\"mediaDiv\">";
	s += "<table class=\"table table-striped table-bordered table-sm\" border=\"1px\"><tr><th>Media</th><th>Media Ponderata</th><th>Esami Dati</th><th>CFU Ottenuti</th><th>CFU Richiesti</th></tr>";
	s += "<tr><td>" + media + "</td><td>" + media_ponderata + "</td><td>" + total_len + "</td><td>" + getProgress() + "</td><td>" + cfu_corso + "</td></tr></table></div>";

	/* DRAW THE GRAPHIC */
	var ctx = $("#user_chart").get(0).getContext('2d');
	new Chart(ctx,{
		type: "line",
		
		data: {
			labels: codici,
			datasets: [
			/* GRADES */
			{
				label: "Voto",
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
			tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                	/* CHANGE TITLE ON HOVER WITH EXAM CODE */
                    title: function(tooltipItems, data) { 
                        return codici[tooltipItems[0].index];
                    }
                }
            },
			scales: {
            	yAxes: [{
            		ticks: {
            			/* MIN AND MAX GRADE VALUES */
						min: 18,
						max: 31,
						stepSize: 1
					}
				}],
				xAxes: [{
					labels: date,
					ticks: {
						/* X LABEL ROTATION */
						autoSkip: false,
				        maxRotation: 75,
				        minRotation: 75
					}
				}]
            }
        }
	});

	$("#my_statistics").html(s);
	return true;
}