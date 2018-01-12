var mainCur;
var intraDayData;
var dailyData;
var topClicked = function(val){
		
	var xmlhttp = new XMLHttpRequest(),
	json;
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			json = JSON.parse(xmlhttp.responseText);
			//do something with your json
			console.log(json);
			document.getElementById("PriceData").innerHTML ="<h3>Current Valuation of: " + val[0] + "(" +val[1] + ")" + "</h3>";
			document.getElementById("PriceData").innerHTML +="<h4>Price: $" + json["USD"] + "</h4>";
		}
	};
	mainCur = val;
	currency = val;
	console.log
	xmlhttp.open('GET', 'https://min-api.cryptocompare.com/data/price?fsym='+ val[1] +'&tsyms=USD', true);
	xmlhttp.send();
}

var intraDayGraph = function(){
	var xmlhttp = new XMLHttpRequest(),
	json;
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			json = JSON.parse(xmlhttp.responseText);
			//do something with your json
			console.log(json);
			createDayGraph(json);
		}
	};
	
	xmlhttp.open('GET', 'https://min-api.cryptocompare.com/data/histominute?fsym='+mainCur[1]+'&tsym=USD&limit=287&agregate=5&e=CCCAGG', true);
	xmlhttp.send();
}

var MonthGraph = function(){
	console.log(mainCur[1]);
	var xmlhttp = new XMLHttpRequest(),
	json;
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			json = JSON.parse(xmlhttp.responseText);
			//do something with your json
			console.log(json);
			createMonthGraph(json);
		}
	};
	
	xmlhttp.open('GET', 'https://min-api.cryptocompare.com/data/histoday?fsym='+mainCur[1]+'&tsym=USD&limit=29&e=CCCAGG', true);
	xmlhttp.send();
};
function createMonthGraph(json){
	var today = new Date();
	var lastDate = today.getUTCFullYear() +"-"+ (today.getUTCMonth() + 1)+"-"+ today.getUTCDate();
	lastDate = addZeros(lastDate);
	console.log(lastDate);
	var days = new Array();
	var i = 29;
	var priceData = new Array();
	for(i = 29; i>=0;i--){
		lastDate = addZeros(dayBefore(lastDate));
		days[i] = lastDate;
		priceData[i] = json["Data"][i]["close"];
	}
	var data = new Array();
	for(i=0;i<30;i++){
		data[i] = {
			x:days[i],
			y:priceData[i]
		};
	}
	console.log(data[1]['y']);
	var ctx = document.getElementById("myChart");
	var myChart = new Chart(ctx,{
		type: 'line',
		data: {
			datasets: [{
				label: mainCur[0],
				data: data
			}],
			labels: days
		}
	})
}
function YearGraph(){
	console.log(mainCur[1]);
	var xmlhttp = new XMLHttpRequest(),
	json;
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			json = JSON.parse(xmlhttp.responseText);
			//do something with your json
			console.log(json);
			createYearGraph(json);
		}
	};
	
	xmlhttp.open('GET', 'https://min-api.cryptocompare.com/data/histoday?fsym='+mainCur[1]+'&tsym=USD&limit=121&agregate=3&e=CCCAGG', true);
	xmlhttp.send();
}
function createYearGraph(json){
	var today = new Date();
	var lastDate = today.getUTCFullYear() +"-"+ (today.getUTCMonth() + 1)+"-"+ today.getUTCDate();
	lastDate = addZeros(lastDate);
	console.log(lastDate);
	var days = new Array();
	var i = 121;
	var priceData = new Array();
	for(i = 121; i>=0;i--){
		lastDate = addZeros(dayBefore(lastDate));
		days[i] = lastDate;
		lastDate = addZeros(dayBefore(lastDate));
		lastDate = addZeros(dayBefore(lastDate));
		
		priceData[i] = json["Data"][i]["close"];
	}
	var data = new Array();
	for(i=0;i<122;i++){
		data[i] = {
			x:days[i],
			y:priceData[i]
		};
	}
	console.log(data[1]['y']);
	var ctx = document.getElementById("myChart");
	var myChart = new Chart(ctx,{
		type: 'line',
		data: {
			datasets: [{
				label: mainCur[0],
				data: data
			}],
			labels: days
		}
	})
}

//returns the date before the one passed as a string
//note: expects yyyy-MM-DD format for the date, ie 2018-01-01, not 2018-1-1
var dayBefore = function(day){
	daySplit = day.split("-");
	if(daySplit[2]>1){
		daySplit[2] = daySplit[2] - 1;
		return daySplit[0] + "-" + daySplit[1] + "-" + daySplit[2];
	}
	else{
		switch(daySplit[1]){
			case "12":
				return daySplit[0] + "-11-30";
				break;
			case "11":
				return daySplit[0] + "-10-31";
				break;
			case "10":
				return daySplit[0] + "-09-30";
				break;
			case "09":
				return daySplit[0] + "-08-31";
				break;
			case "08":
				return daySplit[0] + "-07-31";
				break;
			case "07":
				return daySplit[0] + "-06-30";
				break;
			case "06":
				return daySplit[0] + "-05-31";
				break;
			case "05":
				return daySplit[0] + "-04-30";
				break;
			case "04":
				return daySplit[0] + "-03-31";
				break;
			case "03":
				if(daySplit[0]%4 == 0){
					return daySplit[0] + "-02-29";
				}
				else{
					return daySplit[0] + "-02-28";
				}
				break;
			case "02":
				return daySplit[0] + "-01-31";
				break;
			case "01":
				daySplit[0] = daySplit[0] - 1;
				return daySplit[0] + "-12-31";
				break;
			default:
				return day;
				
		
		}
	}
}

//remove leading zeros from month and day
var removeZeros = function(date){
	dateSplit = date.split("-");
	if(dateSplit[1].charAt(0) == "0"){
		dateSplit[1] = dateSplit[1].charAt(1)}
	if(dateSplit[2].charAt(0) == "0"){
		dateSplit[2] = dateSplit[2].charAt(1)}
	date = dateSplit[0] + "-" + dateSplit[1] + "-" + dateSplit[2];
	return date;
}

//adds leading zeros to single digit months and days
var addZeros = function(date){
	dateSplit = date.split("-");
	if(dateSplit[1].length == 1){
		dateSplit[1] = "0"+dateSplit[1];
	}
	if(dateSplit[2].length == 1){
		dateSplit[2] = "0"+dateSplit[2];
	}
	date = dateSplit[0] + "-" + dateSplit[1] + "-" + dateSplit[2];
	return date;
}

function createDayGraph(json){
	var dateTime = new Date();
	var times = new Array();
	var priceData = new Array();
	var i = 287;
	for(i = 287; i>=0; i--){
		times[i] = dateTime.getHours()+ ":" + dateTime.getMinutes();
		dateTime = subMinutes(dateTime, 5);
		priceData[i] = json["Data"][i]["close"];
	}
	var data = new Array();
	for(i=0;i<287;i++){
		data[i] = {
			x:times[i],
			y:priceData[i]
		};
	}
	console.log(data[1]['y']);
	var ctx = document.getElementById("myChart");
	var myChart = new Chart(ctx,{
		type: 'line',
		data: {
			datasets: [{
				label: mainCur[0],
				data: data
			}],
			labels: times
		}
	})
}

function subMinutes(date, minutes) {
    return new Date(date.getTime() - minutes*60000);
}