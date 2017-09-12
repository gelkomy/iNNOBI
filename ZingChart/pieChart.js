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
    palette:["#0099CC","#007E33","#FF8800","#CC0000","#33b5e5","#00C851","#ffbb33","#ff4444"],
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