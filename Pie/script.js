var myConfig;
var itemId ;


$('button').on('click', function () {

var arraySeries = [];
itemId = this.id;

$.getJSON("example.json", function(result){

colors = ["#257F47",
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
      backgroundColor: "#fff",
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