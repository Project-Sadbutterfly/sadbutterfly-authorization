var mongo = require('mongodb');
require('dotenv').config();

module.exports = class MongoService {


  constructor() {
    this.databaseName = process.env.MONGODB_DATABASE_NAME;
    this.collectionName = process.env.MONGODB_AUTHORIZATION_COLLECTION_NAME;

    this.mongoClient = mongo.MongoClient;
    this.url = process.env.MONGODB_URL;
    this.createDatabase(this.databaseName).then(() => {
      this.createCollection(this.databaseName, this.collectionName).then(() => {
        console.log('Database and Collection created if they do not exist.');
      }).catch((error) => {
        console.error('Error creating collection.',error);
      })
    }).catch((error) => {console.error('error creating database',error)});
  }

  /**
   * @description Create database for project
   * @name createDatabase
   * @function
   * @param {string} databaseName Name of the database to be created
   */
  async createDatabase(databaseName) {
    await this.mongoClient.connect(`${this.url}/${databaseName}`, {useNewUrlParser: true});
  }

  /**
   * @description Create collection in mongoDB
   * @name createCollection
   * @function
   * @param {string} database Name of the database to connect to.
   * @param {string} collectionName Name of the collection to be created
   */
  async createCollection( database, collectionName) {
    let client = await this.mongoClient.connect(this.url, {useNewUrlParser: true});
    let db = client.db(this.databaseName);
    return await db.createCollection(collectionName);
  }


  /**
   * @description save user credentials in mongo.
   * @name saveUserCredentials
   * @function
   * @param {string} accessToken Access token of the logged in user, used to make calls against the spotify api.
   * @param {string} refreshToken refresh token of the logged in user, used to retrieve a new accessToken
   */
  async saveUserCredentials(accessToken, refreshToken) {
    let client = await this.mongoClient.connect(this.url, {useNewUrlParser: true});
    let db = client.db(this.databaseName);
    const user = { accessToken, refreshToken };

    try {
      return await db.collection(this.collectionName).insertOne(user);
    }
    finally {
      await client.close();
    }
  }

  /**
   * @description Find an user based on its accessToken
   * @name findUserByAccessToken
   * @function
   * @param {string} accessTokenFromUser Accesstoken from the user.
   */

   async findUserByAccessToken(accessTokenFromUser) {
     let client = await this.mongoClient.connect(this.url, {useNewUrlParser: true});
     let db = client.db(this.databaseName);
     var query = {accessToken: accessTokenFromUser};
     
     try {
       return await db.collection(this.collectionName).findOne(query);
     }
     finally {
       await client.close();
     }
  };


  /**
   * @description Update the access token of the user to a new one.
   * @name updateAccessTokenForUser
   * @function
   * @param {string} database name of the database to connect to.
   * @param {string} collection Name of the collection to search in.
   * @param {string} userId id from the user.
   * @param {string} newAccessToken new accesstoken for the user.
   */
  async updateAccessTokenForUser(userId, newAccessToken) {
    let client = await this.mongoClient.connect(this.url, {useNewUrlParser: true});
    let db = client.db(this.databaseName);
    const userIdQuery = { _id: userId };
    const newAccessTokenForUserWithUserId = { $set: {accessToken: newAccessToken } };

    try {
      return await db.collection(this.collectionName).updateOne(userIdQuery, newAccessTokenForUserWithUserId);
    }
    finally {
     await client.close();
    }
  }

};
