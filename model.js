function Note(text){
    console.log("Crando Nota");
    var notesArray = [];
    var d = new Date();
    var currentDate = getCurrentDate(d);

    this.text = text;
    this.date = currentDate;
    this.id = (new Date()).getTime();
    if(localStorage.getItem('notesArray') != null){
        notesArray = JSON.parse(localStorage.getItem('notesArray'));
        notesArray.push({id: this.id, text: this.text, date: this.date});
    }else{
        notesArray.push({id: this.id, text: this.text, date: this.date});
    }
    localStorage.setItem('notesArray', JSON.stringify(notesArray));
    console.log("The local storage at this point is: ", localStorage);
    
}

//Function that returns the date in format: DD/MM/YY at HH:MM
function getCurrentDate( date ){
    return datetime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + ' at ' + date.getHours() + ':' + date.getMinutes();
}