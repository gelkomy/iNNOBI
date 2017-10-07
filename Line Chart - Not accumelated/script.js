var jsonData=[]
var dbtAccounts = {};
var arraySeries = [];
var dailyData = [];
var firstDate;
var data_;
var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var dateRegex = /(\d{4})(\d{2})(\d{2})/;  //RegEx to separate date into y-m-d

//HighChart variables ************************
var chart = {
	zoomType: 'xy'
}
var title = {
   text: 'تقرير يومي'   
};
var subtitle = {
   text: ''
};
var xAxis = {
   type: 'datetime'
};
var yAxis = {
   title: {
      text: 'قيمة العملة'
   }
};
var arabic = /[\u0600-\u06FF]/;
var tooltip= {
    useHTML:true,    
    formatter: function() {
    	if (arabic.test(this.series.name)){
        	return Highcharts.numberFormat(this.y, 0) + " : "+this.series.name;
        }
        else{
        	return this.series.name + " : " + Highcharts.numberFormat(this.y, 0);
        }
	}
};

var legend = {
  	layout: 'vertical',
	align: 'right',
	verticalAlign: 'middle',
	maxHeight: 200,  //in pixels
	enabled: true
}

var json = {};
json.chart = chart;
json.title = title;
json.subtitle = subtitle;
json.xAxis = xAxis;
json.yAxis = yAxis;  

json.tooltip = tooltip;
json.legend = legend;




$.ajax({
        url: "http://bi.innodevelopment.org/Derived",
        headers: { sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3' },
        type: "GET",
        success: function(result) { alert('Success!' );

		data=result['data'].sort(function(a,b){ return parseFloat(a.runDate) - parseFloat(b.runDate);});


	data_ = result["data"];



	colors = ["#257F47","#6DB9D1", "#FFBAA8","#FFDCA8","#EAFFA8","#FF9D92","#73FFA8",
         "#4AFF8E",
         "#0C7F37",
		 "#3BCC71",
		 "#7D98A1",
        "#477787",
         "#3CCDFC",
        "#7D493C",
		"#FF957B",
		"#A83E23",
        "#CC7762",
		"#7D623C",
		"#FFC97B",
        "#A87A37",
		"#CCA162",
        "#6D7D3C",
		"#DEFF7B",
		"#87A824",
		"#B2CC62",
		"#7D3931",
		"#FF7464",
		"#CC5D50",
    ];


	for (i in result.data){
		var accName=result.data[i].accName;   //Get the account name 
		d = dateRegex.exec(result['data'][i].runDate);
		utcDate = Date.UTC(Number(d[1]),Number(d[2])-1,Number(d[3]));

		if (dbtAccounts[accName]){
			dbtAccounts[accName].push([utcDate,Number(result.data[i].dbtAmt - result.data[i].crdAmt)]);	
		}
		else{
			dbtAccounts[accName]=[[utcDate,Number(result.data[i].dbtAmt - result.data[i].crdAmt)]];	
		}	
	}



	for ( i in dbtAccounts){
		var col = colors.shift();
		colors.push(col);
		var x=	{
			data: dbtAccounts[i],
			name: i 
		};
		arraySeries.push(x);	
	}


    json.series = arraySeries;
    $('#container').highcharts(json);
	
	  // }});
	GenerateTable(1,data_);
	}
});


function setDaily(){
	// alert('Report is daily now' )
	json.series = arraySeries;
    $('#container').highcharts(json);
	
	GenerateTable(1,data_);
}

function UpdateFigure(period){
	newData = [];
	sJson = JSON.stringify(arraySeries);
	newData = JSON.parse(sJson);
	for (i = 0; i < arraySeries.length; ++i) {
		newData[i].data = [];
		var values = 0

	    for(j = 0; j < arraySeries[i].data.length; j+=period){		    	
	    	if(j % period ==0){
	    		date = arraySeries[i].data[j][0];
	    		newData[i].data.push([date,values]);
	    		values = 0;
	    	}
	    	values += arraySeries[i].data[j][1];
	    } 
	}

	json.series = newData;
    $('#container').highcharts(json);

	GenerateTable(period,data_);
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

    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}
