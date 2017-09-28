var jsonData=[]
var myConfig;
var dbt=[];
var crd=[];
var dbtAccounts = {};
var lastNetAmt = {};
//var crdAccounts = {};
var arraySeries = [];
var minDate = [];
var dailyData = [];
var weeklyData = [];
var monthlyData = [];
var quarterlyData = [];
var halfYearlyData = [];
var yearlyData = [];
var weeklyConfig;
var firstDate;
var data_;
var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var dateRegex = /(\d{4})(\d{2})(\d{2})/;  //RegEx to separate date into y-m-d


var ColorsList = {
        aqua: "#00ffff",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        black: "#000000",
        blue: "#0000ff",
        brown: "#a52a2a",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgrey: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkviolet: "#9400d3",
        fuchsia: "#ff00ff",
        gold: "#ffd700",
        green: "#008000",
        indigo: "#4b0082",
        khaki: "#f0e68c",
        lightblue: "#add8e6",
        lightcyan: "#e0ffff",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        magenta: "#ff00ff",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        orange: "#ffa500",
        pink: "#ffc0cb",
        purple: "#800080",
        violet: "#800080",
        red: "#ff0000",
        silver: "#c0c0c0",
        white: "#ffffff",
        yellow: "#ffff00"
    };

 // $.ajax({
 //          url: "http://localhost:2999/Derived",
 //          headers: { sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3' },
 //          type: "GET",
 //          success: function(result) { //alert('Success!' );
function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}


