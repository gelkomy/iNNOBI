var mySeries = [
    {
      values: [115],
      text:'Segment 1'
    },
    {
      values: [95],
      text: 'Segment 2'
    },
    {
      values: [92],
      text: 'Segment 3'
    },
    {
      values: [86],
      text:'Segment 4'
    },
    {
      values: [79],
      text: 'Segment 5'
    },
    {
      values: [68],
      text: 'Segment 6'
    },
    {
      values: [63],
      text: 'Segment 7'
    },
    {
      values: [40],
      text: 'Segment 8'
    }
  
];  
 
var myConfig = {
    type: "pie",
    globals:{
      fontFamily: 'sans-serif'
    },
    legend:{
      verticalAlign: 'middle',
      toggleAction: 'remove',
      marginRight: 60,
      width: 100,
      alpha: 0.1,
      borderWidth: 0,
      highlightPlot: true,
      item:{
        fontColor: "#373a3c",
        fontSize: 12
      }
    },
    backgroundColor: "#fff",
    palette:["#257F47",
         "#73FFA8",
         "#4AFF8E",
         "#0C7F37",
        "#3BCC71",
        "#6DB9D1",
        "#7D98A1",
        "#477787",
         "#3CCDFC",
        "#7D493C",
        "#FFBAA8",
        "#FF957B",
		"#A83E23",
        "#CC7762",
		"#7D623C",
        "#FFDCA8",
		"#FFC97B",
        "#A87A37",
		"#CCA162",
        "#6D7D3C",
		"#EAFFA8",
		"#DEFF7B",
		"#87A824",
		"#B2CC62",
		"#7D3931",
		"#FF9D92",
		"#FF7464",
		"#A86861",
		"#CC5D50"
        ],
    plot:{
        refAngle: 270,
        detach: false,
        valueBox:{
          fontColor: "#fff"
        },
        highlightState:{
          borderWidth: 2,
          borderColor: "#000"
        }
    },
    tooltip:{
      placement: 'node:out',
      borderColor:"#373a3c",
      borderWidth: 2
    },
    labels:[
      {
        text:"Hold SHIFT to detach multiple slices",
        fontSize: 14,
        textAlign: "left",
        fontColor: "#373a3c"
        
      }
      ],
    series: mySeries
 
};
 
zingchart.render({ 
	id : 'myChart', 
	data : myConfig, 
	height: 500, 
	width: 725 
});
 
 
zingchart.node_click = function (p) {
    
    var SHIFT_ACTIVE = p.ev.shiftKey;
    var sliceData = mySeries[p.plotindex];
    isOpen = (sliceData.hasOwnProperty('offset-r')) ? (sliceData['offset-r'] !== 0) : false;
    if(isOpen){
        sliceData['offset-r'] = 0;
    }
    else{
        if(!SHIFT_ACTIVE){
            for(var i = 0 ; i< mySeries.length; i++){
                mySeries[i]['offset-r'] = 0;
            }
        }
        sliceData['offset-r'] = 20;
    }
    
    zingchart.exec('myChart', 'setdata',{
        data : myConfig
    });
}