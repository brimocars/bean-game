const { MongoClient } = require('mongodb');

class GameObjects {
  constructor() {
    this.dbName = 'gameObjects'; // also the collection name
    this.client = undefined;
  }

  async getClient() {
    if (!this.client) {
      const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
      const client = new MongoClient(mongodbUri);
      await client.connect();
      this.client = client;
    }
    return this.client;
  }

  async getCollection() {
    const client = await this.getClient();
    const db = client.db(this.dbName);
    return db.collection(this.dbName);
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
