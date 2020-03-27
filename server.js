const express = require('express');
const Authorization = require('./authorization');
var authorizationService = new Authorization();
var cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());


app.post('/api/authorization', function (req, res) {
  console.log(authorizationService);
  let code = req.body.code;
  authorizationService.getUserCredentials(code);
  res.send({message: 'ok'})
});



console.log('Running application on port 4000');
app.listen(4000);
