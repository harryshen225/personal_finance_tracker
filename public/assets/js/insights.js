am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var iconPath = "M20,7H5.6C4.4,7,4,6.4,4,6l16-1.5V3c0-0.6-0.6-1.1-1.2-1L3.7,4.7c-1,0.2-1.7,1-1.7,2V20c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2  V9C22,7.9,21.1,7,20,7z M18.5,16c-0.8,0-1.5-0.7-1.5-1.5c0-0.8,0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5C20,15.3,19.3,16,18.5,16z";

    var chart = am4core.create("expense-dist", am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart.paddingLeft = 150;

    chart.data = [{
        "name": "B",
        "value": 40,
        "disabled": true
    }, {
        "name": "A",
        "value": 60
    }];

    var series = chart.series.push(new am4charts.PictorialStackedSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";
    series.alignLabels = true;
    // this makes only A label to be visible
    series.labels.template.propertyFields.disabled = "disabled";
    series.ticks.template.propertyFields.disabled = "disabled";


    series.maskSprite.path = iconPath;
    series.ticks.template.locationX = 1;
    series.ticks.template.locationY = 0;

    series.labelsContainer.width = 100;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.paddingRight = 160;
    chart.legend.paddingBottom = 40;
    let marker = chart.legend.markers.template.children.getIndex(0);
    chart.legend.markers.template.width = 40;
    chart.legend.markers.template.height = 40;
    marker.cornerRadius(20, 20, 20, 20);
}); // end am4core.ready()