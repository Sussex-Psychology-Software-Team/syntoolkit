@push('scripts')
    <script src="{{ asset('js/tests/helpers/results-manager.js')}}"></script>
    <script src="{{ asset('js/tests/grapheme-colour.js')}}"></script>
@endpush

<style>

    /*
    * Rules to prevent using on small devices
    */

    #adult-gc-warning-message { display: none; }

    @media only screen and (max-width:749px){
        #adult-gc-wrapper { display:none; }
        #adult-gc-warning-message { display:block; }
    }

    @media only screen and (min-width:750px){
        #adult-gc-warning-message { display:none; }
        #adult-gc-wrapper { display:block; }
    }


    #instructions {
        text-align: center;
    }

    .main-instructions-text {
        width:900px;
        display: inline-block;
        text-align: justify;
    }

    .instructions {
        width:900px;
        height:300px;
        position:absolute;
        left:50%;
        top:50%;
        text-align: justify;
        margin:-150px 0 0 -450px;
    }

    .centre-wrapper {
        text-align: center;
    }

    .adult-gc-canvas-btn {
        position: absolute;
        text-align: center;
        z-index: 2;
        width: 140px;
    }



    /* Cells in even rows (2,4,6...) are one color */
    #adult-gc-results-table tr:nth-child(even) td { background: #F1F1F1; }

    /* Cells in odd rows (1,3,5...) are another (excludes header cells)  */
    #adult-gc-results-table tr:nth-child(odd) td { background: #FEFEFE; }


    .adult-gc-btn {
        display: inline-block;
        background: #d6d6d6;
        background-image: -webkit-linear-gradient(top, #d6d6d6, #adadad);
        background-image: -moz-linear-gradient(top, #d6d6d6, #adadad);
        background-image: -ms-linear-gradient(top, #d6d6d6, #adadad);
        background-image: -o-linear-gradient(top, #d6d6d6, #adadad);
        background-image: linear-gradient(to bottom, #d6d6d6, #adadad);
        -webkit-border-radius: 28px;
        -moz-border-radius: 28px;
        border-radius: 28px;
        font-family: Arial, sans-serif;
        color: #ffffff;
        font-size: 20px;
        padding: 10px 20px 10px 20px;
        text-decoration: none;
        cursor: pointer;
    }

    .adult-gc-btn:active {
        background: #ebe6eb;
        background-image: -webkit-linear-gradient(top, #ebe6eb, #d9d9d9);
        background-image: -moz-linear-gradient(top, #ebe6eb, #d9d9d9);
        background-image: -ms-linear-gradient(top, #ebe6eb, #d9d9d9);
        background-image: -o-linear-gradient(top, #ebe6eb, #d9d9d9);
        background-image: linear-gradient(to bottom, #ebe6eb, #d9d9d9);
        text-decoration: none;
    }

    .hidden {
        display: none;
    }

    canvas{
        touch-action: none;
    }

    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
    }
</style>

<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>

<div id="adult-gc-wrapper">
    <section id="youhavesynaesthesia" class="instructions hidden">
        Some people with grapheme-colour synaesthesia experience colour associations for just numbers, or just letters,
        and some for both. Please select which of the following applies to you:
        <br>
        I have involuntary, automatic colour associations when I see, hear or think about NUMBERS.<br>

        <div id="has_number_radios" class="intro-radios">
            <input type="radio" name="has_number" value="yes"> Yes<br>
            <input type="radio" name="has_number" value="no"> No<br>
        </div>

        <br>
        I have involuntary, automatic colour associations when I see, hear or think about LETTERS.<br>

        <div id="has_letter_radios" class="intro-radios">
            <input type="radio" name="has_letter" value="yes"> Yes<br>
            <input type="radio" name="has_letter" value="no"> No<br>
        </div>
        <div class="centre-wrapper">
            <div id='intro-button-2' class="psButton noselect">Continue</div>
        </div>
    </section>

    <section id="exitpage" class="instructions hidden centre-wrapper">
    </section>

    <section id='instructions' class="instructions hidden">
        <div class="main-instructions-text">
            The synaesthesia test will start on the next page. You will see <var class="type-of-grapheme-plural"></var> on the screen next to a
            colour palette. For each <var class="type-of-grapheme"></var>, choose the colour you think it best goes with. You can
            choose any colour you like, but please don't pick the same colour for everything. Be as fast as you can.<br>
            <br>
            Here’s how to choose a colour. First click the vertical colour bar to pick the kind of colour you want. Then pick the shade by clicking on the shade box. Black, white and grey are at the edges of the shade box. Your chosen colour is shown in the large rectangle.<br>
            <br>
            In order to properly measure this type of synaesthesia, this task will take longer than others in The Perception Census. We appreciate you sticking with it! You will be able to see your progress as you go through the test.<br>
            <br>
        </div>
        <br>
        <div class="main-instructions-text">
            <br>
            <div class="centre-wrapper">
                <div id='start-button' class="psButton noselect">Start</div>
            </div>
        </div>
    </section>

    <section id='mainExperiment' style="position: absolute; left: 0; top: 0; display: none">
        <canvas id="layer1" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>
        <canvas id="layer2" style="position: relative; left: 0; top: 0; z-index: 1; pointer-events:none;"></canvas>
        <div id='select-button' class="psButton adult-gc-canvas-btn noselect">Select</div>
        <div id='no-colour-button' class="psButton adult-gc-canvas-btn noselect">No Colour</div>
    </section>

    <section id='pauseDiv' class="instructions hidden">
        <div class="instructionsemphasis centre-wrapper">Paused</div><br>
        <br>

        You have paused the experiment. Please don’t close this window or your experiment will be lost.<br>
        <br>
        The experiment needs to run in full screen, but if you need to exit for any reason just press Escape<br>
        <br>
        Press 'Continue' to carry on with the experiment.<br>
        <br>
        <div class="centre-wrapper">
            <div id='continue-button' class="psButton noselect">Continue</div>
        </div>
    </section>


</div>
<div id="adult-gc-warning-message">
    This website is only viewable on larger windows than this - to fix this:<br>
    a) If you can, drag the window so it is wider <br>
    b) If you are on an iPad, try viewing in landscape. <br>
    c) Try viewing on your laptop <br>
</div>