$.getJSON("data2.json", function(result) {
	alert("success");

result['data'] = result['data'].sort(function (a,b) {
	return parseFloat(a.runDate) - parseFloat(b.runDate);
});
data_ = result["data"];


firstD=result['data'][0].runDate;
allDate = dateRegex.exec(firstD);
dateInEpochFormat = allDate[1]+"-"+allDate[2]+"-"+allDate[3]+"T00:00:00+0000";
var firstDateFormatted = new Date(dateInEpochFormat);
firstDate = firstDateFormatted.getTime();




var colors = ["#800000",
         "#00ffff",
         "#f5f5dc",
         "#00ff00",
        "#4b0082",
         "#a52a2a",
        "#00ffff",
        "#00008b",
        "#008b8b",
        "#a9a9a9",
         "#006400",
         "#bdb76b",
        "#8b008b"];


	for (i in result.data){
		var accName=result.data[i].accName;   //Get the account name 

		if (dbtAccounts[accName]){
			dbtAccounts[accName].push(Number(result.data[i].crdAmt)-Number(result.data[i].dbtAmt) - lastNetAmt[accName]);	
		}
		else{
			s = dateRegex.exec(result.data[i].runDate);
			var startingDate = new Date(Number(s[1]),Number(s[2])-1,Number(s[3]));
			var diffDays = Math.round(Math.abs((firstDateFormatted.getTime() - startingDate.getTime())/(oneDay)));
			
			dbtAccounts[accName]=fillArray(null,diffDays);
			dbtAccounts[accName].push(Number(result.data[i].crdAmt)-Number(result.data[i].dbtAmt));	
		}	
		lastNetAmt[accName] = Number(result.data[i].crdAmt-Number(result.data[i].dbtAmt));
	}

	for ( i in dbtAccounts){
		var col = colors.shift();
		colors.push(col);

		
		var x=	{
					values: dbtAccounts[i],//[218.92,212.85,241.95,200.76,203.87,245.26],
					lineColor:col, //color.rgb,//'#214247',
					marker:{
					  backgroundColor:col//color.rgb,//'#E34247'
					},
					text: i 
				};
		arraySeries.push(x);	
	}

    dailyData = arraySeries;
	myConfig = {
	 	type: 'line',
	 	backgroundColor: '#2C2C39',
	 	title:{
	 	  text:'تقرير حسابات الدائن و المدين',
	 	  rtl: true,
	 	  adjustLayout: true,
	 	  fontColor:"#E3E3E5",
	 	  marginTop: 7
	 	},
	 	"legend":{
            "layout":"x1",
            "width":"180px",
            "x":"74%",
            "y":"9.5%",
            rtl: true,
            "alpha":1,
            "shadow":0,
            "max-items":Object.keys(dbtAccounts).length,
            "overflow":"page",
            "draggable":true,
            "minimize":true,
            "header":{
                "text":"Select Account"
            }
        },
	 	plotarea:{
	 	  margin:'dynamic 70'
	 	},
	 	plot:{
	 	  aspect: 'spline',
	 	  lineWidth: 2,
	 	  marker:{
	 	    borderWidth: 0,
	 	    size: 5
	 	  }
	 	},
	 	scaleX:{
	 	  lineColor: '#E3E3E5',
	 	  zooming: true,
	 	  zoomTo:[0,15],
	 	  minValue: firstDate,//1459468800000,
	 	  step: 'day',
	 	  item:{
	 	    fontColor:'black',//'#E3E3E5'
	 	  },
	 	  transform:{
	 	    type: 'date',
	 	    all: '%d %M %Y'
	 	  }
	 	},
	 	scaleY:{
	 	  minorTicks: 1,
	 	  lineColor: 'black',//'#E3E3E5',
	 	  tick:{
	 	    lineColor: 'black',//'#E3E3E5'
	 	  },
	 	  minorTick:{
	 	    lineColor: 'black',//'#E3E3E5'
	 	  },
	 	  minorGuide:{
	 	    visible: true,
	 	    lineWidth: 1,
	 	    lineColor: 'black',//'#E3E3E5',
	 	    alpha: 0.7,
	 	    lineStyle: 'dashed'
	 	  },
	 	  guide:{
	 	    lineStyle: 'dashed'
	 	  },
	 	  item:{
	 	    fontColor:'black',//'#E3E3E5'
	 	  }
	 	},
	 	tooltip:{
	 	  borderWidth: 0,
	 	  borderRadius: 3,
	 	  rtl: true
	 	},
	 	preview:{
	 	  adjustLayout: true,
	 	  borderColor:'black',//'#E3E3E5',
	 	  mask:{
	 	    backgroundColor:'black',//'#E3E3E5'
	 	  }
	 	},
	 	crosshairX:{
	 	  plotLabel:{
	 	    multiple: true,
	 	    borderRadius: 3
	 	  },
	 	  scaleLabel:{
	 	    backgroundColor:'#53535e',
	 	    borderRadius: 3
	 	  },
	 	  marker:{
	 	    size: 7,
	 	    alpha: 0.5
	 	  }
	 	},
	 	crosshairY:{
	 	  lineColor:'#E3E3E5',
	 	  type:'multiple',
	 	  scaleLabel:{
	 	    decimals: 2,
	 	    borderRadius: 3,
	 	    offsetX: -5,
	 	    fontColor:"#2C2C39",
	 	    bold: true
	 	  }
	 	},
	 	shapes:[
	              {
	                type:'rectangle',
	                id:'view_all',
	                height:'20px',
	                width:'75px',
	                borderColor:'#E3E3E5',
	                borderWidth:1,
	                borderRadius: 3,
	                x:'85%',
	                y:'11%',
	                backgroundColor:'#53535e',
	                cursor:'hand',
	                label:{
	                  text:'View All',
	                  fontColor:'#E3E3E5',
	                  fontSize:12,
	                  bold:true
	                }
	              }
	           ],
		series:arraySeries 	
	};
//debugger;
zingchart.render({ 
	id: 'myChart', 
	data: myConfig, 
	height: '500', 
	width: '725' 
});

	  // }});
GenerateTable(1,data_);
});


function setDaily(){
	// alert('Report is daily now' )
	myConfig.series = dailyData;
	zingchart.render({ 
	id: 'myChart', 
	data: myConfig, 
	height: '500', 
	width: '725' 
	});
	GenerateTable(1,data_);
}

function setWeekly(){
	//alert('Report is Weekly now' )
	// weeklyConfig = $.extend(true,{}, myConfig);
 	if(weeklyData.length == 0){
		sJson = JSON.stringify(arraySeries);
		weeklyData = JSON.parse(sJson);
		for (i = 0; i < arraySeries.length; ++i) {
			weeklyData[i].values = [];
			var values7 = 0
		    for(j = 0; j < arraySeries[i].values.length; j+=7){
		    	if(j %7 ==0){
		    		weeklyData[i].values.push(values7);
		    		values7 = 0;
		    	}
		    	values7 += arraySeries[i].values[j];

		    } 
		}
	}
	myConfig.series = weeklyData;
	myConfig.scaleX.step = 'week';
	zingchart.render({ 
		id: 'myChart', 
		data: myConfig, 
		height: '500', 
		width: '725' 
	});
	GenerateTable(7,data_);
}

