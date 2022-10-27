var data = { name: "", titles: [], time: [], status: "" };
var opt = [0, -1, 0];
console.trace("Popup.js");
const intSet = setInterval(optFix, 100);
getData();

chrome.storage.onChanged.addListener(function(changes, namespace) {
    getData();
});

function getData() {
    chrome.storage.local.get(['key'], function(result) {
        data = result.key;
        console.trace(['Intial Value:', result, data]);
        opt[2] = data.titles.length;
        optFix();
        addOption(opt[0], opt[1], opt[2]);
    });
}

document.getElementById("sat").addEventListener('change', onSelCha);
document.getElementById("endEle").addEventListener('change', onSelCha);
document.getElementById("GitLink").addEventListener('click', () => {
    var newURL = "https://github.com/rpranaykumarreddy";
    chrome.tabs.create({ url: newURL });

});

function onSelCha() {
    ins = Number(document.getElementById("sat").value);
    ine = Number(document.getElementById("endEle").value);
    opt[0] = ins;
    opt[1] = ine;
    addOption(ins, ine, opt[2]);
    console.trace('changed the select: ', opt[0], opt[1], opt[2]);
    calcLen(ins, ine);
}

function calcLen(s, e) {
    console.trace('calcLen is Opened');
    out = 0;
    for (abc = s; abc <= e; abc++) {
        out += data.time[abc];
    }
    console.trace('calcLen is Closed ' + secToStr(out));

    bw = e - s + 1;
    console.log("No of videos : " + bw + "\nAverage length of video : " + secToStr(out / bw) + "\nTotal length of playlist : " + secToStr(out) +
        "\nAt 1.25 x : " + secToStr(out / 1.25) + "\nAt 1.50 x : " + secToStr(out / 1.5) + "\nAt 1.75 x : " + secToStr(out / 1.75) + "\nAt 2.00 x : " + secToStr(out / 2)
    );
    document.getElementById("NumVid").innerHTML = (bw + "/" + opt[2]);
    document.getElementById("AvgLen").innerHTML = (secToStr(out / bw));
    document.getElementById("TotLen").innerHTML = (secToStr(out));
    document.getElementById("Tot1.25").innerHTML = (secToStr(out / 1.25));
    document.getElementById("Tot1.50").innerHTML = (secToStr(out / 1.5));
    document.getElementById("Tot1.75").innerHTML = (secToStr(out / 1.75));
    document.getElementById("Tot2.00").innerHTML = (secToStr(out / 2));
    return out;
}

function secToStr(sec) {
    let temp, min, hr, day;
    day = Math.floor(sec / 86400);
    hr = Math.floor((sec - (day * 86400)) / 3600);
    min = Math.floor((sec - (hr * 3600) - (day * 86400)) / 60);
    sec = Math.floor(sec - (hr * 3600) - (min * 60) - (day * 86400));
    temp = (day ? (day + (day - 1 ? " days " : " day ")) : "") + (hr ? (hr + (hr - 1 ? " hrs " : " hr ")) : "") + (min ? (min + (min - 1 ? " mins " : " min ")) : "") + (sec + (sec - 1 ? " secs " : " sec "));
    return temp;
}

function addOption(st, ed, len) {
    if (ed > (len - 1)) {
        ed = len - 1;
    }
    if (st < 0) {
        st = 0;
    }

    document.getElementById("PlayTitle").innerHTML = data.name;
    console.trace([st, ed, len]);
    if (len) {
        var satEle = document.getElementById("sat");
        var endEle = document.getElementById("endEle");
        satEle.innerHTML = "";
        endEle.innerHTML = "";
        for (let i = 0; i <= ed; i++) {
            var x = document.createElement("OPTION");
            x.setAttribute("value", i);
            ser = Number(i) + 1;
            t = document.createTextNode(ser + " - " + data.titles[i]);
            x.appendChild(t);
            if (i == st) {
                console.trace(i + " " + st);
                x.setAttribute("selected", true);
            }
            satEle.appendChild(x);
        }
        for (let i = st; i < len; i++) {
            var x = document.createElement("OPTION");
            x.setAttribute("value", i);
            ser = Number(i) + 1;
            t = document.createTextNode(ser + " - " + data.titles[i]);
            x.appendChild(t);
            if (i == ed) {
                console.trace(i + " " + ed);
                x.setAttribute("selected", true);
            }
            endEle.appendChild(x);
        }
    }
    console.trace("options updated");
}

function optFix() {
    let x = document.getElementById("sat").value;
    if (x == "loading") {
        opt[2] = data.titles.length;
        if ((opt[2] != 0) && (opt[1] == -1)) {
            opt[1] = data.titles.length - 1;
        }
        addOption(opt[0], opt[1], opt[2]);
        clearInterval(intSet);
        calcLen(opt[0], opt[1])
        console.trace("done option")
    }
}