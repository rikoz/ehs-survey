const express = require('express');
const path = require('path');
const ejs = require('ejs');
// const open = require('open');

const app = express();
const port = process.env.PORT || 3000
// var router = express.Router()

app.engine('html', ejs.renderFile)

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/:surveyId/:userId', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.use(express.static(path.join(__dirname, '/assets')))

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port ${port}!`)
    // open(`http://localhost:${port}`);
  }
})