function setMonthly(){
	//alert('Report is Monthly now' )
	// weeklyConfig = $.extend(true,{}, myConfig);
 	if(monthlyData.length == 0){
		sJson = JSON.stringify(arraySeries);
		monthlyData = JSON.parse(sJson);
		for (i = 0; i < arraySeries.length; ++i) {
			monthlyData[i].values = [];
			var values30 = 0
		    for(j = 0; j < arraySeries[i].values.length; j+=30){
		    	if(j %30 ==0){
		    		monthlyData[i].values.push(values30);
		    		values30 = 0;
		    	}
		    	values30 += arraySeries[i].values[j];

		    } 
		}
	}
	myConfig.series = monthlyData;
	myConfig.scaleX.step = 'month';
	zingchart.render({ 
		id: 'myChart', 
		data: myConfig, 
		height: '500', 
		width: '725' 
	});
	GenerateTable(30,data_);
}

function setQuarterly(){
	//alert('Report is Quarterly now' )
	// weeklyConfig = $.extend(true,{}, myConfig);
 	if(quarterlyData.length == 0){
		sJson = JSON.stringify(arraySeries);
		quarterlyData = JSON.parse(sJson);
		for (i = 0; i < arraySeries.length; ++i) {
			quarterlyData[i].values = [];
			var values90 = 0
		    for(j = 0; j < arraySeries[i].values.length; j+=90){
		    	if(j %90 ==0){
		    		quarterlyData[i].values.push(values90);
		    		values90 = 0;
		    	}
		    	values90 += arraySeries[i].values[j];

		    } 
		}
	}
	myConfig.series = quarterlyData;
	myConfig.scaleX.step = '3month';
	zingchart.render({ 
		id: 'myChart', 
		data: myConfig, 
		height: '500', 
		width: '725' 
	});
	GenerateTable(90,data_);
}

function setHalfYearly(){
	//alert('Report is Half Yearly now' )
	// weeklyConfig = $.extend(true,{}, myConfig);
 	if(halfYearlyData.length == 0){
		sJson = JSON.stringify(arraySeries);
		halfYearlyData = JSON.parse(sJson);
		for (i = 0; i < arraySeries.length; ++i) {
			halfYearlyData[i].values = [];
			var values180 = 0
		    for(j = 0; j < arraySeries[i].values.length; j+=180){
		    	if(j %180 ==0){
		    		halfYearlyData[i].values.push(values180);
		    		values180 = 0;
		    	}
		    	values180 += arraySeries[i].values[j];

		    } 
		}
	}
	myConfig.series = halfYearlyData;
	myConfig.scaleX.step = '6month';
	zingchart.render({ 
		id: 'myChart', 
		data: myConfig, 
		height: '500', 
		width: '725' 
	});
	GenerateTable(180,data_);
}

function setYearly(){
	//alert('Report is Yearly now' )
	// weeklyConfig = $.extend(true,{}, myConfig);
 	if(yearlyData.length == 0){
		sJson = JSON.stringify(arraySeries);
		yearlyData = JSON.parse(sJson);
		for (i = 0; i < arraySeries.length; ++i) {
			yearlyData[i].values = [];
			var values365 = 0
		    for(j = 0; j < arraySeries[i].values.length; j+=365){
		    	if(j %365 ==0){
		    		yearlyData[i].values.push(values365);
		    		values365 = 0;
		    	}
		    	values365 += arraySeries[i].values[j];

		    } 
		}
	}
	myConfig.series = yearlyData;
	myConfig.scaleX.step = 'year';
	zingchart.render({ 
		id: 'myChart', 
		data: myConfig, 
		height: '500', 
		width: '725' 
	});
	GenerateTable(360,data_);
}

