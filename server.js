const express = require('express');
const Authorization = require('./authorization');
var authorizationService = new Authorization();
var mongoHelperMethods = require('./Mongo');
var mongoService = new mongoHelperMethods();
require('dotenv').config();
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

app.post('/api/refreshAuthorization',  async function(req, res){
  let code = req.body.code;
  var {_id, accessToken, refreshToken} = await mongoService.findUserByAccessToken(code);
  const newAccessTokenForUser = await authorizationService.getNewAccessTokenForUser(accessToken,refreshToken);
  const updatedUser = await mongoService.updateAccessTokenForUser(_id, newAccessTokenForUser);
  res.send(updatedUser);
});


console.log('Running application on port 4000');
app.listen(4000);
