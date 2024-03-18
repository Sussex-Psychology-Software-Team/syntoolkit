/**
 * Created by james on 10/02/2016.
 */


//Measurements for the layout + various style parameters in handy object

function updateGraphemeColourMeasurements() {

    //width coords
    var padding = 10,
        satLightPickerWidth = 256,
        huePickerWidth = 40,
        letterDisplayWidth = 400,
        totalWidth = satLightPickerWidth + huePickerWidth + letterDisplayWidth + (2 * padding),
        colourPreviewWidth = totalWidth,

    //height coords
        satLightPickerHeight = 256,
        huePickerHeight = satLightPickerHeight,
        letterDisplayHeight = satLightPickerHeight,
        colourPreviewHeight = 300,
        totalHeight = satLightPickerHeight + padding + colourPreviewHeight,

    //offset to centre in screen
        xOffset = ($(window).width() - totalWidth) / 2,
        yOffset = ($(window).height() - totalHeight) / 2,

    //x coords
        satLightPickerX = xOffset,
        huePickerX = satLightPickerX + satLightPickerWidth + padding,
        letterDisplayX = huePickerX + huePickerWidth + padding,
        colourPreviewX = xOffset,
        buttonOKX = ($(window).width() / 2) + 175,
        buttonNoColourX = ($(window).width() / 2) - 175,
        trialsLeftX = xOffset,

    //y coords
        satLightPickerY = yOffset,
        huePickerY = yOffset,
        letterDisplayY = yOffset,
        colourPreviewY = satLightPickerY + satLightPickerHeight + padding,
        buttonOKY = colourPreviewY + colourPreviewHeight + padding,
        buttonNoColourY = buttonOKY,
        trialsLeftY = yOffset - padding;



    var measurements = {};

    measurements.padding = 10;

    measurements.trialsLeft = {
        x: trialsLeftX,
        y: trialsLeftY
    };

    measurements.satLightPicker = {
        x : satLightPickerX,
        y : satLightPickerY,
        maxX : satLightPickerX + satLightPickerWidth,
        maxY : satLightPickerY + satLightPickerHeight,
        width : satLightPickerWidth,
        height : satLightPickerHeight
    };

    measurements.huePicker = {
        x : huePickerX,
        y : huePickerY,
        maxX : huePickerX + huePickerWidth,
        maxY : huePickerY + huePickerHeight,
        width : huePickerWidth,
        height : huePickerHeight
    };

    measurements.letterDisplay = {
        x : letterDisplayX,
        y : letterDisplayY,
        maxX : letterDisplayX + letterDisplayWidth,
        maxY : letterDisplayY + letterDisplayHeight,
        width : letterDisplayWidth,
        height : letterDisplayHeight
    };

    measurements.colourPreview = {
        x : colourPreviewX,
        y : colourPreviewY,
        width : colourPreviewWidth,
        height : colourPreviewHeight
    };

    measurements.buttonOK = {
        x : buttonOKX,
        y : buttonOKY
    };

    measurements.buttonNoColour = {
        x : buttonNoColourX,
        y : buttonNoColourY
    };

    measurements.buttonOKCentred = {
        x : $(window).width() / 2,
        y : buttonOKY
    };

    measurements.graphemeColour = "#000000";


    return measurements;
}

var graphemeColourMeasurements = updateGraphemeColourMeasurements();
var resultsManager = null;
var showLetters = false;
var showNumbers = false;

var fadeInOutTime = 150;
var interTrialTime = 200;
$(document).ready(setupInstructions)

function setupInstructions() {
    resultsManager = new ResultsManager();

    $('#pauseDiv').hide();
    $('#mainExperiment').hide();
    $('#youhavesynaesthesia').hide();
    $('#exitpage').hide();
    $('#instructions').hide();

    // skip to type of synesthesia
    showWhichTypeOfSynaesthesia();
}

function showExitPage(has_syn) {

    $('#exit-button').hide();
    resultsManager.StoreTestResult('has_synaesthesia',has_syn);
    resultsManager.SendResults();
    $('#doyouhave').hide();
    $('#youhavesynaesthesia').hide();
    $('#exitpage').show();
}

function exitPageCallback(success, returnedData) {
    if (success) {
        $('#exit-button').click(function(evt) {
            window.location = returnedData.redirect;

        }).show();
    } else {
        $('#exit-button').click(function(evt) {
            window.location = '/error';

        }).show();
    }
}

