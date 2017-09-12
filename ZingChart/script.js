//debugger;
var jsonData=[]
var myConfig;
var dbt=[];
var crd=[];
var dbtAccounts = {};
//var crdAccounts = {};
var arraySeries = [];
var minDate;


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

 $.ajax({
          url: "http://localhost:2999/Derived",
          headers: { sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3' },
          type: "GET",
          success: function(result) { alert('Success!' );

//$.get(
//    "http://localhost:2999/Derived",
//    {sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3'},
//    function(result) {
//       alert('page content: ' + data);
//    }
//);

//$.getJSON("example.json", function(result){
	// accountsNumber = Object.keys(result).length/6;
	// console.log(result.data);
  	
	// for(var i = 0; i < result.data; i++) {
	// 	dbt.push(result.data[i].Amount);
	// }
minDate = Number(result.data[0].runDate);   //To set the minimum date to the first date in the list to update it later.

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
// WWWWWWWWWWWORRRRRRRRRRKKKKKKKKKING
	// for (i in result.data){
	// 	dbt[i]=Number(result.data[i].Amount);
	// }

	// for (i in result.data){
	// 	crd[i]=Number(result.data[i].crdAmt);
	// }
//JUSSSSSSSSSSSSTTTTTT fine

	
	for (i in result.data){
		var accName=result.data[i].accName;   //Get the account name 
		if (Number(result.data[i].runDate < minDate)){   // To update minimum date if the date is less than the set one
			minDate = Number(result.data[i].runDate);    
		}
		if (dbtAccounts[accName]){
		dbtAccounts[accName].push(Number(result.data[i].Amount));	
		}
		else{
			dbtAccounts[accName]=[Number(result.data[i].Amount)];	
		}	
	}

	/*for (i in result.data){
		var accName=result.data[i].accName;
		if (crdAccounts[accName]){
		crdAccounts[accName].push(Number(result.data[i].crdAmt));	
		}
		else{
			crdAccounts[accName]=[Number(result.data[i].crdAmt)];	
		}	
	}
*/
	//var color = Colors.random();

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


		//var color = Colors.random();
	/*	for ( i in crdAccounts){
		var col = colors.shift();
		colors.push(col);

		var x=	{
		values: crdAccounts[i],//[218.92,212.85,241.95,200.76,203.87,245.26],
		lineColor:col,//color.rgb,//'#E34247',
		marker:{
		  backgroundColor:col,//color.rgb//'#E34247'
		},
		text: "حساب مدين "+i,rtl: true
			};
			
		arraySeries.push(x);	

		}
*/
	/*{
				values: dbtAccounts["Omda"],//[218.92,212.85,241.95,200.76,203.87,245.26],
				lineColor:'#E34247',
				marker:{
				  backgroundColor:'#E34247'
				},
				text:"Debit"
			}*/

	// for (key in dbt){
	// 	console.log(myArr)
	// }
	//dbt=[100,200,250,350,300];
    
    //dbt.push(result.Amount);



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
	 	// legend:{
	 	//   align: 'center',
	 	//   verticalAlign: 'top',
	 	//   backgroundColor:'none',
	 	//   borderWidth: 0,
	 	//   item:{
	 	//     fontColor:'#E3E3E5',
	 	//     cursor: 'hand'
	 	//   },
	 	//   marker:{
	 	//     type:'circle',
	 	//     borderWidth: 0,
	 	//     cursor: 'hand'
	 	//   }
	 	// },
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
	 	  minValue: 1459468800000,
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
		series:arraySeries /*[
			{
				values: dbtAccounts["Omda"],//[218.92,212.85,241.95,200.76,203.87,245.26],
				lineColor:'#E34247',
				marker:{
				  backgroundColor:'#E34247'
				},
				text:"Debit"
			},
			{
			  values:crdAccounts["Omda"],//[165.57,170.47,197.17,164.64,132.73,176.89,139.41,158.71,177.85,138.87,135.74,167.06,156.42,182,169.73,151.08,165.58,146.29,124.5,181.71,143.96,null,null,null,146,172.6,149.81,161.09,175.88,149.39,184.1,123.85,186.82,139.72,138.61,170.28,164.06,184.33,null,null,131.85,133.32,134.49,143.79,125.23],
			  lineColor: '#FEB32E',
			  marker:{
			    backgroundColor:'#FEB32E'
			  },
			  text: "Credit" 
			}
		]*/
		
	};

zingchart.render({ 
	id: 'myChart', 
	data: myConfig, 
	height: '500', 
	width: '725' 
});

		  }});
 
//myConfig["series"][0].values = myConfig["series"][0].values.concat(jsonData["responseJSON"].values);
//var r2=[];
// r2 = r2.responseJSON["values"];






// myConfig["series"][0].values.concat(r.responseJSON["values"])

// y = r2;

// var ww = myConfig["series"][0]["values"].concat(r2);

//aa = myConfig;
//console.log(myConfig)



zingchart.shape_click = function(p){
  if(p.shapeid == "view_all"){
    zingchart.exec(p.id,'viewall');
  }
}