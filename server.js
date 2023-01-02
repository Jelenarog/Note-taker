const express = require('express');
const path = require('path');
//const fs = require('fs');
const api = require('./routes/notes');

const PORT = 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use('/api', api);

//to access static files
app.use(express.static('public'));
//Get /notes should return note.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname,'public/notes.html'))
);

//Get * should return index.html file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname,'public/index.html'))
);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
