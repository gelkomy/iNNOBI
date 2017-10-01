var jsonData=[]
var myConfig;
var dbt=[];
var crd=[];
var dbtAccounts = {};
//var crdAccounts = {};
var arraySeries = [];
var data;

var startDate = document.getElementById("dat").value.replace('-','').replace('-','');
var endDate = document.getElementById("dat2").value.replace('-','').replace('-','');



$(document).ready(function(){
    $('#dat').change(function(){
        startDate = this.value.replace('-','').replace('-','');        
    });

    $('#dat2').change(function(){
        endDate = this.value.replace('-','').replace('-','');
    });

});




 $.ajax({
          url: "http://localhost:2999/Derived",
          headers: { sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3' },
          type: "GET",
          success: function(result) { 
          	alert('Success!' );

          	data=result['data'].sort(function(a,b){ return parseFloat(a.runDate) - parseFloat(b.runDate);});
            $('#Button').removeAttr('disabled');

		var colors = ["#0088CC",
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
        "#00ABEA"
        ];

firstD=result['data'][0].runDate;
allDate = dateRegex.exec(firstD);
dateInEpochFormat = allDate[1]+"-"+allDate[2]+"-"+allDate[3]+"T00:00:00+0000";
var firstDateFormatted = new Date(dateInEpochFormat);
firstDate = firstDateFormatted.getTime();
	
	for (i in result.data){
		var accName=result.data[i].accName;   //Get the account name 

		if (dbtAccounts[accName]){
		dbtAccounts[accName].push(Number(result.data[i].dbtAmt - result.data[i].crdAmt));	
		}
		else{
			dbtAccounts[accName]=[Number(result.data[i].dbtAmt - result.data[i].crdAmt)];	
		}	
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
		text:" دائن "+ i 
			};
		arraySeries.push(x);	

		}



	myConfig = {
	 	type: 'line',
	 	backgroundColor:  '#FFFFFF',
	 	title:{
	 	  text:'تقرير حسابات الدائن و المدين',
	 	  rtl: true,
	 	  adjustLayout: true,
	 	  fontColor:"black",
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
	 	  },
	 	  "animation":{
	          "effect":1,
	          "sequence":2,
	          "speed":100,
           }
	 	},
	 	scaleX:{
	 	  lineColor: '#E3E3E5',
	 	  zooming: true,
	 	  zoomTo:[0,15],
	 	  minValue: firstDate,
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
	 	    lineColor: '#FFFFFF',//'#E3E3E5',
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

zingchart.render({ 
	id: 'myChart', 
	data: myConfig, 
	height: '500', 
	width: '725' 
});
document.getElementById("myChart-license-text").style.display = "none";
}});



zingchart.shape_click = function(p){
  if(p.shapeid == "view_all"){
    zingchart.exec(p.id,'viewall');
  }
}

function GenerateTable() {
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
    for( i=0; i < data.length; i++){
        var row= table.insertRow(idx);

        dateRegex = /(\d{4})(\d{2})(\d{2})/;
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
