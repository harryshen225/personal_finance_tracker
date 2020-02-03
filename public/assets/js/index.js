$('.ui.radio.checkbox').checkbox();
$('.ui.selection.dropdown').dropdown();
$('.ui.accordion').accordion();

//card expansion animation

function preciseRound(num, dec) {

    if ((typeof num !== 'number') || (typeof dec !== 'number'))
        return false;

    var num_sign = num >= 0 ? 1 : -1;

    return (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
}


$('#over-spending-card').on("click", ".ui.button", function (event) {
    // $('#daily-expenditure-container').transition('scale', '500ms');
    // setTimeout(() => $('#utilization-container').transition('scale', '500ms'), 200);
    // setTimeout(() => $('#financial-goal-container').transition({
    //     animation: "scale",
    //     duration: "500ms"
    //     // onComplete: () => {
    //     //     $('#over-spend-container'). removeClass().addClass("thirteen wide column");
    //     // }
    // }), 300);
    $('#daily-expenditure-card').dimmer("toggle");
    $('#utilization-card').dimmer("toggle");
    $('#financial-goal-card').dimmer("toggle");
    ($(this).text() === 'Clapse') ? $(this).text("Exceesive Expenditure") : $(this).text("Clapse");
    $("#exc-drilldown").transition("fade down", 700);
});

$('#daily-expenditure-card').on("click", ".ui.button", function (event) {
    // $('#over-spend-container').transition('scale', '500ms');
    // setTimeout(() => $('#utilization-container').transition('scale', '500ms'), 200);
    // setTimeout(() => $('#financial-goal-container').transition({
    //     animation: "scale",
    //     duration: "500ms",
    //     onComplete: () => {
    //         // $('#daily-expenditure-container').css("display","none");
    //         // $('#utilization-container').css("display","none");
    //         // $('#financial-goal-container').css("display","none;");
    //         // $('#over-spend-container'). removeClass().addClass("thirteen wide column");
    //     }
    // }), 300);

    $('#over-spending-card').dimmer("toggle");
    $('#utilization-card').dimmer("toggle");
    $('#financial-goal-card').dimmer("toggle");
    ($(this).text() === 'Clapse') ? $(this).text("Expenses Structure") : $(this).text("Clapse");
    $("#expense-drilldown").transition("fade down", 700);
    createExpenseStrChart();
});

$('#utilization-card').on("click", ".ui.button", function (event) {
    // $('#over-spend-container').transition('scale', '500ms');
    // setTimeout(() => $('#daily-expenditure-container').transition('scale', '500ms'), 200);
    // setTimeout(() => $('#financial-goal-container').transition({
    //     animation: "scale",
    //     duration: "500ms",
    //     onComplete: () => {
    //         // $('#daily-expenditure-container').css("display","none");
    //         // $('#utilization-container').css("display","none");
    //         // $('#financial-goal-container').css("display","none;");
    //         // $('#over-spend-container'). removeClass().addClass("thirteen wide column");
    //     }
    // }), 300);
    $('#over-spending-card').dimmer("toggle");
    $('#daily-expenditure-card').dimmer("toggle");
    $('#financial-goal-card').dimmer("toggle");
    ($(this).text() === 'Clapse') ? $(this).text("Budget Utilization") : $(this).text("Clapse");
    $("#budget-util").transition("fade down", 700);
    createBudgetUtilChart();
});
$('#financial-goal-card').on("click", ".ui.button", function (event) {
    // $('#over-spend-container').transition('scale', '500ms');
    // setTimeout(() => $('#daily-expenditure-container').transition('scale', '500ms'), 200);
    // setTimeout(() => $('#utilization-container').transition({
    //     animation: "scale",
    //     duration: "500ms",
    //     onComplete: () => {
    //         // $('#daily-expenditure-container').css("display","none");
    //         // $('#utilization-container').css("display","none");
    //         // $('#financial-goal-container').css("display","none;");
    //         // $('#over-spend-container'). removeClass().addClass("thirteen wide column");
    //     }
    // }), 300);
    $('#over-spending-card').dimmer("toggle");
    $('#daily-expenditure-card').dimmer("toggle");
    $('#utilization-card').dimmer("toggle");
    ($(this).text() === 'Clapse') ? $(this).text("Financial Insights") : $(this).text("Clapse");
    $("#fin-goal-tracking").transition("fade down", 700);
    createFinanicalInsightsChart()
});


$(document).ready(function () {
    $('.ui.dropdown').dropdown();
    $('.sidebar-menu-toggler').on('click', function () {
        var target = $(this).data('target');
        $(target)
            .sidebar({
                dinPage: true,
                transition: 'overlay',
                mobileTransition: 'overlay'
            })
            .sidebar('toggle');
    });

    let osCount = 0;
    $('.status').each(function () {

        switch ($(this).text()) {
            case 'Over-spending':
                $(this).prepend('<i class="attention icon"></i>');
                $(this).parents("tr").addClass("error");
                osCount += 0;
                break;
            case 'About to reach the limit':
                $(this).prepend('<i class="warning icon"></i>');
                $(this).parents("tr").addClass("warning")
                break;
        }
    })
    $("#os-count").text(osCount);

    $('.dialyAvg').each(function () {
        if (parseFloat($(this).text()) > 100) {
            $(this).prepend('<i class="attention icon"></i>');
            $(this).addClass("warning");
        }
    })

    const monthlyExpenses = [];
    $(".monthlyExpense").each(function () {
        console.log(Number($(this).text().replace(/[^0-9.-]+/g, "")));
        monthlyExpenses.push(parseFloat(Number($(this).text().replace(/[^0-9.-]+/g, ""))));
    });
    console.log(monthlyExpenses);
    const totalExpenses = monthlyExpenses.reduce((e1, e2) => e1 + e2, 0);
    $("#avg-daily-expense").text(`$${preciseRound(totalExpenses / (moment().diff(moment().startOf("Month"), "days") + 1), 2)}`)

    const monthlyBuduget = [];
    $(".monthlyBudget").each(function () {
        console.log(Number($(this).text().replace(/[^0-9.-]+/g, "")));
        monthlyBuduget.push(parseFloat(Number($(this).text().replace(/[^0-9.-]+/g, ""))));
    });
    const totalBudget = monthlyBuduget.reduce((e1, e2) => e1 + e2, 0);
    $("#overall-util").text(`${preciseRound(totalExpenses / totalBudget, 2)}%`)
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ charts ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 1. expense-structure chart
function createExpenseStrChart() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        var iconPath = "M20,7H5.6C4.4,7,4,6.4,4,6l16-1.5V3c0-0.6-0.6-1.1-1.2-1L3.7,4.7c-1,0.2-1.7,1-1.7,2V20c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2  V9C22,7.9,21.1,7,20,7z M18.5,16c-0.8,0-1.5-0.7-1.5-1.5c0-0.8,0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5C20,15.3,19.3,16,18.5,16z";
        var chart = am4core.create("expense-ratios-canvas", am4charts.SlicedChart);

        const title = chart.titles.create();
        title.text = "Expenses Distribution";
        title.fontSize = 25;
        title.marginBottom = 20;
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        chart.paddingLeft = 150;
        const monthlyUtils = [];
        $(".monthlyExpense").each(function () {
            console.log(Number($(this).text().replace(/[^0-9.-]+/g, "")));
            monthlyUtils.push(parseFloat(Number($(this).text().replace(/[^0-9.-]+/g, ""))));
        })

        chart.data = [{
            "name": "Home and Utilities",
            "value": monthlyUtils[0],
            "disabled": true
        }, {
            "name": "Groceries",
            "value": monthlyUtils[1],
            "disabled": true
        }, {
            "name": "Transport",
            "value": monthlyUtils[2],
            "disabled": true
        }, {
            "name": "Entertainment and Eat-out",
            "value": monthlyUtils[3],
            "disabled": true
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


    // 2. expense-sentiment chart
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        /**
         * Chart design taken from Samsung health app
         */

        var chart = am4core.create("expense-barchart-canvas", am4charts.XYChart);

        const title = chart.titles.create();
        title.text = "Expenses Amount";
        title.fontSize = 25;
        title.marginBottom = 30;

        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.paddingBottom = 30;
        const monthlyExpenses = [];
        $(".monthlyExpense").each(function () {
            console.log(Number($(this).text().replace(/[^0-9.-]+/g, "")));
            monthlyExpenses.push(parseFloat(Number($(this).text().replace(/[^0-9.-]+/g, ""))));
        })

        chart.data = [{
            "name": "Home and Utilities",
            "steps": monthlyExpenses[0],
            "href": "/assets/img/house.png"
        }, {
            "name": "Groceries",
            "steps": monthlyExpenses[1],
            "href": "/assets/img/groceries.png"
        }, {
            "name": "Transport",
            "steps": monthlyExpenses[2],
            "href": "/assets/img/transport.png"
        }, {
            "name": "Entertainment and Eat-out",
            "steps": monthlyExpenses[3],
            "href": "/assets/img/ent.png"
        }];

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dy = 35;
        categoryAxis.renderer.tooltip.dy = 35;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;

        var series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueY = "steps";
        series.dataFields.categoryX = "name";
        series.tooltipText = "{valueY.value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.dy = - 6;
        series.columnsContainer.zIndex = 100;

        var columnTemplate = series.columns.template;
        columnTemplate.width = am4core.percent(50);
        columnTemplate.maxWidth = 66;
        columnTemplate.column.cornerRadius(60, 60, 10, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueY", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
        series.mainContainer.mask = undefined;

        var cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        var bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 30;
        bullet.valign = "bottom";
        bullet.align = "center";
        bullet.isMeasured = true;
        bullet.mouseEnabled = false;
        bullet.verticalCenter = "bottom";
        bullet.interactionsEnabled = false;

        var hoverState = bullet.states.create("hover");
        var outlineCircle = bullet.createChild(am4core.Circle);
        outlineCircle.adapter.add("radius", function (radius, target) {
            var circleBullet = target.parent;
            return circleBullet.circle.pixelRadius + 10;
        })

        var image = bullet.createChild(am4core.Image);
        image.width = 60;
        image.height = 60;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";
        image.propertyFields.href = "href";

        image.adapter.add("mask", function (mask, target) {
            var circleBullet = target.parent;
            return circleBullet.circle;
        })

        var previousBullet;
        chart.cursor.events.on("cursorpositionchanged", function (event) {
            var dataItem = series.tooltipDataItem;

            if (dataItem.column) {
                var bullet = dataItem.column.children.getIndex(1);

                if (previousBullet && previousBullet != bullet) {
                    previousBullet.isHover = false;
                }

                if (previousBullet != bullet) {

                    var hs = bullet.states.getKey("hover");
                    hs.properties.dy = -bullet.parent.pixelHeight + 30;
                    bullet.isHover = true;
                    previousBullet = bullet;
                }
            }
        })

    }); // end am4core.ready()
}

function createBudgetUtilChart() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("overall-util-canvas", am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();
        const title = chart.titles.create();
        title.text = "All-Category Utilizations ";
        title.fontSize = 25;
        title.marginBottom = 20;

        // Add data
        const monthlyUtils = [];
        $(".monthlyUtil").each(function () {
            console.log(Number($(this).text().replace(/[^0-9.-]+/g, "")));
            monthlyUtils.push(parseFloat(Number($(this).text().replace(/[^0-9.-]+/g, ""))));
        })
        chart.data = [{
            "budgetCat": "Home and Utilities",
            "utilization": monthlyUtils[0]
        }, {
            "budgetCat": "Groceries",
            "utilization": monthlyUtils[1]
        }, {
            "budgetCat": "Transport",
            "utilization": monthlyUtils[2]
        }, {
            "budgetCat": "Entertainment and Eat-out",
            "utilization": monthlyUtils[3]
        }];

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "budgetCat";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = false;
        categoryAxis.renderer.minHeight = 110;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "utilization";
        series.dataFields.categoryX = "budgetCat";
        series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });

        // Cursor
        chart.cursor = new am4charts.XYCursor();

    }); // end am4core.ready()


    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("daily-util-canvas", am4charts.XYChart);

        const dailyAvg = [];
        $(".dialyAvg").each(function () {
            console.log(Number($(this).text().replace(/[^0-9.-]+/g, "")));
            dailyAvg.push(parseFloat(Number($(this).text().replace(/[^0-9.-]+/g, ""))));
        });
        // Add data
        chart.data = [{
            "name": "Home and Utilities",
            "points": dailyAvg[0],
            "color": chart.colors.next(),
            "bullet": "/assets/img/house.png"
        }, {
            "name": "Groceries",
            "points": dailyAvg[1],
            "color": chart.colors.next(),
            "bullet": "/assets/img/groceries.png"
        }, {
            "name": "transport",
            "points": dailyAvg[2],
            "color": chart.colors.next(),
            "bullet": "/assets/img/transport.png"
        }, {
            "name": "Entertainment and Eat-out",
            "points": dailyAvg[2],
            "color": chart.colors.next(),
            "bullet": "/assets/img/ent.png"
        }];

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.inside = true;
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        categoryAxis.renderer.labels.template.fontSize = 20;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.strokeDasharray = "4,4";
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.min = 0;

        // Do not crop bullets
        chart.maskBullets = false;

        // Remove padding
        chart.paddingBottom = 0;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "points";
        series.dataFields.categoryX = "name";
        series.columns.template.propertyFields.fill = "color";
        series.columns.template.propertyFields.stroke = "color";
        series.columns.template.column.cornerRadiusTopLeft = 15;
        series.columns.template.column.cornerRadiusTopRight = 15;
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/b]";

        // Add bullets
        var bullet = series.bullets.push(new am4charts.Bullet());
        var image = bullet.createChild(am4core.Image);
        image.horizontalCenter = "middle";
        image.verticalCenter = "bottom";
        image.dy = 20;
        image.y = am4core.percent(100);
        image.propertyFields.href = "bullet";
        image.tooltipText = series.columns.template.tooltipText;
        image.propertyFields.fill = "color";
        image.filters.push(new am4core.DropShadowFilter());

    }); // end am4core.ready()
}


