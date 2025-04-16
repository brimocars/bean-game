const { MongoClient } = require('mongodb');

class GameObjects {
  constructor() {
    this.dbName = 'beans';
    this.collectionName = 'gameObjects';
    this.client = undefined;
  }

  async getClient() {
    if (!this.client) {
      const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
      const client = new MongoClient(mongodbUri);
      await client.connect();
      this.client = client;

      // games that haven't been updated in 24 hours delete themselves. This is fine to do every startup - attempting
      // to create an index that already exists does nothing
      const db = client.db(this.dbName);
      db.collection(this.collectionName).createIndex({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

      // index to speed up reads
      db.collection(this.collectionName).createIndex({ gameId: 1 }, { unique: true });
    }
    return this.client;
  }

  async getCollection() {
    const client = await this.getClient();
    const db = client.db(this.dbName);
    return db.collection(this.collectionName);
  }

  async get(gameId) {
    try {
      const collection = await this.getCollection();
      const gameObject = await collection.findOne({ gameId });
      return gameObject;
    } catch (error) {
      console.log('DB get error:', error);
      return undefined;
    }
  }

  async getAll() {
    try {
      const collection = await this.getCollection();
      const gameObjects = await collection.find({}).toArray();
      return gameObjects;
    } catch (error) {
      console.log('DB getAll error:', error);
      return undefined;
    }
  }

  async findByGameCode(gameCode) {
    try {
      const collection = await this.getCollection();
      const gameObject = await collection.findOne({ gameCode });
      return gameObject;
    } catch (error) {
      console.log('DB findByGameCode error:', error);
      return undefined;
    }
  }

  async insert(gameObject) {
    gameObject.updatedAt = new Date();
    try {
      const collection = await this.getCollection();
      await collection.updateOne(
        {
          gameId: gameObject.gameId,
        },
        {
          $set: gameObject,
        },
        {
          upsert: true,
        },
      );
    } catch (error) {
      console.log('DB insert error:', error);
    }
  }

  async delete(gameId) {
    try {
      const collection = await this.getCollection();
      await collection.deleteOne({ gameId });
    } catch (error) {
      console.log('DB delete error:', error);
    }
  }
}

module.exports = new GameObjects();
