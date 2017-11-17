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

/* Set date default and max on add_exam html form */
function setExamDate(today) {
	var exam_date = document.getElementById("inputDate");
	exam_date.setAttribute("max", today);
	exam_date.value = today;
}

function setMiniumEventDate(today) {
	var date = document.getElementById("inputDateCalendar");
	date.setAttribute("min", today);
	date.value = today;
}

/* Check if exam grade is == 30, then show praise radio buttons */
function showPraise() {
	var praise = document.getElementById("praiseDiv");
	var grade = document.getElementById("inputGrade");
	if(grade.value == "30") {
		praise.style.visibility = "visible";
		praise.style.display = "block";
	}
	else {
		praise.style.visibility = "collapse";
		praise.style.display = "none";
	}
}

/* Function for showing FAQS */
function showQuestion(id) {
	var elem = document.getElementById(id);
	if (elem.style.visibility == "visible") {
		elem.style.visibility = "collapse";
		elem.style.display = "none";
	}
	else {
		elem.style.visibility = "visible";
		elem.style.display = "block";
	}
}

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
}