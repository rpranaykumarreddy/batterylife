
var dataarr = [
    ["start", 0, 0, 0, 0]
];

google.charts.load('current', {
    'packages': ['corechart']
});

google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    datastr = JSON.stringify(dataarr);
    var data = google.visualization.arrayToDataTable(eval(datastr), true);

    var options = {
        legend: 'none',
        bar: {
            groupWidth: '100%'
        }, // Remove space between bars.
        candlestick: {
            fallingColor: {
                strokeWidth: 0,
                fill: '#a52714'
            }, // red
            risingColor: {
                strokeWidth: 0,
                fill: '#0f9d58'
            } // green
        }
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

var batterySupported = document.getElementById("battery-supported"),
    batteryLevel = document.getElementById("battery-level"),
    chargingStatus = document.getElementById("charging-status")
    
    batteryCharged = document.getElementById("battery-charged"),
    batteryDischarged = document.getElementById("battery-discharged")
;


var prevchar = 0,
    nowchar = 0;
var atchar = 0,
    endchar = 0,
    charsat = 0;
var strem, stplg, siinc;
var success = function(battery) {
    if (battery) {
        function setStatus() {
            console.log("status Updated");
            batteryLevel.innerHTML = Math.round(battery.level * 100) + "%";
            chargingStatus.innerHTML = (battery.charging) ? "" : "not ";
            /*batteryCharged.innerHTML = (battery.chargingTime == "Infinity") ? "Infinity" : parseInt(battery.chargingTime / 60, 10);
            batteryDischarged.innerHTML = (battery.dischargingTime == "Infinity") ? "Infinity" : parseInt(battery.dischargingTime / 60, 10);*/

            temp = new Date();
            time = temp.toLocaleTimeString();
            prevchar = nowchar;
            nowchar = battery.level * 100;
            if (prevchar != nowchar) {
                dataarr.push([time, prevchar, prevchar, nowchar, nowchar]);
                drawChart();
            }
        }

        function inc20() {
            if ((Math.round(battery.level * 100) - atchar) > 20) {
                altremv();
            }
            if ((Math.round(battery.level * 100) - atchar) < 0) {
                altpara();
            }
        }

        function satcha() {
            if (battery.charging) {
                clearTimeout(stplg);
                clearInterval(siinc);
                clearTimeout(strem);
                atchar = Math.round(battery.level * 100);
                strem = setTimeout(altremv, 900000);
                siinc = setInterval(inc20, 2500);
            } else {
                clearTimeout(stplg);
                clearInterval(siinc);
                clearTimeout(strem);
                stplg = setTimeout(altplug, 1800000);
            }
        }


        function checkupdown() {
            var bt = Math.round(battery.level * 100);
            if (bt < 40) {
                if (!(battery.charging)) {
                    altplug();
                }
            }
            if (bt > 85) {
                if (battery.charging) {
                    altremv();
                }
            }
        }

        var audioCtx = new(window.AudioContext || window.webkitAudioContext || window.audioContext);


        function beep(duration, frequency, volume, type, callback) {
            var oscillator = audioCtx.createOscillator();
            var gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            if (volume) {
                gainNode.gain.value = volume;
            }
            if (frequency) {
                oscillator.frequency.value = frequency;
            }
            if (type) {
                oscillator.type = type;
            }
            if (callback) {
                oscillator.onended = callback;
            }

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
        };

        function altremv() {
            if (battery.charging) {
                beep(250, 200, 1);
                setTimeout(altremv, 400);
            } else {}
        }

        function altplug() {
            if (!(battery.charging)) {
                beep(1000, 440, 1);
                setTimeout(altplug, 2000);
            } else {}
        }

        function altpara() {
            if (!(battery.charging)) {
                beep(100, 700, 1);
                setTimeout(altplug, 180);
            } else {}
        }
        satcha();
        setTimeout(checkupdown, 5000);
        google.charts.setOnLoadCallback(setStatus);
        battery.addEventListener("levelchange", setStatus, false);
        battery.addEventListener("chargingchange", setStatus, false);
        battery.addEventListener("chargingchange", satcha, false);
        /*
        battery.addEventListener("chargingtimechange", setStatus, false);
        battery.addEventListener("dischargingtimechange", setStatus, false);
        */
    } else {
        throw new Error('Battery API not supported on your device/computer');
    }

};

var noGood = function(error) {
    batterySupported.innerHTML = error.message;
};
var s = 0;

function intia() {
    if (!(s++)) {
        console.log("intiated");
        navigator.getBattery() //returns a promise
            .then(success)
            .catch(noGood);
    }
}