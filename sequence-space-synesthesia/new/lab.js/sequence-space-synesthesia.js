// Lab.js ----------------
const ds = this.options.datastore

function endTest(end_text=JSON.stringify(data)){
    document.removeEventListener('click',changeText)
    document.removeEventListener('keydown',changeText)
    document.getElementById('counter').hidden = true

    for(let i=0;i<data.length;i++){
        ds.commit(data[i])
    }
    document.getElementById("main").className = "unhook"; //stops our main div taking up the whole screen
    text.innerHTML = end_text+'<br>Please press the continue button below.'//JSON.stringify(data)
}



// Stimuli ----------------
const sequences_set = [0,1,2,3,4,5,6,7,8,9,
            'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
            'September', 'October', 'November', 'December']

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

function duplicateArray(array, repeats){
    const duplicated = []
    for(let i=0;i<repeats;i++){
        shuffle(array)
        duplicated.push(... array) //nested for loop as polyfill?
    }
    return duplicated
}

const seqs = duplicateArray(sequences_set,3) //e.g. dups=2 doubles array


// Run ----------------
let trial_number = -1, start_time //trial -1 is the instruction screen
const data = [];
const text = document.getElementById('sequence')
const count = document.getElementById('count')

document.addEventListener('click',changeText)
document.addEventListener('keydown',changeText)

function changeText(e){
    const keydown = e.type === 'keydown'
    if(keydown && e.key!=' ' && e.key!='n'){ return }  //check for 'no spatial association' keys

    if(trial_number>-1){ // save data after first trial
        data.push({ //save
            'sequence': seqs[trial_number],
            'x': keydown ? -1 : e.clientX, //consider screen, client, page, offset coordinates
            'y': keydown ? -1 : e.clientY,
            'window_width': window.innerWidth,
            'window_height': window.innerHeight,
            'no_association': keydown,
            'reaction_time': e.timeStamp-start_time
        })
        console.log(data)
    } else { //on first click
        if(!keydown){return} // first click may be a little hasty...
        document.getElementById('counter').hidden = false
    }

    //last click end exp
    if(trial_number === seqs.length-1){ 
        endTest('You have reached the end of this test.')
        return
    } else if(trial_number === sequences_set.length){ //STOPPING RULE
        const no_association_count = data.filter(function(e){return e.no_association === true})
        if(no_association_count.length/sequences_set.length > .9){
            endTest("Sorry, you pressed the 'No Association' key too many times to continue this test")
            return
        }
    }

    trial_number++ //increase trial number
    text.innerHTML = seqs[trial_number]
    count.innerHTML = seqs.length-trial_number
    start_time = performance.now()
}


