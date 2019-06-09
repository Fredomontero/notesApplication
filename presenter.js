var notesArray = [];
var actions = [];


function Presenter(){
    
    //Attach event to input
    var input = document.getElementById("add-input");
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            var note = new Note(input.value);
            input.value = "";
            renderNote(note)
        }
    });

    var search = document.getElementById("search-input");
    search.addEventListener("keyup", function(event) {
        if (search.value.length > 0) {
            let results = notesArray.filter(note => note.text.includes(search.value));
            console.log("The results are: ", results);
            restoreNotes(results);
        }else{
            notesArray = JSON.parse(localStorage.getItem('notesArray'));
            restoreNotes(notesArray);
        }
    });
}

  //function to render notes
  function renderNote(note, array){
    var container = document.getElementsByClassName('notes-container')[0];
    var htmlString = generateHtmlString(note);
    container.insertAdjacentHTML( 'beforeend', htmlString );
    //attach event to text areas
    var textArea = document.getElementById("ta"+note.id);

    textArea.addEventListener('blur', function(){
        var temp = array.find(x => x.id === note.id);
        var idx =  array.indexOf(temp);
        if((array[idx] && array[idx].text) != textArea.value){
            //Updating the array and the Local storage
            actions.push({type:"text", initialInfo: array[idx].text, finalInfo:textArea.value, elementId:temp.id});
            console.log("The actions updated are: ", actions);
            if(array[idx])
                array[idx].text = textArea.value;
            localStorage.setItem('notesArray', JSON.stringify(array));
        }
    });
    textArea.onkeydown = function(e){
        if(e.keyCode === 9){
            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;
        }
    };
}

//Function to generate an html string
function generateHtmlString(note){
    return '<div id="'+note.id+'" class="note" draggable="true" ondragstart="drag(event)" ondragend="dragEnd(event)" style="top:'+note.y+'px; left:'+note.x+'px;"><textarea id="ta'+note.id+'" rows="9" cols="20">'+note.text+'</textarea></div>';
}

//function that gets notes from local storage and restore them as objects
function restoreNotes(array){
    var container = document.getElementsByClassName('notes-container')[0];
    console.log("Clearing container");
    container.innerHTML = "";
    for(var i = 0; i < array.length; i++){
        renderNote(array[i], array);
    }   
}


//function to update note in array and localStorage
function updateNote(array, note){
    var temp = array.find(x => x.id === note.id);
    var idx =  array.indexOf(temp);
    array[idx] = note;
    localStorage.setItem('notesArray', JSON.stringify(array));
}

//functions for drag and drop
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    var remove = document.getElementById('clean-storage');
    remove.style.opacity = 1;
}

function dragEnd(ev){
    var remove = document.getElementById('clean-storage');
    remove.style.opacity = 0;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var container = document.getElementsByClassName('notes-container')[0];
    removeChild(container, document.getElementById(data));
}

function dropInContainer(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var item = document.getElementById(data);
    item.style.position = "absolute";
    item.style.zIndex = 1000;
    item.style.left = ev.pageX+"px";
    item.style.top = ev.pageY+"px";
    var note = notesArray.find(x => x.id == item.id);
    actions.push({type:"position", initialInfo: {x:note.x, y:note.y}, finalInfo:{x:ev.pageX, y:ev.pageY}, elementId:item.id});
    note.x = ev.pageX;
    note.y = ev.pageY;    
    updateNote(notesArray, note);
}

//Function to remove a Child
function removeChild(container, element){
    var temp = this.notesArray.find(x => x.id == element.id);
    var idx =  this.notesArray.indexOf(temp);
    //Remove from array
    var removed = this.notesArray.splice(idx, 1);
    localStorage.setItem('notesArray', JSON.stringify(this.notesArray));
    container.removeChild(element);
}


window.onload = function(){
    if(localStorage.getItem('notesArray') != null){
        notesArray = JSON.parse(localStorage.getItem('notesArray'));
        restoreNotes(notesArray);
    }
    var presenter = new Presenter();
}
