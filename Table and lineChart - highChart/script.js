var oneDay = 24*60*60*1000;
var jsonData=[]
var myConfig;
var dbt=[];
var crd=[];
var dbtAccounts = {};
//var crdAccounts = {};
var arraySeries = [];
var data;
var dateRegex = /(\d{4})(\d{2})(\d{2})/;
var arraySeriesFiltered=[];
var startDate = document.getElementById("dat").value.replace('-','').replace('-','');
var endDate = document.getElementById("dat2").value.replace('-','').replace('-','');
var colors=[];

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

$('#dat').change(function(){
    startDate = this.value.replace('-','').replace('-','');        
});

$('#dat2').change(function(){
    endDate = this.value.replace('-','').replace('-','');
});




function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}

$.ajax({
	  url: "http://bi.innodevelopment.org/Derived",
	  headers: { sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3' },
	  type: "GET",
	  success: function(result) { 
	  	//alert('Success!' );

	  	data=result['data'].sort(function(a,b){ return parseFloat(a.runDate) - parseFloat(b.runDate);});
	    $('#Button').removeAttr('disabled');
	    $('#loading').hide();

	colors = ["#0088CC",
        "#005580",
        "#E36159",
        "#FF77FF",
        "#050505",
        "#FCF305",
        "#c88cea",
        "#37e5d9",
        "#1FB713",
        "#6711FF",
        "#A64C21",
        "#00ABEA",
        "#AD8C8C",
        "#E6A6ED",
        "#41B51E"
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


		//***********************************************8
		// added by Gamal 5/10/2017
		
            
	json.series = arraySeries;
    //json.plotOptions = plotOptions;
    $('#container').highcharts(json); 
		
		//****************

}});



function GenerateTable() {
    // Create table.
	dbtAccounts={};
	arraySeries=[];
	firstD=startDate;




	for( i=0; i < data.length; i++){
		if (data[i].runDate>startDate && data[i].runDate<endDate){
		
			var accName=data[i].accName;   //Get the account name 
			d = dateRegex.exec(data[i].runDate);
			utcDate = Date.UTC(Number(d[1]),Number(d[2])-1,Number(d[3]));

			if (dbtAccounts[accName]){
				dbtAccounts[accName].push([utcDate,Number(data[i].dbtAmt - data[i].crdAmt)]);	
			}
			else{
				// s = dateRegex.exec(data[i].runDate);
				// startD = dateRegex.exec(startDate);
				// dateInEpochFormat = startD[1]+"-"+startD[2]+"-"+startD[3]+"T00:00:00+0000";
				// var firstDateFormatted = new Date(dateInEpochFormat);
				// var startingDate = new Date(Number(s[1]),Number(s[2])-1,Number(s[3]));
				// var diffDays = Math.round(Math.abs((firstDateFormatted.getTime() - startingDate.getTime())/(oneDay)));
				
				//dbtAccounts[accName]=fillArray(null,diffDays);
				//dbtAccounts[accName].push([utcDate,Number(data[i].dbtAmt - data[i].crdAmt)]);	
				dbtAccounts[accName]=[[utcDate, Number(data[i].dbtAmt - data[i].crdAmt)]];	
			}	
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
    for( i=0; i < data.length; i++){
        var row= table.insertRow(idx);

        
        allDate = dateRegex.exec(data[i].runDate)
        styledDate = allDate[3]+"-"+allDate[2]+"-"+allDate[1]

        if ((Number(endDate) - Number(startDate))>=0 && (Number(endDate) - Number(allDate[0]))>=0 && (Number(allDate[0]) - Number(startDate))>=0) {
            row.insertCell(0).innerHTML=styledDate;
            row.insertCell(1).innerHTML=data[i].accNo;
            row.insertCell(2).innerHTML=data[i].accName;
            row.insertCell(3).innerHTML=data[i].accType;
            row.insertCell(4).innerHTML=data[i].dbtAmt;
            row.insertCell(5).innerHTML=data[i].crdAmt;
            idx+=1;
        }
    }
 
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}
