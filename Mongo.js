var mongo = require('mongodb');
require('dotenv').config();

module.exports = class MongoService {


  constructor() {
    this.databaseName = process.env.MONGODB_DATABASE_NAME;
    this.collectionName = process.env.MONGODB_AUTHORIZATION_COLLECTION_NAME;

    this.mongoClient = mongo.MongoClient;
    this.url = process.env.MONGODB_URL;
    this.createDatabase(this.mongoClient,this.databaseName);
    this.createCollection(this.mongoClient, this.databaseName, this.collectionName);
  }

  /**
   * @description Create database for project
   * @name createDatabase
   * @function
   * @param {mongo.MongoClient}  mongoClient MongoDb instance
   * @param {string} databaseName Name of the database to be created
   */
  createDatabase(mongoClient, databaseName) {
    this.mongoClient.connect(`${this.url}/${databaseName}`, function(err, db) {
      if (err) throw err;
      console.log("Database created!");
      db.close();
    });
  }

  /**
   * @description Create collection in mongoDB
   * @name createCollection
   * @function
   * @param {mongo.MongoClient} mongoInstance mongoClient instance
   * @param {string} database Name of the database to connect to.
   * @param {string} collectionName Name of the collection to be created
   */
  createCollection(mongoInstance, database, collectionName) {
    this.mongoClient.connect(this.url, function(err, db) {
      if (err) throw err;
      var databaseInstance = db.db(database);
      databaseInstance.createCollection(collectionName, function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
      });
    });
  }


  /**
   * @description save user credentials in mongo.
   * @name saveUserCredentials
   * @function
   * @param {string} accessToken Access token of the logged in user, used to make calls against the spotify api.
   * @param {string} refreshToken refresh token of the logged in user, used to retrieve a new accessToken
   * @param {string} databaseName Name of the database to connect to.
   * @param {string} collectionName Name of the collection to be used
   */
  saveUserCredentials(accessToken, refreshToken,databaseName, collectionName) {
    this.mongoClient.connect(`${this.url}`, function(err,db) {
      if (err) throw err;
      var dbo = db.db(databaseName);
      var user = { accessToken, refreshToken };
      dbo.collection(collectionName).insertOne(user, function(err, res) {
        if (err) throw err;
        db.close();
      });
    });
  }
};
