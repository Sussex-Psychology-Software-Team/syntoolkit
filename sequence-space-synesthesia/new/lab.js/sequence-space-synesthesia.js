// Lab.js ----------------
const ds = this.options.datastore

function endTest(){
    text.innerHTML = JSON.stringify(data)
    for(let i=0;i<data.length;i++){
        ds.commit(data[i])
    }
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

const seqs = duplicateArray(sequences_set,2) //dups=1 makes 1 duplicate i.e. doubles array length


// Run ----------------
let trial_number = -1 //trial -1 is the instruction screen
const data = []
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
        })
        console.log(data)
    } else { //on first click
        document.getElementById('counter').hidden = false
    }

    //last click end exp
    if(trial_number === seqs.length-1){ 
        document.removeEventListener('click',changeText)
        text.innerHTML = JSON.stringify(data)
        document.getElementById('counter').hidden = true
        endTest()
        return
    }

    trial_number++ //increase trial number
    text.innerHTML = seqs[trial_number]
    count.innerHTML = seqs.length-trial_number
}


