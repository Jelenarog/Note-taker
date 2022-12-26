const express = require('express');
const path = require('path');
const fs = require('fs');
// import database
const noteData = require('./db/db.json');

//require uniq ID helper 
const generateId = require('generate-unique-id');

const PORT = 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true}));


//to access static files
app.use(express.static('public'));
//Get /notes should return note.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname,'public/notes.html'))
);
//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) =>{
 return res.json(noteData);
}
);
//TO DO:POST /api/notes should receive a new note to save os the request body, add it to the db.json file, 
//and then return the new note to the client. 
app.post('/api/notes', (req, res) => {
    const{title, text, id} = req.body;
if (text && title && id){
    const newNote ={
        text,
        title,
        id: generateId(),
    };

       // Convert the data to a string so we can save it
    const noteString = JSON.stringify(newNote);
   
    fs.readFile(`./db/db.json`, 'utf8', (err,data) => {
      if (err){
           console.error(err);
        }
     else {
        //we need to store data that we have that is why we will create var activeNotes
         const activeNotes = JSON.parse(data);
         activeNotes.push(newNote)
         //after we added new notes to active notes 
         // Write the string to a file..we are doing json stringify to convert array to string
         fs.writeFile(`./db/db.json`,JSON.stringify(activeNotes), (err)=>
         err ? console.log (err): console.log(`new note ${newNote.title} has been added`)
         );
     }
    })

    const response = {
        status: 'success',
        body: newNote,
      };
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }

});
//Get * should return index.html file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname,'public/index.html'))
);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