function showWhichTypeOfSynaesthesia() {
    resultsManager.StoreTestResult('has_synaesthesia', 'yes');

    $('#intro-button-2').click(function (evt) {
        var hasNumber = $("input:radio[name ='has_number']:checked").val();
        var hasLetter = $("input:radio[name ='has_letter']:checked").val();

        if (hasNumber == undefined) {
            $('#has_number_radios').css({"border": '#FF0000 1px solid'});
        }

        if (hasLetter == undefined) {
            $('#has_letter_radios').css({"border": '#FF0000 1px solid'});
        }

        if (hasNumber == 'no' && hasLetter == 'no') {
            resultsManager.StoreTestResult('has_number','no');
            resultsManager.StoreTestResult('has_letter','no');
            showExitPage();
        } else if (hasNumber != undefined && hasLetter != undefined) {
            resultsManager.StoreTestResult('has_number', hasNumber);
            resultsManager.StoreTestResult('has_letter', hasLetter);

            if (hasNumber == 'yes') {
                showNumbers = true;
            }

            if (hasLetter == 'yes') {
                showLetters = true;
            }

            if (showNumbers && !showLetters) {
                $('.type-of-grapheme-plural').html("numbers");
                $('.type-of-grapheme').html("number");
            } else if (showLetters && !showNumbers) {
                $('.type-of-grapheme-plural').html("letters");
                $('.type-of-grapheme').html("letter");
            } else if (showLetters && showNumbers) {
                $('.type-of-grapheme-plural').html("numbers or letters");
                $('.type-of-grapheme').html("number or letter");
            }

            showExperimentInstructions();
        }

    });
    $('#doyouhave').hide();
    $('#youhavesynaesthesia').show();
}

function showExperimentInstructions() {
    $('#youhavesynaesthesia').hide();
    $('#instructions').show();
    //bind the click to start the experiment
    $('#start-button').click(function (evt) {
        startButtonClicked();
    });
}

function startButtonClicked() {
    //hide the instructions and show the experiment
    $('#instructions').hide();
    runGraphemeColourTest();
}


