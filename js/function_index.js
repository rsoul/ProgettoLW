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

function setTitle(title) {document.title = title;}
function setDateMax(today) {document.getElementById("exam_date").setAttribute("max", today);}
function setDateDefault(today) {document.getElementById("exam_date").value = today;}

/* On body load, set maxium (and default) date of the exam_date field and the title of the page */
function loadingPage() {
	var today = getToday();
	var title = "CFU Book";
	setTitle(title);
	setDateMax(today);
	setDateDefault(today);
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