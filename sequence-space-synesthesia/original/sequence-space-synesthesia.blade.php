@push('scripts')
    <script src="{{ asset('js/tests/helpers/results-manager.js')}}"></script>
    <script src="{{ asset('js/tests/sequence-space.js')}}"></script>
@endpush
<div class="content">

    <style>

        .dot {
            width: 10px;
            height: 10px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            transition: width 0.5s, height 0.5s, top 0.5s, left 0.5s;
        }

        .btn {
            display: inline-block;
            background: #d6d6d6;
            background-image: -webkit-linear-gradient(top, #d6d6d6, #adadad);
            background-image: -moz-linear-gradient(top, #d6d6d6, #adadad);
            background-image: -ms-linear-gradient(top, #d6d6d6, #adadad);
            background-image: -ms-linear-gradient(top, #d6d6d6, #adadad);
            background-image: -o-linear-gradient(top, #d6d6d6, #adadad);
            background-image: linear-gradient(to bottom, #d6d6d6, #adadad);
            -webkit-border-radius: 28px;
            -moz-border-radius: 28px;
            border-radius: 28px;
            color: #ffffff;
            font-size: 20px;
            padding: 10px 20px 10px 20px;
            text-decoration: none;

            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

        }

        .btn:hover {
            background: #ebe6eb;
            background-image: -webkit-linear-gradient(top, #ebe6eb, #d9d9d9);
            background-image: -moz-linear-gradient(top, #ebe6eb, #d9d9d9);
            background-image: -ms-linear-gradient(top, #ebe6eb, #d9d9d9);
            background-image: -o-linear-gradient(top, #ebe6eb, #d9d9d9);
            background-image: linear-gradient(to bottom, #ebe6eb, #d9d9d9);
            text-decoration: none;
        }

        .instructions-page {
            width: 900px;
            display: inline-block;
        }

        .instructions {
            width:900px;
            height:300px;
            position:absolute;
            left:50%;
            top:50%;
            font-size: 20px;
            text-align: justify;
            margin:-300px 0 0 -450px;
        }

        .instructionsemphasis {
            font-size: 22px;
        }



        .canvas-btn {
            position: absolute;
            text-align: center;
            z-index: 2;
            width: 140px;
            margin-top: 20px;
        }

        #left-panel {
            display: inline-block;
            position: absolute;
        }

        #right-panel {
            display: inline-block;
            position: absolute;
        }

        .hidden {
            display: none;
        }

        .centre-wrapper {
            text-align: center;
        }

        #trial-counter {
            text-align: right;
            margin-bottom: 10px;
            padding-right: 10px;
        }

        .loader {
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

    </style>

    <section id="instructions-page" class="centre-wrapper hidden instructions">
        <div class="instructions-text">
            <div style="text-align: left;">
                <p>
                    In this test you'll see numbers (0-9), days of the week (e.g., Tuesday), and months of the year (e.g., July) displayed in the centre of the screen.
                <br><br>
                    Your task is to think about how these concepts might be arranged spatially on a two-dimensional (ie., flat) screen. Some people may automatically think about these concepts spatially in their everyday life, and if this is something you do, then you should use this.
                    <br><br>
                    For other people this may seem like a strange task, but just go with your intuitions. There aren’t any right or wrong answers.
                    <br><br>
                    <strong>When you see each item on the computer screen, visualise where it fits spatially and click the mouse in the corresponding location on the screen.</strong>
                    <br><br>
                    Each item (number or day or month) is repeated three times.
                    <br><br>
                    In order to accurately measure this type of synaesthesia this task will be longer than others in The Perception Census. We appreciate you sticking with it! You will be able to see your progress as you go through the test.
                </p>
            </div>
        <div class="centre-wrapper">
            <div id="instructions-button" class="psButton">Next</div>
        </div>
    </section>


    <section id="main-experiment-page">
        <div id="main-experiment">
            <div id="trial-counter"></div>
            <div id="main-panels">
                <div id="left-panel">

                    <div id="middle">
                        <div id="string-inducer" style="text-align: center">
                        </div>
                    </div>



                    <style>
                        #string-inducer {
                            margin-left: auto;
                            margin-right: auto;
                        }

                        #middle {
                            display: table-cell;
                            vertical-align: middle;
                        }

                        #left-panel {
                            display: table;
                        }
                    </style>      </div>
                <div id="right-panel">




                    <style>

                    </style>
                </div>
            </div>
            <div id="response-buttons">
                <div id="no-concurrent-button" class="btn canvas-btn"></div>
                <div id="select-button" class="btn canvas-btn">Select</div>
            </div>
        </div>
    </section>

    <section id="please-wait-page" class="instructions hidden" style="text-align: center; display: none;">
        Please wait loading...<br>
        <div class="loader"></div>
    </section>

    <div id="viewport-warning" style="width: 100%; display: none;">

        <h1>Please resize your browser!</h1>
        <div id="viewport-warning-content">
            <p>We have detected that your browser viewing area is currently too small.  Our experiments are designed to work on a viewport size of at least 980 x 660 pixels.</p>
            <p>Your current viewport width is: <span id="vp-width">878</span> and height: <span id="vp-height">870</span></p>
            <p>Please increase your viewport with one or more of the following methods:
            </p>
            <ul>
                <li>
                    Maximise your browser window.
                </li>
                <li>
                    If you are on a tablet, try rotating the screen to another orientation.
                </li>
                <li>
                    Zoom out.  The keyboard short-cut for this is Ctrl and - (Windows, Linux, and Chrome OS) and ⌘ and - (Mac).  If you are on a tablet, you might need do a google search for the way to be able to zoom out.
                </li>
                <li>
                    Change your screen resolution or skip to a device with a larger monitor or resolution.
                </li>
            </ul>
            <br>
            This message will dissapear once your window is large enough.<br>
            <br>


        </div><br>

        <button id="viewport-continue">Continue Anyway</button>

    </div>

    <style>
        #viewport-warning {
            text-align: center;
            height: 100%;
            width: 0;
            position: fixed;
            z-index: 1;
            top: 0;
            left: 0;
            color: white;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0, 0.9);
            overflow-x: hidden;
            transition: 0.5s;
        }

        #viewport-warning-content {
            display: inline-block;
            text-align: left;
            max-width: 500px;
            width: 500px;
        }
    </style>


</div>
