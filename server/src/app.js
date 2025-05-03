require('dotenv').config();
const express = require('express');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redis = require('redis');
const { Server } = require('socket.io');
const http = require('http');
const { setupSocket } = require('./lib/utils/socket');

const routes = require('./routes');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/beans';
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const redisClient = redis.createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-16730.c1.us-central1-2.gce.redns.redis-cloud.com',
    port: 16730,
  },
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().then(() => {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(session({
    key: 'sessionid',
    store: new RedisStore({ client: redisClient }),
    secret: 'beans',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(routes);
  app.use(favicon(`${__dirname}/../img/favicon.jpg`));

  const server = http.createServer(app);
  const io = new Server(server);
  setupSocket(io);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
