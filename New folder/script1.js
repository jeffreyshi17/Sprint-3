var JSONsrc;
$.ajax({
    url: 'http://localhost:8124/'
    , dataType: "jsonp"
    , jsonpCallback: "_concussiontracker"
    , cache: false
    , timeout: 5000
    , success: function (data) {
        JSONsrc = JSON.parse(data);
        generateForm();
    }
    , error: function (jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);
    }
});
document.getElementById("viewSavedAnswers").addEventListener("click", function () {
    window.location.href = 'results.html';
});
document.getElementById("submit").addEventListener("click", function () {
    storeToLocalStorage();
});

function storeToLocalStorage() {
    var ancestor = document.getElementById('container')
        , descendents = ancestor.getElementsByTagName('INPUT');
    var i, e;
    for (i = 0; i < descendents.length; ++i) {
        e = descendents[i];
        console.log(e.id.substring(0, e.id.indexOf("s")) + "form");
        if ((e.id.indexOf("s") != -1 && document.getElementById(e.id.substring(0, e.id.indexOf("s")) + "form").display != "none") || e.id.indexOf("s") == -1)
            if (e.type == "text") {
                localStorage.setItem(e.id, e.value);
            }
        if (e.type == "checkbox" || e.type == "radio") {
            localStorage.setItem(e.id, e.checked);
        }
    }
}

function generateForm() {
    for (var k = 0; k < JSONsrc.length; k++) {
        var title = document.createElement('h1');
        title.className = "page-header";
        var description = document.createElement('h2');
        title.appendChild(document.createTextNode(JSONsrc[k]["title"]));
        title.id = "title";
        description.appendChild(document.createTextNode(JSONsrc[k]["desc"]));
        container.appendChild(title);
        container.appendChild(description);
        for (var i = 0; i < JSONsrc[k]["questions"].length; i++) {
            var e = document.createElement('h3');
            e.innerHTML = JSONsrc[k]["questions"][i].question;
            container.appendChild(e);
            var l1 = JSONsrc[k]["questions"][i];
            if (l1["answers"]) {
                appendOptions(e, l1["answers"], 0);
            }
        }
    }
}

function appendOptions(e1, lev, x) {
    //e1 = target, lev = json obj, x = level
    var el; //container wrapper
    var other = false; //boolean other
    var select = false; //boolean select
    if (e1.innerText.indexOf("Other") != -1) {
        other = true;
    }
    if (lev[0] && lev[0].type == "select") {
        select = true;
    }
    if (select) {
        el = document.createElement('select');
    }
    else {
        el = document.createElement('span');
    }
    el.className = "option level" + x;
    for (var i = 0; i < lev.length; i++) {
        if (select) {
            ex = appendOption(el, lev[i]);
            if (lev[i]["options"]) {
                appendOptions(el, lev[i]["options"], x + 1);
            }
        }
        else {
            singop = document.createElement('div');
            if (other) {
                ex = appendOption(e1, lev[i]);
                //add directly to target
            }
            else {
                ex = appendOption(singop, lev[i]);
                el.appendChild(singop);
                //add to div
            }
            if (lev[i]["options"]) {
                appendOptions(singop, lev[i]["options"], x + 1);
            }
        }
    }
    e1.appendChild(el);
}
var appendOption = function (target, op) {
    id = op.id;
    type = op.type;
    text = op.text || "";
    var spancontainer = document.createElement('span');
    var input = document.createElement('input');
    var label = document.createElement('label');
    input.type = type;
    input.id = id;
    if (type == "select") {
        var input = document.createElement('option');
        input.value = text;
        input.innerHTML = text;
        target.appendChild(input);
    }
    else if (type == "range") {
        var slidervalue = document.createElement('span');
        var tabElement = document.createElement('tab');
        tabElement.align = "right";
        slidervalue.id = id + "Val";
        label.htmlFor = id;
        $(input).attr({
            'data-slider-min': op.min
            , 'data-slider-max': op.max
            , 'data-slider-step': op.step
            , 'data-slider-value': Math.round((op.max - op.min) / 2)
            , 'type': "text"
            , 'data-slider-tooltip': "hide"
        , });
        $(slidervalue).css("padding-left", "10px");
            $(spancontainer).css("padding-left", "10px");
        label.appendChild(document.createTextNode(text));
        target.appendChild(label);
        target.appendChild(tabElement);
        spancontainer.appendChild(input);
        target.appendChild(spancontainer);
        target.appendChild(slidervalue);
        $(slidervalue).text(Math.round((op.max - op.min) / 2));
        $(input).slider();
        $(input).on("slide", function (slideEvt) {
            $(slidervalue).text(slideEvt.value);
            console.log(slideEvt.value);
        });
    }
    else { //checkbox, textbox, radio
        input.name = id.substring(0, id.lastIndexOf("_") - 1);
        label.htmlFor = id;
        label.appendChild(document.createTextNode(text));
        if (type == "text") {
            $(spancontainer).css("padding-left", "10px");
            target.appendChild(label);
            spancontainer.appendChild(input);
            target.appendChild(spancontainer);
        }
        else if (type == "") {
            target.appendChild(label);
        }
        else {
            target.appendChild(input);
            target.appendChild(label);
        }
    }
    return input;
}
if (localStorage.length == 0) {
    storeToLocalStorage();
}
/*
$(document).ready(function () {
    $('input:checkbox').change(function () {
        if ($(this).is(":checked")) {
            document.getElementById((this).id.substring(0, (this).id.length - 3) + "form").style.display = "inline";
        }
        else {
            document.getElementById((this).id.substring(0, (this).id.length - 3) + "form").style.display = "none";
        }
    });
    $('input:radio').change(function () {
        if ($("#" + (this).id.substring(0, (this).id.length - 4) + "0inp").is(":checked")) {
            document.getElementById((this).id.substring(0, (this).id.length - 4) + "0form").style.display = "inline";
        }
        else {
            document.getElementById((this).id.substring(0, (this).id.length - 4) + "0form").style.display = "none";
        }
    });
});
*/