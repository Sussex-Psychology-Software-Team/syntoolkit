const ds = this.options.datastore
function saveData(){
    //note access data from previous screens with e.g. for a form element named 'letters': ds.data[ds.data.length-1].letters; ds.get('letters'); or ds.extract('letters','grapheme-questionnaire') where 'grapheme-questionnaire' is the name of the lab.js element
    for(let i=0;i<data.length;i++){
        ds.commit(data[i]) //write each datapoint as a new line
    }
    document.getElementById("fullpage").className = "unhook"; //stops our main div taking up the whole screen, if applicable
    document.querySelector('button[type="submit"][form="page-form"]').style.display = 'block'; //show the continue button, if applicable
    return
}