const notes = require("express").Router();
const noteData = require("../db/db.json");
const fs = require("fs");
//require uniq ID helper
const generateId = require("generate-unique-id");
//GET /notes should read the db.json file and return all saved notes as JSON.
notes.get("/notes", (req, res) => {
  fs.readFile(`./db/db.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      //we need to store data that we have that is why we will create var activeNotes parse string into object
      const activeNotes = JSON.parse(data);
      return res.json(activeNotes);
    }
  });
});
// post notes should receive a new note to save as the request body, add it to the db.json file,
//and then return the new note to the client.
notes.post("/notes", (req, res) => {
  let { title, text } = req.body;
  if (text && title) {
    const newNote = {
      text,
      title,
      id: generateId(),
    };

    fs.readFile(`./db/db.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        //we need to store data that we have that is why we will create var activeNotes
        const activeNotes = JSON.parse(data);

        activeNotes.push(newNote);
        //after we added new notes to active notes
        // Write the string to a file..we are doing json stringify to convert array to string
        fs.writeFile(`./db/db.json`,JSON.stringify(activeNotes, null, 2),(err) =>
            err ? console.log(err): console.log(`new note ${newNote.title} has been added`)
            );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});


 //delete notes 
notes.delete("/notes/:id", (req, res) => {
  fs.readFile(`./db/db.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } 
    else {
      
      const activeNotes = JSON.parse(data);
      const deleteId = req.params.id;

      for (let i = 0; i < noteData.length; i++) {
        const deleteNote = noteData[i].id;
        //if selected node ID is matching the ID in active notes, delete that note
        if (deleteId === deleteNote) {
          activeNotes.splice([i], 1);
          //write new file  without deleted note
          fs.writeFile(
            `./db/db.json`,
            JSON.stringify(activeNotes, null, 2),
            (err) =>
              err
                ? console.log(err)
                : console.log(`Note ${noteData[i].title} has been deleted`)
          );
        }
      }

      return res.json(activeNotes);
    }
  });
});

module.exports = notes;