function runGraphemeColourTest() {

    //bind click to restart the experiment on pause screen
    $('#continue-button').click(function (evt){
        nextTrial();  //shoud never happen as this button is in pause screen

    });

    var mainCanvas = $("#layer1");
    var widgetCanvas = $("#layer2");
    var selectButton = $('#select-button');
    var noColourButton = $('#no-colour-button');

    document.body.style.backgroundColor = "white";


    //make sure that the canvases are always the size of the window
    $(window).bind("resize", function(){
        console.log("screen resize");
        prepareScreen();
    });


    var letters = "cdehijknoqstuz".toUpperCase();
    var numbers = "1234567890";


    //get stimuli
    var graphemeList = "";

    if (showLetters) {
        graphemeList += letters;
    }

    if (showNumbers) {
        graphemeList += numbers;
    }

    var graphemes = graphemeList.split('');


    /*
     * More of a block style randomisation
     */

    var initialTrialArray = shuffle(graphemes);
    var trials = [];

    var halfWayMark = Math.round(initialTrialArray.length / 2);
    var firstHalf = initialTrialArray.slice(0,halfWayMark);
    var secondHalf = initialTrialArray.slice(halfWayMark, initialTrialArray.length);

    var nRepeats = 2;

    for (var repeat = 0; repeat < nRepeats; ++repeat) {
        var newFirstHalf = shuffle(firstHalf);
        var newSecondHalf = shuffle(secondHalf);
        trials = trials.concat(newFirstHalf).concat(newSecondHalf);
    }

    //initial selection
    var currentHue = Math.random(),
        currentSat = Math.random(),
        currentLight = Math.random(),
        currentTrial = {},
        currentTrialNumber = 0,
        previewingColourFlag = false;

    var inHuePicker = false;
    var inSatLightPicker = false;

    var nTrials = trials.length;


    var trialShowing = false;

    var mainContext = mainCanvas.get(0).getContext('2d');
    var widgetContext = widgetCanvas.get(0).getContext('2d');

    var huePickerOffset = Math.round(Math.floor(Math.random() * 256));

    var satLightPickerOrientationFlags = {
        xAxis : Math.random()<.5,
        yAxis : Math.random()<.5,
        order : Math.random()<.5
    };


    $('#mainExperiment').show();
    prepareScreen();
    nextTrial();


    function prepareScreen() {
        graphemeColourMeasurements = updateGraphemeColourMeasurements();
        var w = $(window).width();
        var h = $(window).height();

        mainCanvas.get(0).width = w;
        mainCanvas.get(0).height = h;
        widgetCanvas.get(0).width = w;
        widgetCanvas.get(0).height = h;


            selectButton.css({
                top: graphemeColourMeasurements.buttonOK.y + (selectButton.outerHeight() / 2),
                left: graphemeColourMeasurements.buttonOK.x - (selectButton.outerWidth() / 2)});
            noColourButton.css({
                top: graphemeColourMeasurements.buttonNoColour.y + (noColourButton.outerHeight() / 2),
                left: graphemeColourMeasurements.buttonNoColour.x - (noColourButton.outerWidth() / 2)});

        redraw();
    }

    function nextTrial() {

        var rgb = hslToRgb(currentHue, currentSat, currentLight);

        currentTrial = {
            trial_index: currentTrialNumber,
            stimulus: trials[currentTrialNumber],
            start_r: rgb.r,
            start_g: rgb.g,
            start_b: rgb.b
        };

        //draw the widgets
        redraw();

        //fade in and set click events once done
        widgetCanvas.fadeIn(fadeInOutTime);
        mainCanvas.fadeIn(fadeInOutTime+10,setClickEvents);
    }

    function setClickEvents() {

        //set flag to allow clicks to store result
        trialShowing = true;

        function touchStart(evt) {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            var mousePos = getMousePos(mainCanvas, evt);


            if (mousePos !== null) {
                if (pointIsInArea(mousePos, graphemeColourMeasurements.satLightPicker)) {

                    inSatLightPicker = true;
                    inHuePicker = false;
                    updateColour(mousePos);

                } else if (pointIsInArea(mousePos, graphemeColourMeasurements.huePicker)) {

                    inSatLightPicker = false;
                    inHuePicker = true;
                    updateColour(mousePos);

                } else if (pointIsInArea(mousePos, graphemeColourMeasurements.letterDisplay)) {

                    previewingColourFlag = true;
                    var rgb = hslToRgb(currentHue, currentSat, currentLight);
                    var color = 'rgb(' + Math.round(rgb.r) + ',' + Math.round(rgb.g) + ',' + Math.round(rgb.b) + ')';
                    drawGrapheme(currentTrial.stimulus, color);

                } else {

                    inSatLightPicker = false;
                    inHuePicker = false;
                    previewingColourFlag = false;
                    redraw();

                }
            }
        }

        function touchMove(evt) {
            if (evt.preventDefault) {
                evt.preventDefault();
            }

            var mousePos = getMousePos(mainCanvas, evt);
            if ((inSatLightPicker || inHuePicker) && mousePos !== null) {
                //update colour selection when dragging
                updateColour(mousePos);
            }
        }

        function touchEnd(evt) {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            inSatLightPicker = false;
            inHuePicker = false;
            previewingColourFlag = false;
            redraw();
        }



        mainCanvas.bind('pointerdown', touchStart);
        mainCanvas.bind('pointermove',touchMove);
        mainCanvas.bind('pointerup', touchEnd);





        selectButton.click(function(evt){
            //clicked ok
            var rgb = hslToRgb(currentHue, currentSat, currentLight);
            trialComplete(rgb.r, rgb.g, rgb.b);
        });


        noColourButton.click(function (evt) {
            //clicked no colour
            trialComplete(-1, -1, -1);
        });

    }

    function setRandomArrangement() {
        //set up the random arrangement for the pickers / initial colour
        huePickerOffset = Math.round(Math.floor(Math.random() * 256));

        satLightPickerOrientationFlags = {
            xAxis : Math.random()<.5,
            yAxis : Math.random()<.5,
            order : Math.random()<.5
        };

        currentHue = Math.random();
        currentSat = Math.random();
        currentLight = Math.random();
    }

    function trialComplete(r, g, b) {
        if (trialShowing) {
            trialShowing = false;

            //turn off clicks
            mainCanvas.off();
            selectButton.off();
            noColourButton.off();

            currentTrial.r = r;
            currentTrial.g = g;
            currentTrial.b = b;

            //store the resutls
            resultsManager.StoreTrial(currentTrial, currentTrialNumber);

            //clear screen
            widgetCanvas.fadeOut(fadeInOutTime);
            mainCanvas.fadeOut(fadeInOutTime + 10, advanceToNextTrial);
        }
    }

    function advanceToNextTrial() {

        setRandomArrangement();

        clearCanvas();

        //advance to next trial
        currentTrialNumber++;

        if (currentTrialNumber < nTrials) {
            //go to next trial
            setTimeout(nextTrial, interTrialTime);
        } else {
            endExperiment();
        }
    }


    function pointIsInArea(point, area) {
        return (point.x >= area.x && point.x < area.maxX && point.y >= area.y && point.y < area.maxY)
    }

    function redraw() {

        clearCanvas();
        drawSaturationLightnessPicker(currentHue);
        drawHuePicker(20);
        var rgb = hslToRgb(currentHue, currentSat, currentLight);
        var color = 'rgb(' + Math.round(rgb.r) + ',' + Math.round(rgb.g) + ',' + Math.round(rgb.b) + ')';
        drawColorSquare(color);
        drawGrapheme(currentTrial.stimulus, color);
        drawWidgets();
        drawTextInstructions();
        console.log("Drawn canvas");
    }

    function clearCanvas() {
        console.log("Clear canvas");
        mainContext.clearRect(0, 0, mainCanvas.width(), mainCanvas.height());
        widgetContext.clearRect(0, 0, widgetCanvas.width(), widgetCanvas.height());
    }

    function endExperiment() {
        $('#finish-button').hide();
        $('#pauseDiv').hide();
        $('#mainExperiment').hide();
        $('#instructions').hide();
        resultsManager.SendResults();
    }


    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    function getMousePos(canvas, evt) {
        var rect = canvas.get(0).getBoundingClientRect();

        if (evt.originalEvent.clientX) {
            return {
                x: evt.originalEvent.clientX - rect.left,
                y: evt.originalEvent.clientY - rect.top
            }
        } else {
            return {
                x: evt.originalEvent.targetTouches[0].clientX - rect.left,
                y: evt.originalEvent.targetTouches[0].clientY - rect.top
            }
        }
    }



    function updateColour(mousePos) {

        //detect where it was pressed
        if (inSatLightPicker) {

            //get relative location in sat light picker
            var xPos = (mousePos.x - graphemeColourMeasurements.satLightPicker.x),
                yPos = (mousePos.y - graphemeColourMeasurements.satLightPicker.y);

            //Constrain
            xPos = Math.min(Math.max(xPos, 0), 255);
            yPos = Math.min(Math.max(yPos, 0), 255);


            var satLight = convertSatLightValues(xPos, yPos);

            currentSat = satLight.a / 255;
            currentLight = satLight.b / 255;
        }

        if (inHuePicker) {
            //in hue light picker
            var hue = ((mousePos.y - graphemeColourMeasurements.huePicker.y) + huePickerOffset) % 255;
            currentHue = hue / 255;
            currentHue = Math.min(currentHue, 1);
            currentHue = Math.max(currentHue, 0);
            drawSaturationLightnessPicker(currentHue);
        }

        var rgb = hslToRgb(currentHue, currentSat, currentLight);
        var color = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
        drawColorSquare(color);

        drawWidgets();
    }

    function drawWidgets() {
        //now draw locations on second canvas


        widgetContext.fillStyle = "black";
        widgetContext.strokeStyle = "grey";
        widgetContext.clearRect(0, 0, widgetCanvas.width(), widgetCanvas.height());
        widgetContext.beginPath();
        var locs = convertLocationsToSatLightValues(currentSat * 255, currentLight * 255);
        widgetContext.arc(locs.x + graphemeColourMeasurements.satLightPicker.x, locs.y + graphemeColourMeasurements.satLightPicker.y, 4, 0, Math.PI * 2, true);
        widgetContext.closePath();


        var hueY = graphemeColourMeasurements.huePicker.y + ((255 + (255 * currentHue) - huePickerOffset) % 255);
        widgetContext.moveTo(graphemeColourMeasurements.huePicker.x, hueY);
        widgetContext.lineTo(graphemeColourMeasurements.huePicker.x + graphemeColourMeasurements.huePicker.width, hueY);
        widgetContext.stroke();
    }

    function hslToRgb(h, s, l) {
        var r, g, b;

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        if (s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
    }

    function drawHuePicker() {
        var imgData = mainContext.createImageData(graphemeColourMeasurements.huePicker.width, 256);
        for (var x = 0; x < graphemeColourMeasurements.huePicker.width; x += 1) {
            for (var y = 0; y < 256; y += 1) {

                var i = (x + (y * graphemeColourMeasurements.huePicker.width)) * 4;
                var hue = (y + huePickerOffset) % 256;
                var rgb = hslToRgb(hue / 255, 1, 0.5);
                imgData.data[i] = rgb.r;
                imgData.data[i + 1] = rgb.g;
                imgData.data[i + 2] = rgb.b;
                imgData.data[i + 3] = 255 * mainContext.globalAlpha;
            }
        }
        mainContext.putImageData(imgData, graphemeColourMeasurements.huePicker.x, graphemeColourMeasurements.huePicker.y);
        drawContainerAround(graphemeColourMeasurements.huePicker.x, graphemeColourMeasurements.huePicker.y, graphemeColourMeasurements.huePicker.width, graphemeColourMeasurements.huePicker.height);
    }

    //this converts the axises and order at which x andy coords are converted to saturation / lightness
    function convertSatLightValues(x,y) {
        var x2 = x, y2 = y;

        //swap everything round
        if (satLightPickerOrientationFlags.xAxis) {
            x2 = 255 - x2;
        }

        if (satLightPickerOrientationFlags.yAxis) {
            y2 = 255 - y2;
        }

        if (satLightPickerOrientationFlags.order) {
            return { a: y2, b: x2 }
        } else {
            return { a: x2, b: y2 }
        }
    }

    function convertLocationsToSatLightValues(a,b) {
        var x2, y2;
        if (satLightPickerOrientationFlags.order) {
            x2 = b;
            y2 = a;
        } else {
            x2 = a;
            y2 = b;
        }

        //swap everything round
        if (satLightPickerOrientationFlags.xAxis) {
            x2 = 255 - x2;
        }

        if (satLightPickerOrientationFlags.yAxis) {
            y2 = 255 - y2;
        }

        return {x: x2, y: y2}
    }


    function drawSaturationLightnessPicker(hue) {
        var imgData = mainContext.createImageData(256, 256);
        for (var x = 0; x < 256; x += 1) {
            for (var y = 0; y < 256; y += 1) {

                var i = (x + (y * 256)) * 4,
                    satLight = convertSatLightValues(x,y),
                    rgb = hslToRgb(hue, satLight.a / 255, satLight.b / 255);
                imgData.data[i] = rgb.r;
                imgData.data[i + 1] = rgb.g;
                imgData.data[i + 2] = rgb.b;
                imgData.data[i + 3] = 255 * mainContext.globalAlpha;
            }
        }
        mainContext.putImageData(imgData, graphemeColourMeasurements.satLightPicker.x, graphemeColourMeasurements.satLightPicker.y);
        drawContainerAround(graphemeColourMeasurements.satLightPicker);
    }

    function drawColorSquare(colour) {
        mainContext.beginPath();
        mainContext.fillStyle = colour;
        mainContext.fillRect(graphemeColourMeasurements.colourPreview.x, graphemeColourMeasurements.colourPreview.y, graphemeColourMeasurements.colourPreview.width, graphemeColourMeasurements.colourPreview.height);
        drawContainerAround(graphemeColourMeasurements.colourPreview);
    }

    function drawGrapheme(grapheme, color) {

        //clear rectangle
        mainContext.clearRect(graphemeColourMeasurements.letterDisplay.x,
            graphemeColourMeasurements.letterDisplay.y,
            graphemeColourMeasurements.letterDisplay.width,
            graphemeColourMeasurements.letterDisplay.height);

        mainContext.fillStyle = "white";
        mainContext.fillRect(graphemeColourMeasurements.letterDisplay.x,
            graphemeColourMeasurements.letterDisplay.y,
            graphemeColourMeasurements.letterDisplay.width,
            graphemeColourMeasurements.letterDisplay.height);

        //set colour and font
        mainContext.fillStyle = previewingColourFlag ? color : graphemeColourMeasurements.graphemeColour;
        mainContext.font = "120px sassoon";
        mainContext.textBaseline = 'middle';

        var textMeasure = mainContext.measureText(grapheme);
        //var lineHeight = mainContext.measureText('M').width; //approximation
        var xPos = graphemeColourMeasurements.letterDisplay.x + ((graphemeColourMeasurements.letterDisplay.width - textMeasure.width) / 2);
        var yPos = graphemeColourMeasurements.letterDisplay.y + +((graphemeColourMeasurements.letterDisplay.height) / 2);


        mainContext.fillText(grapheme, xPos, yPos);

        drawContainerAround(graphemeColourMeasurements.letterDisplay);
    }

    function drawTextInstructions() {

        //set colour and font
        mainContext.fillStyle = "black";
        mainContext.font = "14px Georgia";
        mainContext.textBaseline = 'bottom';

        //trial counter
        mainContext.fillText("Choose the best colour by clicking on the colour-bar and the shade-box.                                                     " + (nTrials - currentTrialNumber).toString() + " left to do.", graphemeColourMeasurements.trialsLeft.x, graphemeColourMeasurements.trialsLeft.y);
        console.log((nTrials - currentTrialNumber).toString());
    }

    function drawContainerAround(dimensions) {
        mainContext.beginPath();
        mainContext.strokeStyle = "black";
        mainContext.fillStyle = "black";
        mainContext.lineWidth = 1;
        mainContext.rect(dimensions.x - 1, dimensions.y - 1, dimensions.width + 2, dimensions.height + 2);
        mainContext.stroke();
    }
}
