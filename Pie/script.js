var myConfig;
var itemId ;


$('button').on('click', function () {

var arraySeries = [];
itemId = this.id;

$.getJSON("example.json", function(result){

  var colors = [ 
        "yellow", 
        "#00ffff",
        "#f5f5dc",
        "#00ff00",
        "#4b0082",
        "#a52a2a",
        "#00ffff",
        "#800000",
        "#008b8b",
        "#a9a9a9",
        "#006400",
        "#bdb76b",
        "#8b008b"
        ];
  
  for (i in result["data"]){
      if (Object.keys(result["data"][i])==itemId){
         children = result["data"][i][itemId];
         break;
      }
  }


    //var color = Colors.random();
    for ( i in children){
      var col = colors.shift();
      colors.push(col);


      //Create series data
      var x= {
        values: [Number(children[i])],
        text: i,
        backgroundColor: col,
      };
      arraySeries.push(x);  

      }

 myConfig = {
      type: "pie",
      backgroundColor: "#2B313B",
      plot: {
        borderColor: "#2B313B",
        borderWidth: 5,
        // slice: 90,
        valueBox: {
          placement: 'out',
          text: '%t\n%npv%',
          fontFamily: "Open Sans"
        },
        tooltip: {
          fontSize: '18',
          fontFamily: "Open Sans",
          padding: "5 10",
          text: "%npv%"
        },
        animation: {
          effect: 2,
          method: 5,
          speed: 500,
          sequence: 1
        }
      },
      source: {
        text: '',
        fontColor: "#8e99a9",
        fontFamily: "Open Sans"
      },
      legend : {
        toggleAction:'remove',
        backgroundColor:'#FBFCFE',
        borderWidth:0,
        adjustLayout:true,
        align:'center',
        verticalAlign:'bottom',
        marker: {
            type:'circle',
            cursor:'pointer',
            borderWidth:0,
            size:5
        },
        item: {
            fontColor: "#777",
            cursor:'pointer',
            offsetX:-6,
            fontSize:12
        },
        mediaRules:[
            {
                maxWidth:500,
                visible:false
            }
        ]
      },
      title: {
        fontColor: "#fff",
        text: 'Global Browser Usage',
        align: "left",
        offsetX: 10,
        fontFamily: "Open Sans",
        fontSize: 25
      },
      subtitle: {
        offsetX: 10,
        offsetY: 10,
        fontColor: "#8e99a9",
        fontFamily: "Open Sans",
        fontSize: "16",
        text: 'May 2016',
        align: "left"
      },
      plotarea: {
        margin: "20 0 0 0"
      },
      series: arraySeries
    };

    zingchart.render({
      id: 'myChart',
      data: myConfig,
      height: 500,
      width: 725
    });
});
 
 });