'use strict';

const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
const app = module.exports.app = express();
const port = process.env.PORT || 3000;


require('dotenv').config();

const API_KEY = process.env.API_KEY;
const SHEET_ID = process.env.SHEET_ID;

app.get('/api/checkboxes', async (req, res) => {
    
  try {
    // Fetch all data from row 2 to the last row dynamically
    const range = `Sheet1!A1:F5`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    //const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?ranges=Sheet1!A1:F5&fields=sheets/data/rowData/values/userEnteredValue&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Sheet API Error:', data.error);
      return res.status(400).json({ error: data.error.message });
    }

    const rows = data.values || [];
    const numRows = 5;  // Your desired row count
    const numCols = 6;  // Your desired column count (A-F)

    // Fill in empty cells
    const filledRows = [];
    for (let i = 0; i < numRows; i++) {
      const row = rows[i] || [];
      const filledRow = [];
      for (let j = 0; j < numCols; j++) {
        filledRow.push(row[j] || '');
      }
      filledRows.push(filledRow);
    }
    
    res.json({ data: filledRows });
  } catch (error) {
    //console.error('Error fetching sheet:', error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/', function(req, res) {
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
    console.log(arg); 
    io.emit('broadcastState', arg);
  });

 
  //receives the name emitter from Client
  socket.on("name", (arg) => {
    //console.log(arg);
    io.emit('response', arg);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

