// BROWSER ------------------
// Browser-specific code
let grapheme_set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
let data=[] //decalre here incase we end study before collecting data
let runTest = true //to stop trial execution early if needed
function endTest(end_text= JSON.stringify(data)){
    //stuff to do when the exp is ended
    document.getElementById('container').innerHTML = end_text
}



// CANVAS ------------------
const hue_canvas = document.getElementById("hue");
const hue_ctx = hue_canvas.getContext('2d');
const shade_canvas = document.getElementById("shade",{ willReadFrequently: true });
const shade_ctx = shade_canvas.getContext('2d');
const display_canvas = document.getElementById("display");
const display_ctx = display_canvas.getContext('2d');



// GRAPHEMES ------------------
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex > 0) { // While there remain elements to shuffle.
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function getGraphemes(raw_graphemes, repeats){
    //note we are going to check scores after the first pass of all grpahemes so need to be shuffled in sets
    let graphemes_array = raw_graphemes.split('') //make array
    let rep_graphemes = '';
    for(let i=0;i<repeats;i++){
        shuffle(graphemes_array) //shuffle array of graphemes
        rep_graphemes += graphemes_array.join('') //append as string
    }
    const graphemes = rep_graphemes.split('')
    return graphemes
}


// HUE -----------------
function drawHues(){
    const width = hue_canvas.width
    const height = hue_canvas.height
    hue_ctx.clearRect(0, 0, width, height)
    for(let h=0; h<361; h++){
        hue_ctx.fillStyle = `hsl(${h+offset}, 100%, 50%)`;
        hue_ctx.fillRect(0, h*(height/360), width, 2)
        //hue_ctx.strokeStyle = `hsl(${h+offset}, 100%, 50%)`
        //hue_ctx.beginPath()
        //hue_ctx.moveTo(0, h*(height/360))
        //hue_ctx.lineTo(width, h*(height/360))
        //hue_ctx.stroke()
    }
}

hue_canvas.addEventListener('mousedown',hueSelect);
hue_canvas.addEventListener('mouseup', ()=>{ hue_canvas.onmousemove = null });
hue_canvas.addEventListener('mouseout', ()=>{ hue_canvas.onmousemove = null });

function hueSelect(e){
    drawHues() //clear canvas
    //draw black line at location
    hue_ctx.strokeStyle = 'black';
    hue_ctx.beginPath();
    hue_ctx.moveTo(0, e.offsetY);
    hue_ctx.lineTo(hue_canvas.width, e.offsetY);
    hue_ctx.stroke();
    // replace canvas colour
    hue_loc = e.offsetY //laziness for handling resize events
    h = ((e.offsetY*(360/hue_canvas.height))+offset) % 360
    shadeSelect(shade_loc) // keep selected shade consistent
    shade_canvas.onmousemove = null //remove mousemove event added in shadeSelect()
    hue_canvas.onmousemove = hueSelect //add handler on click to move as well
}


// SHADE -----------------
function drawShades(h){
    shade_ctx.clearRect(0,0,shade_canvas.width,shade_canvas.height);
    const w = shade_canvas.width/100 //canvas width is 360, with 100 s and l values
    for(let s=0;s<101;s++){
        for(let l=0;l<101;l++){
            shade_ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
            shade_ctx.fillRect(Math.ceil(s*w),Math.ceil(l*w),Math.ceil(w),Math.ceil(w)); //w+1 on last two also deals with aliasing well enough?
        }
    }
}

//selection on shade canvas
shade_canvas.addEventListener('mousedown',shadeSelect);
shade_canvas.addEventListener('mouseup', ()=>{ shade_canvas.onmousemove = null });
shade_canvas.addEventListener('mouseout', ()=>{ shade_canvas.onmousemove = null });

function shadeSelect(e){
    //hue must be selected first, and stop mousemove out of bounds
    if(h===undefined || e.offsetX>shade_canvas.width || e.offsetX<0 || e.offsetY>shade_canvas.height || e.offsetY<0){ return }
    //store data
    const w = shade_canvas.width/100
    data[trial_num].hsl = [h, Math.round(e.offsetX/w), Math.round(e.offsetY/w)] //store current hsl
    shade_loc = {'offsetX':e.offsetX, 'offsetY':e.offsetY} //store selected shade. stays the same on event of hue change.
    //draw on canvases
    drawShades(h) //redraw
    selectedColour(shade_loc)  //get colour on fresh draw
    //draw select circle
    shade_ctx.strokeStyle = 'black'
    shade_ctx.beginPath();
    shade_ctx.arc(e.offsetX, e.offsetY, w*1, 0, 2 * Math.PI);
    shade_ctx.stroke();
    shade_canvas.onmousemove = shadeSelect
}


// DSIPLAY -------------------
function selectedColour(e){
    select.disabled = false
    //get colour and put on other canvas, e.target.getContext('2d').getImageData()
    const p = shade_ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data; //rgb - can optionally use a input event?
    display_ctx.fillStyle = `rgb(${p})`;
    display_ctx.fillRect(0, 0, display_canvas.width, display_canvas.height)
    grapheme.style.color = `rgb(${p})`; //comment this out to remove chaning the font colour
    data[trial_num].rgb = Object.values(p).slice(0,-1) //store data
}


// BUTTONS ---------------------
const select = document.getElementById("select")
const no_colour = document.getElementById("no_colour")

select.addEventListener('click', buttonClick)
no_colour.addEventListener('click', buttonClick)

function buttonClick(e){
    if(e.target.id == 'no_colour'){ //wipe data if no colour selected
        data[trial_num].rgb = []
        data[trial_num].hsl = []
    }
    data[trial_num].no_colour = e.target.id==='no_colour'
    data[trial_num].reaction_time = e.timeStamp-start_time
    console.log(data)
    newTrial()
}


// RUN ----------------
//text displays
const grapheme = document.getElementById("grapheme")
const remaining = document.getElementById("remaining")

//globals
const graphemes = getGraphemes(grapheme_set,3) //repeats=2 returns 2 copies of array
let h, offset, shade_loc, trial_num = -1, hue_loc, start_time  //being lazy with the y

function newTrial(){
    trial_num++
    if(trial_num === grapheme_set.length){ //STOPPING RULE
        const no_colour_count = data.filter(function (e) { return e.no_colour === true; });
        if(no_colour_count.length/grapheme_set.length > .9){ //end if >90% of trials were 'no colour'
            endTest("Sorry, you pressed the 'No Colour' button too many times to continue this test.")
            return
        }
    } else if(trial_num==graphemes.length){ //END OF EXP
        endTest('')
        return
    }

    //hues at random location
    offset = Math.floor(Math.random() * 361);
    drawHues()

    //clear display
    shade_ctx.clearRect(0, 0, shade_canvas.width, shade_canvas.height)
    display_ctx.clearRect(0, 0, display_canvas.width, display_canvas.height)
    select.disabled = true

    //clear globals
    h = undefined
    shade_loc = {'offsetX':shade_canvas.width-1, 'offsetY':shade_canvas.height/2} //init hue to max sat

    //setup data
    const g = graphemes[trial_num]
    data.push({
        'trial_number': trial_num,
        'grapheme':g,
        'rgb':[],
        'hsl':[],
        'no_colour': false,
        'reaction_time':0,
    })
    
    //update html
    grapheme.style.color = 'black';
    grapheme.innerHTML = g;
    remaining.innerHTML = graphemes.length-trial_num
    start_time = performance.now()
}

if(runTest){
    newTrial()
}

// WINDOW RESIZE ------------
window.onresize = windowResize
let min = Math.min(window.innerWidth, window.innerHeight)

function windowResize(){ // set canvas size in HTML
    const change = min/Math.min(window.innerWidth, window.innerHeight)
    min = Math.min(window.innerWidth, window.innerHeight)
    const thirty = Math.round(.3*min)
    //document.getElementById("container").style.width = .7*min+'px'
    //document.getElementById("picker").style.width = .7*min+'px'
    //document.getElementById("picker").style.height = .3*min+'px'
    hue_canvas.height = thirty
    hue_canvas.width = thirty/10
    shade_canvas.width = thirty
    shade_canvas.height = thirty
    display_canvas.height = thirty
    display_canvas.width = .7*min
    drawHues() //redraw
    if(h!==undefined){ // redraw selected values
        let e = {'offsetY': hue_loc /= change } // too difficult to extract hue_loc from h otherwise..
        hueSelect(e)
        drawShades(h)
        if(change!=1){
            shade_loc.offsetX /= change
            shade_loc.offsetY /= change
        }
        shadeSelect(shade_loc)
        hue_canvas.onmousemove = null
        shade_canvas.onmousemove = null
    }
}

windowResize()