function GenerateTable(step,data__) {
    // Create table.
    var table = document.createElement('table');
    // Apply CSS for table
    table.setAttribute('class', 'article');
    // Insert New Row for table at index '0'.
    var row1 = table.insertRow(0);
    // Insert New Column for Row1 at index '0'.
    var row1col1 = row1.insertCell(0);
    row1col1.innerHTML = 'Run Date';
    // Insert New Column for Row1 at index '1'.
    var row1col2 = row1.insertCell(1);
    row1col2.innerHTML = 'Acc No';
    // Insert New Column for Row1 at index '2'.
    var row1col3 = row1.insertCell(2);
    row1col3.innerHTML = 'Acc Name';
    
     var row1col3 = row1.insertCell(3);
    row1col3.innerHTML = 'Account Type';
    
    var row1col3 = row1.insertCell(4);
    row1col3.innerHTML = 'Debit Amount';
    
    var row1col3 = row1.insertCell(5);
    row1col3.innerHTML = 'Credit Amount';
 
    //Add the data rows.
    var idx = 1;
    var beforedbt;
    var accounts={};
    var startDate = data__[0].runDate;
    var endDate = data__[data_.length-1].runDate;


    //Convert dates
	allDate = dateRegex.exec(startDate);
	dateInEpochFormat = allDate[1]+"-"+allDate[2]+"-"+allDate[3]+"T00:00:00+0000";
	var startDateFormatted = new Date(dateInEpochFormat);

	endD = dateRegex.exec(endDate);
	endDateInEpochFormat = endD[1]+"-"+endD[2]+"-"+endD[3]+"T00:00:00+0000";
	var endDateFormatted = new Date(endDateInEpochFormat);
 	    //debugger;   
	while (endDateFormatted>startDateFormatted){
		var st = new Date(startDateFormatted.getTime());
		//st = Object.assign(startDateFormatted);
	    lastDate_ = st.setDate(st.getDate()+step);
	    startPlusStep = new Date(lastDate_);

	    //var s = Object.assign(startDateFormatted);
	    var s = new Date(startDateFormatted.getTime());
	    while(startPlusStep > startDateFormatted && data__.length>0){

	    	while(data__.length>0){
	    	// 	if (data_.length<55){
	    	// 	debugger;
	    	// }
	    		d = dateRegex.exec(data__[0].runDate);
	    		dd = d[1]+"-"+d[2]+"-"+d[3]+"T00:00:00+0000";
	    		var ddd = new Date(dd);
	    		if (ddd<startPlusStep){
	    			var accName=data__[0].accName; 
	    			if (accounts[accName]){
						accounts[accName].crdAmt = (Number(accounts[accName].crdAmt)+ Number(data__[0].crdAmt)).toString();
						accounts[accName].dbtAmt = (Number(accounts[accName].dbtAmt)+ Number(data__[0].dbtAmt)).toString();
						data__=data__.slice(1);
					}
					else{
						var x = {
				    		accNo: data__[0].accNo,
							accName: data__[0].accName,
							accType: data__[0].accType,
							dbtAmt: data__[0].dbtAmt,
							crdAmt: data__[0].crdAmt
		    			}				
						accounts[accName]=x;
						data__ = data__.slice(1);
					}	
					accounts[accName].runDate = s;
	    		}
	    		else{
	    			for (i in accounts){
			    		var row= table.insertRow(idx);
			    		D = accounts[i].runDate.toISOString();
			    		row.insertCell(0).innerHTML=D.substring(0,10);
			            row.insertCell(1).innerHTML=accounts[i].accNo;
			            row.insertCell(2).innerHTML=accounts[i].accName;
			            row.insertCell(3).innerHTML=accounts[i].accType;
			            row.insertCell(4).innerHTML=accounts[i].dbtAmt;
			            row.insertCell(5).innerHTML=accounts[i].crdAmt;
			            idx+=1;	
	    			}
	    			accounts={};
	    			break;
	    		}	
			}	

	    	startDateFormatted.setDate(startDateFormatted.getDate()+step);  //increment start date
	    	
	    }
	    

	}

    // for( i=0; i < accounts.length; i++){
    //     var row= table.insertRow(idx);

    //     dateRegex = /(\d{4})(\d{2})(\d{2})/;
    //     allDate = dateRegex.exec(data_[i].runDate)
    //     styledDate = allDate[3]+"-"+allDate[2]+"-"+allDate[1]



    //     if ((Number(endDate) - Number(startDate))>=0 && (Number(endDate) - Number(allDate[0]))>=0 && (Number(allDate[0]) - Number(startDate))>=0) {
    //         row.insertCell(0).innerHTML=styledDate;
    //         row.insertCell(1).innerHTML=data_[i].accNo;
    //         row.insertCell(2).innerHTML=data_[i].accName;
    //         row.insertCell(3).innerHTML=data_[i].accType;
    //         row.insertCell(4).innerHTML=data_[i].dbtAmt;
    //         row.insertCell(5).innerHTML=data_[i].crdAmt;
    //         idx+=1;
    //     }
    // }
 
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}


zingchart.shape_click = function(p){
  if(p.shapeid == "view_all"){
    zingchart.exec(p.id,'viewall');
  }
}
