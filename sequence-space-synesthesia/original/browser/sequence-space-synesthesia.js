/**
 * Created by james on 10/02/2016.
 */

// Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

try {
    var ce = new window.CustomEvent('test');
    ce.preventDefault();
    if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error('Could not prevent default');
    }
} catch (e) {
    var CustomEvent = function (event, params) {
        var evt, origPrevent;
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        origPrevent = evt.preventDefault;
        evt.preventDefault = function () {
            origPrevent.call(this);
            try {
                Object.defineProperty(this, 'defaultPrevented', {
                    get: function () {
                        return true;
                    }
                });
            } catch (e) {
                this.defaultPrevented = true;
            }
        };
        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
}

// Object assign polyfill
if (typeof Object.assign != 'function') {
    Object.assign = function (target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}


var inducer = (function ($) {

    var my = {};

    var inducers = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    /*
     * Do all setting up here
     * Return html for a div to change the inducer
     */
    my.setup = function (inducersList, finished) {
        finished();
    };


    /*
     * Update the inducer with a new stimulus
     * Return the description
     */
    my.updateInducer = function (inducerIndex) {
        $('#string-inducer').html(inducers[inducerIndex]);
        return {stimulus: inducers[inducerIndex]};
    };


    /*
     * Returns the number of inducers to present
     */
    my.numberOfInducers = function () {
        return inducers.length;
    };


    /*
     * Prepare the inducer based on new screen coords etc
     */
    my.prepareInducerScreen = function (panel) {
        panel.width(100).height(100);
    };


    return my;

}($));


var concurrent = (function ($) {

    var my = {};


    var lastClickEvent = null;

    /*
     * INTERFACE
     */

    my.setup = function (finished) {
        finished();
    };

    my.prepareConcurrentScreen = function (panel) {
        panel.width(0).height(0);

    };

    /*
     * Set the concurrent to pre-selection state
     */
    my.resetConcurrentState = function () {

    };

    my.customSetClickEvents = function (callback) {
        $(document).off('click touchstart').bind('click touchstart', function (event) {
            $(document).off('click touchstart');


            lastClickEvent = event;

            const dot = document.createElement('div');
            dot.classList.add('dot');

            const x = event.pageX-5;
            const y = event.pageY-5;

            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            console.log([x,y])

            document.body.appendChild(dot);

            setTimeout(() => {
                dot.style.left = (x + 5) + 'px';
                dot.style.top = (y + 5) + 'px';
                dot.style.width = 0;
                dot.style.height = 0;
            }, 100);

            setTimeout(() => {
                dot.parentNode.removeChild(dot);
            }, 600);

            callback(event);
        });
    };

    my.prepareCustomClickLayout = function (topOfControlsPortion) {
    };

    my.getButtonsHeight = function () {
        return 0;
    };

    /*
     * User has clicked select - return result if valid selection
     * false if not.
     * Indicate on UI if selection not valid
     */
    my.concurrentSelected = function (_selected) {


        var e = lastClickEvent;
        var out = {
            x: -1,
            y: -1,
            width: $(document).width(),
            height: $(document).height()
        };

        if (e.type == 'touchstart') {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            out.x = touch.pageX;
            out.y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'click') {
            out.x = e.pageX;
            out.y = e.pageY;
        }
        console.log(out)
        //return x and y
        return out;
    };

    my.EndExperiment = function (resultsManager) {
        var scores = space_aggregator(resultsManager);
        var scoreheaders = ['ss_score',
            'pass_ss_test',
            'n_valid_scores',
            'x_sd',
            'y_sd',
            'x_mean',
            'y_mean',
            'straight_line'];

        for (var i = 0; i < scoreheaders.length; i += 1) {
            var sh = scoreheaders[i];
            resultsManager.StoreTestResult(sh, scores[sh]);
        }
    };


    function space_aggregator(resultsManager) {

        var trials = resultsManager.GetTrials();
        var ss_results = {};
        var stimuli_list = [];
        for (var i = 0; i < trials.length; i += 1) {
            var trial = trials[i];
            var stimulus = trial.stimulus;
            if (!ss_results.hasOwnProperty(stimulus)) {
                ss_results[stimulus] = [];
                stimuli_list.push(stimulus);
            }

            ss_results[stimulus].push({
                'x': trial.x / trial.width,
                'y': trial.y / trial.height
            })
        }


        var areas_sum = 0;
        var areas_count = 0;
        var x_scores = [];
        var y_scores = [];

        for (var i = 0; i < stimuli_list.length; i += 1) {
            var stimulus = stimuli_list[i];
            var result = ss_results[stimulus];

            if (result.length == 3) {
                areas_sum += Math.abs((result[0]['x'] * result[1]['y'])
                    + (result[1]['x'] * result[2]['y'])
                    + (result[2]['x'] * result[0]['y'])
                    - (result[0]['x'] * result[2]['y'])
                    - (result[1]['x'] * result[0]['y'])
                    - (result[2]['x'] * result[1]['y'])) / 2;
                areas_count += 1;
                x_scores.push(result[0]['x']);
                x_scores.push(result[1]['x']);
                x_scores.push(result[2]['x']);
                y_scores.push(result[0]['y']);
                y_scores.push(result[1]['y']);
                y_scores.push(result[2]['y']);
            }
        }


        var ss_score = areas_count > 0 ? (100 * areas_sum) / areas_count : 0;
        var x_sd = stats_standard_deviation(x_scores);
        var y_sd = stats_standard_deviation(y_scores);
        var x_mean = stats_average(x_scores);
        var y_mean = stats_average(y_scores);
        var pass_ss_test = ss_score < 0.203 && (x_sd > 0.075 || y_sd > 0.075) ? '1' : '0';
        var straight_line = ss_score < 0.203 && y_sd < 0.1 && (y_mean > 0.45 && y_mean < 0.55) ? '1' : '0';

        return {
            'ss_score': ss_score,
            'pass_ss_test': pass_ss_test,
            'n_valid_scores': areas_count,
            'x_sd': x_sd,
            'y_sd': y_sd,
            'x_mean': x_mean,
            'y_mean': y_mean,
            'straight_line': straight_line
        };
    }

    function stats_average(arr) {
        var total = 0;
        for (var i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return total / arr.length;
    }

    function stats_standard_deviation(a, sample) {
        var n, mean, carry, val, d;
        n = a.length;

        if (n === 0) {
            return -1;
        }
        if (sample && n === 1) {
            return -1;
        }

        mean = stats_average(a);
        carry = 0.0;
        for (var i = 0; i < n; i += 1) {
            val = a[i];
            d = val - mean;
            carry += (d * d);
        }

        if (sample) {
            n -= 1;
        }
        return Math.sqrt(carry / n);
    }


    return my;
}($));


// Results Manager
(function ($) {

    //for storing and sending results
    var resultsManager = null;

    $(document).ready(beginExperiment);

    function beginExperiment() {
        resultsManager = new ResultsManager('/results-api/results');

        var pleaseWait = $('#please-wait-page');
        var errors = $('.setup-error');
        pleaseWait.show();

        if (errors.length > 0) {
            $('#please-wait-page').html('');
            errors.each(function () {
                $('#please-wait-page').append($(this));
            });
            return;
        }


        var inducersList = [];
        var nInducers = inducer.numberOfInducers();

        for (var i = 0; i < nInducers; i += 1) {
            inducersList[i] = i;
        }

        // Setup the inducer and concurrent
        concurrent.setup(function () {
            inducer.setup(inducersList, function () {
                showExperimentInstructions();
            });

        });

    }

    /*
 * Shows the experiments for the actual test
 */
    function showExperimentInstructions() {
        $('#instructions-button').click(function (evt) {
            evt.stopPropagation();
            showMainExperiment();
        });
        $('section').hide();
        $('#instructions-page').show();
    }

    function showMainExperiment() {
        $('section').hide();


        var $inducerPanel = $('#left-panel');
        var $concurrentPanel = $('#right-panel');
        var $responseButtons = $("#response-buttons");

        var $selectButton = $('#select-button');
        var $noConcurrentButton = $('#no-concurrent-button');

        var $thisWindow = $(window);


        var customClickEvent = (concurrent.customSetClickEvents != undefined);


        // Prepare the stimuli
        var stimuliList = [];
        var nInducers = inducer.numberOfInducers();
        var trials = [];


        // Standard method playing all stimuli
        for (var i = 0; i < nInducers; i++) {
            stimuliList[i] = i;
        }


        var initialTrialArray = shuffle(stimuliList);
        var halfWayMark = Math.round(initialTrialArray.length / 2);
        var firstHalf = initialTrialArray.slice(0, halfWayMark);
        var secondHalf = initialTrialArray.slice(halfWayMark, initialTrialArray.length);


        for (var repeat = 0; repeat < 3; ++repeat) {
            var newFirstHalf = shuffle(firstHalf);
            var newSecondHalf = shuffle(secondHalf);
            trials = trials.concat(newFirstHalf).concat(newSecondHalf);
        }

        trials = shuffle(trials);


        if (trials.length == 0) {
            $('body').html('<div>Error: No stimuli added in experiment!</div>');
            return;
        }

        // Variables for each trial
        var currentStimulusIndex = 0,
            currentTrialNumber = 0,
            stimulusInfo = {},
            nTrials = trials.length,
            trialShowing = false,
            timeTrialShown = -1;


        $thisWindow.bind("resize", prepareScreen);

        $("#trial-counter").text('Trials remaining: ' + (nTrials - currentTrialNumber));

        // Clear screen
        $inducerPanel.fadeOut(1);
        $concurrentPanel.fadeOut(1);
        $responseButtons.fadeOut(10, function () {
            // Begin Experiment
            $("#main-experiment-page").show();
            nextTrial();
        });


        // ========== END OF SETUP =============


        function prepareScreen() {


            inducer.prepareInducerScreen($inducerPanel);
            concurrent.prepareConcurrentScreen($concurrentPanel);
            var buttonsHeight = customClickEvent ? concurrent.getButtonsHeight() : 50;


            var mainPanelsHeight = Math.max($inducerPanel.outerHeight(), $concurrentPanel.outerHeight());
            var fullControlsHeight = mainPanelsHeight + buttonsHeight; //add space for buttons

            var spaceBetweenPanels = $concurrentPanel.outerWidth() > 0 ? 20 : 0;
            var mainPanelsWidth = $inducerPanel.outerWidth() + $concurrentPanel.outerWidth() + spaceBetweenPanels;

            var windowWidth = $thisWindow.outerWidth();
            var windowHeight = $thisWindow.outerHeight();

            var topOfFullControls = (windowHeight - fullControlsHeight) / 2;

            $inducerPanel.css({
                top: topOfFullControls + Math.max(0, ($concurrentPanel.outerHeight() - $inducerPanel.outerHeight()) / 2),
                left: (windowWidth - mainPanelsWidth) / 2
            });

            var rightPanelLeft = ((windowWidth - mainPanelsWidth) / 2) + $inducerPanel.outerWidth() + spaceBetweenPanels;

            $concurrentPanel.css({
                top: topOfFullControls + Math.max(0, ($inducerPanel.outerHeight() - $concurrentPanel.outerHeight()) / 2),
                left: rightPanelLeft
            });


            if (customClickEvent) {
                concurrent.prepareCustomClickLayout(topOfFullControls + mainPanelsHeight);
                $responseButtons.hide();
            } else {
                $noConcurrentButton.hide();
                $selectButton.css({
                    top: topOfFullControls + mainPanelsHeight,
                    left: (windowWidth - $selectButton.outerWidth()) / 2
                });
            }

            $(document).trigger('screen-refresh', [$inducerPanel, $concurrentPanel]);

        }

        function nextTrial() {


            //get grapheme for this trial
            currentStimulusIndex = trials[currentTrialNumber];

            //prepare inducer and concurrent for next trial
            stimulusInfo = inducer.updateInducer(currentStimulusIndex);
            concurrent.resetConcurrentState();

            // Dispatch a trial-begin event
            var event = new CustomEvent("trial-begin", {
                detail: {
                    "currentTrialNumber": currentTrialNumber,
                    "currentStimulusIndex": currentStimulusIndex,
                    "nTrials": nTrials,
                    "trialsLeft": nTrials - currentTrialNumber
                }
            });

            document.dispatchEvent(event);

            // Begin the next trial, inducer followed by concurrent
            trialShowing = true;
            timeTrialShown = Math.round((new Date()).getTime());
            ShowInducer();
        }

        function ShowInducer() {
            prepareScreen();
            if (inducer.beginNextTrial != undefined) {
                inducer.beginNextTrial($inducerPanel, ShowConcurrent);
            } else {
                $inducerPanel.fadeIn(100);
                ShowConcurrent();
            }
        }

        function ShowConcurrent() {
            prepareScreen();
            if (concurrent.beginNextTrial != undefined) {
                concurrent.beginNextTrial($concurrentPanel, SetUserInputForCurrentTrial);
            } else {
                $concurrentPanel.fadeIn(100);
                SetUserInputForCurrentTrial();
            }
        }

        function SetUserInputForCurrentTrial() {
            prepareScreen();
            if (customClickEvent) {
                concurrent.customSetClickEvents(TrialSelectedCallback)
            } else {
                $responseButtons.fadeIn(100);
                $selectButton.off().click(TrialSelectedCallback);
                $noConcurrentButton.off().click(NoConcurrentSelectedCallback);
            }
        }

        function TrialSelectedCallback(evt) {
            var trialResult = concurrent.concurrentSelected(true);
            CheckTrialResult(trialResult);
        }

        function NoConcurrentSelectedCallback(evt) {
            var trialResult = concurrent.concurrentSelected(false);
            CheckTrialResult(trialResult);
        }

        function CheckTrialResult(trialResult) {
            if (trialResult != false) {
                trialComplete(trialResult);
            } else {
                SetUserInputForCurrentTrial();
            }
        }


        function trialComplete(trialResult) {

            // Check that multiple clicks dont trigger multiple results...
            if (!trialShowing) return;

            // Flag that trial has ended
            trialShowing = false;

            // Record time trial has stopped
            var timeTrialStopped = Math.round((new Date()).getTime());

            // Turn off clicks
            $selectButton.off();
            $noConcurrentButton.off();

            // Copy all trial info alongside the result
            trialResult = Object.assign(trialResult, stimulusInfo);
            trialResult.trial_index = currentTrialNumber;
            trialResult.rt = timeTrialStopped - timeTrialShown;

            // Store the resutls
            resultsManager.StoreTrial(trialResult, currentTrialNumber);

            // Clear screen
            $inducerPanel.fadeOut(100);
            $concurrentPanel.fadeOut(100);
            $responseButtons.fadeOut(100);

            //advance to next trial
            currentTrialNumber++;

            $("#trial-counter").text('Trials remaining: ' + (nTrials - currentTrialNumber));

            if (currentTrialNumber < nTrials) {
                setTimeout(nextTrial, 300);
            } else {
                endExperiment();
            }

        }

        function endExperiment() {
            if (typeof concurrent.EndExperiment === 'function') {
                concurrent.EndExperiment(resultsManager);
            }

            resultsManager.SendResults(function (success, returnedData) {
                window.location = success ? returnedData.redirect : '/error';

            });
            $('section').hide();
            $('#please-wait-page').show();
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
    }

}($));


(function ($) {

    var showVPWindow = true;
    $(document).ready(setupViewPortWarning);
    $(window).resize(setupViewPortWarning);
    $('#viewport-continue').click(function () {
        showVPWindow = false;
        $('#viewport-warning').hide();
    });

    function setupViewPortWarning() {
        if (!showVPWindow) return;

        var $vp = $('#viewport-warning');
        if (viewPortIsTooSmall()) {
            $vp.css({
                width: "100%"
            });

        } else {
            $vp.css({
                width: "0"
            });
        }

    }

    function viewPortIsTooSmall() {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        $('#vp-width').html(w);
        $('#vp-height').html(h);
        return w < 980 || h < 660;
    }
})($);


/**
 * ResultsManager
 * A general purpose class for tests which have two types of results:
 * trials: repetitions of some kind of data structure, e.g. in a repetitive test
 * testResults: one off values associated with an entire test, e.g. scores, or questionnaire values
 *
 * Saves form using public function 'saveForm' in test-js.blade.php
 */
function ResultsManager() {

    let testResults = {};
    let trials = [];
    this.StoreTrial = StoreTrial;
    this.SendResults = SendResults;
    this.StoreTestResult = StoreTestResult;
    this.StoreNextTrial = StoreNextTrial;
    this.GetTrials = function() { return trials; }

    /*
     * Stores a participant-wise test result.
     *
     * testResultName: the variable's name
     * testResult: the value
     */
    function StoreTestResult(testResultName, testResult) {
        testResults[testResultName] = testResult;
    }


    /*
     * Stores a trial-wise result - no explicit indexing required, but be careful not to store duplicates
     * if calling from say a click handler.
     *
     * result: and object with each variable name as property, and values as strings / numbers
     *
     * returns: trialIndex: integer reperesenting trial (starting at 0) - can be used with StoreTrial to overwrite trials etc
     */
    function StoreNextTrial(result) {
        StoreTrial(result, trials.length);
        return trials.length;
    }

    /*
     * Stores a trial-wise result.  Use this if you want to change a specific trial.
     *
     * result: and object with each variable name as property, and values as strings / numbers
     * trialIndex: integer reperesenting trial (starting at 0)
     */
    function StoreTrial(result, trialIndex) {

        var isInt = typeof trialIndex === 'number' && (trialIndex % 1) === 0;

        if (!isInt) {
            throw 'Must include a valid integer as trialIndex as second argument.';
        }

        if (!result.hasOwnProperty('trial_index')) {
            result.trial_index = trialIndex;
        }

        if (!result) {
            throw 'Cannot store empty results.';
        }

        if (trialIndex > trials.length) {
            console.warn('trialIndex is greater than the number of trials stored - this will create null entries');
        }

        trials[trialIndex] = result;
    }


    /*
     * Sends the results to the server.
     */
    function SendResults() {

        // Saves form using public function in test-js.blade.php
        saveForm({
            trials: JSON.stringify(trials),
            testResults: JSON.stringify(testResults)
        })
    }
}
