//display current day
$("#currentDay").text(moment().format('dddd, MMM Do YYYY'));

//display timeblocks
for (var i = 0; i<9; i++){
	var timeBlockEl = $("<div>");
	timeBlockEl.attr("class", "row");
	$(".container").append(timeBlockEl);
}

//adding three parts into each timeblocks
$(".row").each(function(i){
	console.log($(this));
	console.log(i);
	var timerEl = $("<div>");
	timerEl.attr("class", "time-block hour");
	$(this).append(timerEl);

	var userInput = $("<textarea>");
	userInput.attr({
		"class":"description",
		"id":"text"+i
	});
	$(this).append(userInput);

	var saveBtn = $("<button>");
	saveBtn.attr({
		"class":"saveBtn",
		"id":"btn"+i
	});
	$(this).append(saveBtn);
});

//adding icons into save button
$(".saveBtn").each(function(){
	console.log(this);
	var iconSave = $('<i class="material-icons">archive</i>');
	iconSave.css("font-size","40px");
	$(this).append(iconSave);
});

//adding hour into timerEL
$(".time-block").each(function(i,element){
	if(i<4){
		var index = i+9;
		$(this).text(index+"AM");
	}else{
		var index = i-3;
		$(this).text(index+"PM");
	}
});

//save button
$(".saveBtn").click(function(){
	var i = $(this).attr("id");
	var value = $(this).parent(".row").children(".description").val().trim();
	localStorage.setItem(i,value);
});

//displaying texts
$("textarea").on("keyup",function(){
	var i = $(this).parent(".row").children(".saveBtn").attr("id");
	var value = $(this).val().trim();
	localStorage.setItem(i,value);
	// $(this).text(localStorage.getItem(i));
});

$("textarea").each(function(){
	var i = $(this).parent(".row").children(".saveBtn").attr("id");
	// var value = $(this).val().trim();
	// localStorage.setItem(i,value);
	$(this).text(localStorage.getItem(i));
});

var latitude;
var longitude;
$(document).ready(function(){
	var locationHolder = $("<div>");
	locationHolder.text("...Locating");
	$("header").append(locationHolder);

	setInterval(function(){
		//get the current time frm moment.js
		var currentTime = parseInt(moment().format('HH'));
		//changing the color of textarea
		//according to the current time
		$(".row").each(function(){
			//change all time into 24H
			var time = parseInt($(this).children(".time-block").text())
			if(time<6){
				time +=12;
			}

			var inputArea = $(this).children("textarea");
			if(time<currentTime){
				inputArea.addClass("past");
				inputArea.removeClass("present future");
			}
			else if(time === currentTime){
				inputArea.addClass("present");
				inputArea.removeClass("past future");	
			}
			else{
				inputArea.addClass("future");
				inputArea.removeClass("present past");
			}
		});
	},100);

//get the geolocation of user
	function locationSuccess(position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		// var altitude = position.coords.altitude;
		// var accuracy = position.coords.accuracy;
		// var altitudeAccuracy = position.coords.altitudeAccuracy;
		// var heading = position.coords.height;
		// var speed = position.coords.speed;
		// var timestamp = position.timestamp;
		if(latitude && longitude){
		
			var queryURL = "https://api.opencagedata.com/geocode/v1/json?q="+latitude+"%2C"+"+"+longitude+"&key=f1e329be05284ac6aa0cee3165fa5fff&pretty=1";
	
			$.ajax({
				url: queryURL,
				method: "GET"
				}).then(function(response) {
				console.log(response.results[0]);
				locationHolder.text("You are now in: "+response.results[0].formatted);
				});
		}
	}

	function locationError(error) {
		var code = error.code;
		var message = error.message;
	}

	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);

});