var notesArray = [];


function Presenter(){
    
    //Attach event to input
    var input = document.getElementById("add-input");

    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            var note = new Note(input.value);
            console.log("The note is: ", note);
            input.value = "";
            renderNote(note)
        }
      });
}

  //function to render notes
  function renderNote(note, array){
    var container = document.getElementsByClassName('notes-container');
    var htmlString = generateHtmlString(note);
    insert(container, htmlString, function(fragment){
        // console.log(fragment);
        this.appendChild(fragment); //Here we actually append the child
    });
    // console.log('[Inside renderNote function]: ', array);
    //attach event to text areas
    var textArea = document.getElementById("ta"+note.id);
    textArea.addEventListener('blur', function(){
        var temp = array.find(x => x.id === note.id);
        var idx =  array.indexOf(temp);
        // console.log('The object is: ', temp + ' and his index is: ', idx);
        if((array[idx] && array[idx].text) != textArea.value){
            //Updating the array and the Local storage
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
    return '<div id="'+note.id+'" class="note" draggable="true" ondragstart="drag(event)" ondragend="dragEnd(event)"><textarea id="ta'+note.id+'" rows="9" cols="20">'+note.text+'</textarea></div>';
}

//Function to insert divs (notes) into the body
function insert(elems, args, callback){
    if(elems.length){
        // console.log('Inside insert function');
        var doc = elems[0].ownerDocument || elems[0],
        fragment = doc.createDocumentFragment(),
        scripts = getNodes(args, doc, fragment),
        first = fragment.firstChild;
        console.log("First: ", first);
        if(first){
            for(var i = 0; elems[i]; i++){
                callback.call(root(elems[i], first),
                i > 0 ? fragment.cloneNode(true) : fragment);
            }
        }
    }
}

//Generating a list of DOM nodes from some markup
function getNodes(htmlString, doc, fragment){
    //Map of element types that need special parent containers. Each entry has the depth of the new node
    //opening HTML fo the parents, and closing FRML for the parents
    var map = {
        "<td":[3, "<table><tbody><tr>","</tr></tbody></table>"],
        "<th":[3, "<table><tbody><tr>","</tr></tbody></table>"],
        "<tr":[2, "<table><thead>","</thead></table>"],
        "<option":[1, "<select multiple='multiple'>","</select>"],
        "<optgroup":[1, "<select multiple='multiple'>","</select>"],
        "<legend":[1, "<fieldset'>","</fieldset>"],
        "<thead":[1, "<table>","</table>"],
        "<tbody":[1, "<table>","</table>"],
        "<tfoot":[1, "<table>","</table>"],
        "<colgroup":[1, "<table>","</table>"],
        "<caption":[1, "<table>","</table>"],
        "<col":[2, "<table'><tbody></tbody><colgroup>","</colgroup></table>"],
        "<link":[3, "<div></div><div>","</div>"]
    };

    //Uses a regex to match the openning bracket and tag name od the element to be isnered.
    var tagName = htmlString.match(/<\w+/),
    //If it's in the map, grab the entry, otherwise construct a faux entry with an empty parent
    mapEntry = tagName ? map[tagName[0]] : null;
    if(!mapEntry) mapEntry = [0, " ", " "];
    var div = (doc || document).createElement("div");
    //Create a <div> element in which  to create the new nodes. Nothe that we use a passed document if 
    //it exists or default to the current document if not
    //Wrap the incoming markup with the parents from the map entry, an inject it as the innerHTML of 
    //the newly created div                                                                                                                               
    div.innerHTML = mapEntry[1] + htmlString + mapEntry[2];
    //Walk down the just created tree to the depth indicated by the map entry. This should be the 
    //parent created of the desired node
    while(mapEntry[0]--) div = div.lastChild;
    if(fragment){
        while(div.firstChild){
            fragment.appendChild(div.firstChild);
        }
    }
    return div.childNodes;
}

function root(elem, cur){
    return elem.nodeName.toLowerCase() === "table" && cur.nodeName.toLowerCase() === "tr" ? 
    (elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody"))): elem;
}

//function that gets notes from local storage and restore them as objects
function restoreNotes(array){
    var array = JSON.parse(localStorage.getItem('notesArray'));
    for(var i = 0; i < array.length; i++){
        renderNote(array[i], array);
    }   
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
    console.log('On drop: ', document.getElementById(data));
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

    console.log(item);
}


window.onload = function(){
    if(localStorage.getItem('notesArray') != null){
        restoreNotes(notesArray);
    }
    var presenter = new Presenter();
}
