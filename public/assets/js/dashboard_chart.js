const excExpColumnCanvas = document.getElementById('exc-expense-column-canvas').getContext("2d");
const excExpColumnChart = new Chart(excExpColumnCanvas, {
    // The type of chart we want to create
    type: 'bar',
    // The data for our dataset
    data: {
        labels: ['Transportation', 'Bills', 'Entertainment'],
        datasets: [
            {
                label: 'Overspent percentage',
                backgroundColor: ["rgba(255, 99, 132, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)"],
                borderColor: ["rgb(255, 99, 132)", "rgb(75, 192, 192)", "rgb(54, 162, 235)"],
                borderWidth: 1,
                data: [90, 30, 20]
            }
        ]
    },
    // Configuration options go here
    options: {
        color: ['red', 'blue', 'green'],
        title: {
            display: true,
            fontSize: 24,
            text: 'Overspent percentage'
        },
        legend: { display: false },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        tooltips: {
            mode: 'point'
        }
    }
});


