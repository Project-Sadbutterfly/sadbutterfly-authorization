var SpotifyWebApiWrapper = require('spotify-web-api-node');
require('dotenv').config();
var mongoHelperMethods = require('./Mongo');
var mongoService = new mongoHelperMethods();
module.exports = class Authorization {

  constructor() {
    this.spotifyApi = new SpotifyWebApiWrapper({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    });
  }

  /**
   * @description Get user credentials with authorization code.
   * @name getUserCredentials
   * @function
   * @param {string} authorizationCode used to retrieve authorizationcodes.
   */
   getUserCredentials(authorizationCode) {
    console.log('Authorization call', authorizationCode);
    this.spotifyApi.authorizationCodeGrant(authorizationCode).then(
        function (data) {

          const access_token = data.body['access_token'];
          const refresh_token = data.body['refresh_token'];
          mongoService.saveUserCredentials(access_token,refresh_token,process.env.MONGODB_DATABASE_NAME,process.env.MONGODB_AUTHORIZATION_COLLECTION_NAME)
        }).catch(error => {
          console.log('Authorization error: ', error);
    });
  }
};
