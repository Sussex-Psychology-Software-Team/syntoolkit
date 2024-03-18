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
        //NOTE DOENS'T WORK, DON'T HAVE TEST-JS
        saveForm({
            trials: JSON.stringify(trials),
            testResults: JSON.stringify(testResults)
        })
    }
}
