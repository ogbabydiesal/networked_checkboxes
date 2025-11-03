'use strict';

const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
const fs = require('node:fs');

//populateDatabaseWithStartingArray(1000);

 var obj;
    fs.readFile('database.txt', 'utf8', function (err, data) {
      if (err) 
        throw err;
      //obj = JSON.parse(data);
      //console.log("current database read "+data);
  });
  

  



const app = module.exports.app = express();
const port = process.env.PORT || 3000;


require('dotenv').config();

const API_KEY = process.env.API_KEY;
const SHEET_ID = process.env.SHEET_ID;
const OAUTH = process.env.OAUTH;

app.post('/api/checkboxes', async (req, res) => {
 let params = {
           "range":"Sheet1!A3:A4",
           "majorDimension": "ROWS",
           "values": [
           ["Hello","World"]
          ],
     }
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OAUTH}` // OAuth token required for write access
  },
  body:(JSON.stringify(params))
});



const data = await response.json();
console.log("sent "+data);

}
);





app.get('/api/checkboxes', async (req, res) => {
  console.log("reading the get (/api/checkboxes) in the server");
  try {
    fs.readFile('database.txt', 'utf8', function (err, data) {
    if (err) 
      throw err;
    let statesArr = JSON.parse(data);
    res.json({ 'states': statesArr });
    //console.log("sent data "+data);
  });

  } catch (error) {
    //console.error('Error fetching sheet:', error);
    res.status(500).json({ error: error.message });
  }
});




app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});


app.post('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});


app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => {
  console.log("Listening on port: " + port);
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  console.log(socket.id);
  
  //receives the checkbox emitter from Client
  socket.on("checkedState", (arg) => {
    console.log("arg "+arg.id);
    updateCheckboxDatabase(arg.id, arg.checked);
    //change the google doc here
    
    //write to google doc with arg.id

    io.emit('fromServer', arg);
  });

 
  //receives the name emitter from Client
  socket.on("name", (arg) => {
    //console.log(arg);
    io.emit('response', arg);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});


function updateCheckboxDatabase(id, state) {
  //read the file
  let statesArr;
  fs.readFile('database.txt', 'utf8', function (err, data) {
    if (err) 
      throw err;
    
    statesArr = JSON.parse(data);
    statesArr['states'][id] = state;
    //console.log("11111 states array updated at "+ statesArr['states']);
    console.log("new state "+state);

    //write the file
    console.log("1");
    const content = {'states': statesArr['states']};
    console.log("2");
    const jsonString = JSON.stringify(content, null, 2);
    console.log("3");
    fs.writeFile('database.txt', jsonString, err => {
      console.log("4");
      if (err) {
        console.error(err);
      } else {
        // file written successfully
        console.log("wrote data ");
      }
    });

  });


  //console.log("22222 states array updated at "+ statesArr['states']);
  //write the file
  //statesArr = JSON.parse(statesArr);
 
}


function populateDatabaseWithStartingArray(numCheckboxes){
  const startingArray = new Array(numCheckboxes).fill(false);
  const content = {'states':startingArray};
  const jsonString = JSON.stringify(content, null, 2);
  fs.writeFile('database.txt', jsonString, err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });

}
