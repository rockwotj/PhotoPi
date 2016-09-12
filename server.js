const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');

const config = require('./config.json');
const app = express();
app.use(express.static('public'));

const URL = config.url + '?pw=' + config.password;
let image = new Buffer(fs.readFileSync('public/default.jpg')); // default

// Prevent requesting extra photos
let isFetching = false;

const getNewPhoto = () => {
  if (isFetching) {
    return;
  }
  isFetching = true;
  console.log("Fetching new photo...");
  fetch(URL)
    .then(r => r.text())
    .then(b => {
      image = Buffer.from(b, 'base64');
      console.log("Photo fetched!");
      isFetching = false;
    })
    .catch(() => isFetching = false);
};

app.get('/photo', (req, res) => {
  res.append('Content-Type', 'image/jpeg');
  res.end(image);
  getNewPhoto();
});

app.listen(3000, 'localhost');

