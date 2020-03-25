var canvas;
var chart;

var numberOfPeople = 150;
var numberOfInfected = 1;
var timeInfected = 3;
var deathProbability = 0.95;
var speed = 1;
var radius = 8;
var socialDistancing = 0.0;

// JQuery Components

var $btnStart;
var $btnStop;
var $btnRestart;
var $btnCancel;
var $btnSettings;
var $populationSize;
var $infectedPeople;
var $timeInfected;
var $deathProbability;
var $speed;
var $radius;
var $socialDistancing;

function reset(){

    canvas = new Canvas("canvas", speed, radius);

    var availablePositions = canvas.getAvailablePositions();

    var selectedPositions = Random.getRandomValues(availablePositions, numberOfPeople);

    var indexes = [].range(0, numberOfPeople - 1);

    var numberOfFixed = socialDistancing * numberOfPeople;
    var fixedIndexes = Random.getRandomValues(indexes, numberOfFixed);

    var freeIndexes = indexes.filter(v => !fixedIndexes.includes(v));

    var infectedIndexes = Random.getRandomIndexes(freeIndexes, numberOfInfected);

    canvas.on("reset", (points) => {

        infectedIndexes.forEach(index => {
            points[index].setInfected();
        });

        fixedIndexes.forEach(index => {
            points[index].fixed = true;
        });

        createChart();
    });

    canvas.on("collide", (iteration, c1, c2) => {

        if ([STATUS.DEAD, STATUS.RECOVERED].includes(c1.status)) {
            return;
        }

        if ([STATUS.DEAD, STATUS.RECOVERED].includes(c2.status)) {
            return;
        }

        if (c1.status == STATUS.INFECTED && c2.status != STATUS.INFECTED) {
            c2.setInfected();
        } else if (c1.status != STATUS.INFECTED && c2.status == STATUS.INFECTED) {
            c1.setInfected();
        }
    });

    canvas.on("iterate", (iteration, points) => {

        var status = canvas.getStatus();

        if(iteration % 4 == 0){
            chart.series[0].addPoint(status.infected/numberOfPeople);
            chart.series[1].addPoint(status.recovered/numberOfPeople);
            chart.series[2].addPoint(status.deaths/numberOfPeople);
        }

        for (var i = 0; i < points.length; i++) {

            var p = points[i];

            if ([STATUS.DEAD, STATUS.RECOVERED].includes(p.status)) {
                continue;
            }

            if (p.status == STATUS.INFECTED) {

                var diff = Date.now() - p.infectedTime.getTime();

                var time = Math.floor(diff / 1000)

                if (time > timeInfected) {

                    if (Random.randDouble() < deathProbability) {
                        p.status = STATUS.RECOVERED;
                    } else {
                        p.status = STATUS.DEAD;
                        p.fixed = true;
                    }
                }
            }
        }
    });

    canvas.init(selectedPositions);

    canvas.reset();
}

function createChart(){

    chart = Highcharts.chart('chart', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Results'
        },
        xAxis: {
            min: 0,
            max: 1000,
        },
        yAxis: {
            min: 0,
            max: 1,
            tickInterval: 0.1,
            title: {
                text: '% of People',
            }
        },
        series: [{
            name: 'Infected',
            data: []
        },{
            name: 'Recovered',
            data: []
        },{
            name: 'Deaths',
            data: []
        }]
    });
}

$(function () {

    $btnStart = $("#btn-start");
    $btnStop = $("#btn-stop");
    $btnRestart = $("#btn-restart");
    $btnCancel = $("#btn-cancel");
    $btnSettings = $("#btn-settings");
    $populationSize = $("#populationSize");
    $infectedPeople = $("#infectedPeople");
    $timeInfected = $("#timeInfected");
    $deathProbability = $("#deathProbability");
    $speed = $("#speed");
    $radius = $("#radius");
    $socialDistancing = $("#socialDistancing");

    $("#settings").submit(function (event) {
        event.preventDefault();

        if (canvas.isRunning) {
            alert("You can not change the settings while it is running")
            return;
        }

        if(parseInt($infectedPeople.val()) > parseInt($populationSize.val())){
            alert("The number of infected people should be less or equal to population size");
            return;
        }

        numberOfPeople = parseInt($populationSize.val());
        numberOfInfected = parseInt($infectedPeople.val());
        timeInfected = parseInt($timeInfected.val());
        deathProbability = parseFloat($deathProbability.val());
        speed = parseFloat($speed.val());
        socialDistancing = parseFloat($socialDistancing.val());
        radius = parseFloat($radius.val());

        reset();

        $('#collapseSettings').collapse('hide');

        return false;
    });

    canvas = new Canvas("canvas");



    document.fonts.ready.then(_ => {
        canvas.draw();
    });

    canvas.draw();

    $btnStop.prop("disabled", "disabled");
    $populationSize.val(numberOfPeople);
    $infectedPeople.val(numberOfInfected);
    $timeInfected.val(timeInfected);
    $deathProbability.val(deathProbability);
    $speed.val(speed);
    $radius.val(radius);
    $socialDistancing.val(socialDistancing);

    $btnStart.on("click", function () {
        canvas.start();
        $btnStart.prop("disabled", "disabled");
        $btnStop.removeAttr("disabled");
        $btnRestart.prop("disabled", "disabled");
        $btnSettings.prop("disabled", "disabled");
    });

    $btnStop.on("click", function () {
        canvas.stop();
        $btnStart.removeAttr("disabled");
        $btnStop.prop("disabled", "disabled");
        $btnRestart.removeAttr("disabled");
        $btnSettings.removeAttr("disabled");
    });

    $btnRestart.on("click", function () {
        canvas.reset();
    });

    $btnCancel.on("click", function () {
        $('#collapseSettings').collapse('hide');
    });



    reset();
});
