const notes = require('express').Router();
const noteData = require('../db/db.json');
const fs = require('fs');
//require uniq ID helper 
const generateId = require('../node_modules/generate-unique-id');
//GET /api/notes should read the db.json file and return all saved notes as JSON.
notes.get('/', (req, res) =>{
    return res.json(noteData);
   }
   );
   //TO DO:POST /api/notes should receive a new note to save os the request body, add it to the db.json file, 
   //and then return the new note to the client. 
   notes.post('/', (req, res) => {
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
   module.exports = notes;