function createFinanicalInsightsChart() {

    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        /**
         * Chart design taken from Samsung health app
         */

        var chart = am4core.create("guidance-canvas", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.paddingRight = 40;
        const title = chart.titles.create();
        title.text = "Daily Spending Guidance for the Current Month($)";
        title.fontSize = 25;
        title.marginBottom = 30;

        const monthlyExpenses = [];
        $(".monthlyExpense").each(function () {
            console.log(Number($(this).text().replace(/[^0-9.-]+/g, "")));
            monthlyExpenses.push(parseFloat(Number($(this).text().replace(/[^0-9.-]+/g, ""))));
        });
        console.log(monthlyExpenses);
        const totalExpenses = monthlyExpenses.reduce((e1, e2) => e1 + e2, 0);
        $("#avg-daily-expense").text(`$${preciseRound(totalExpenses / (moment().diff(moment().startOf("Month"), "days") + 1), 2)}`)
    
        const monthlyBuduget = [];
        $(".monthlyBudget").each(function () {
            console.log(Number($(this).text().replace(/[^0-9.-]+/g, "")));
            monthlyBuduget.push(parseFloat(Number($(this).text().replace(/[^0-9.-]+/g, ""))));
        });
        chart.data = [{
            "name": "Home and Utilities",
            "steps": (monthlyBuduget[0]-monthlyExpenses[0])/(moment().endOf("Month").diff(moment(),"days")+1),
            "href": "/assets/img/house.png"
        }, {
            "name": "Groceries",
            "steps": (monthlyBuduget[1]-monthlyExpenses[1])/(moment().endOf("Month").diff(moment(),"days")+1),
            "href": "/assets/img/groceries.png"
        }, {
            "name": "Transport",
            "steps": (monthlyBuduget[2]-monthlyExpenses[2])/(moment().endOf("Month").diff(moment(),"days")+1),
            "href": "/assets/img/transport.png"
        }, {
            "name": "Entertainment and Eat-out",
            "steps": (monthlyBuduget[3]-monthlyExpenses[3])/(moment().endOf("Month").diff(moment(),"days")+1),
            "href": "/assets/img/ent.png"
        }];


        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -40;
        categoryAxis.renderer.minWidth = 120;
        categoryAxis.renderer.tooltip.dx = -40;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;
        valueAxis.renderer.labels.template.dy = 20;

        var series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueX = "steps";
        series.dataFields.categoryY = "name";
        series.tooltipText = "{valueX.value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.dy = - 30;
        series.columnsContainer.zIndex = 100;

        var columnTemplate = series.columns.template;
        columnTemplate.height = am4core.percent(50);
        columnTemplate.maxHeight = 50;
        columnTemplate.column.cornerRadius(60, 10, 60, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
        series.mainContainer.mask = undefined;

        var cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        var bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 30;
        bullet.valign = "middle";
        bullet.align = "left";
        bullet.isMeasured = true;
        bullet.interactionsEnabled = false;
        bullet.horizontalCenter = "right";
        bullet.interactionsEnabled = false;

        var hoverState = bullet.states.create("hover");
        var outlineCircle = bullet.createChild(am4core.Circle);
        outlineCircle.adapter.add("radius", function (radius, target) {
            var circleBullet = target.parent;
            return circleBullet.circle.pixelRadius + 10;
        })

        var image = bullet.createChild(am4core.Image);
        image.width = 60;
        image.height = 60;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";
        image.propertyFields.href = "href";

        image.adapter.add("mask", function (mask, target) {
            var circleBullet = target.parent;
            return circleBullet.circle;
        })

        var previousBullet;
        chart.cursor.events.on("cursorpositionchanged", function (event) {
            var dataItem = series.tooltipDataItem;

            if (dataItem.column) {
                var bullet = dataItem.column.children.getIndex(1);

                if (previousBullet && previousBullet != bullet) {
                    previousBullet.isHover = false;
                }

                if (previousBullet != bullet) {

                    var hs = bullet.states.getKey("hover");
                    hs.properties.dx = dataItem.column.pixelWidth;
                    bullet.isHover = true;

                    previousBullet = bullet;
                }
            }
        })

    }); // end am4core.ready()


    $.get("/api/sentimentcounts/",function(data, status){
        console.log(data);
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
    
            // Create chart instance
            var chart = am4core.create("sentiment-canvas", am4charts.XYChart);
            chart.scrollbarX = new am4core.Scrollbar();
            const title = chart.titles.create();
            title.text = "Expenses Sentiment";
            title.fontSize = 25;
            title.marginBottom = 20;
    
            // Add data
            chart.data = [{
                "budgetCat": "Necessary",
                "utilization": data.necessary
            }, {
                "budgetCat": "Unnecessary",
                "utilization": data.unnecessary
            }, {
                "budgetCat": "Regreted",
                "utilization": data.regreted
            }];
    
            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "budgetCat";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            categoryAxis.renderer.labels.template.rotation = 270;
            categoryAxis.tooltip.disabled = false;
            categoryAxis.renderer.minHeight = 110;
    
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.minWidth = 50;
    
            // Create series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.sequencedInterpolation = true;
            series.dataFields.valueY = "utilization";
            series.dataFields.categoryX = "budgetCat";
            series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
            series.columns.template.strokeWidth = 0;
    
            series.tooltip.pointerOrientation = "vertical";
    
            series.columns.template.column.cornerRadiusTopLeft = 10;
            series.columns.template.column.cornerRadiusTopRight = 10;
            series.columns.template.column.fillOpacity = 0.8;
    
            // on hover, make corner radiuses bigger
            var hoverState = series.columns.template.column.states.create("hover");
            hoverState.properties.cornerRadiusTopLeft = 0;
            hoverState.properties.cornerRadiusTopRight = 0;
            hoverState.properties.fillOpacity = 1;
    
            series.columns.template.adapter.add("fill", function (fill, target) {
                return chart.colors.getIndex(target.dataItem.index);
            });
    
            // Cursor
            chart.cursor = new am4charts.XYCursor();
    
        }); // end am4core.ready()
    
    })

  
    
}







