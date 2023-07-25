const express = require('express');
const router = express.Router();
const controller = require('./controllers/index.cjs');

module.exports = () => {
  router.get('/', (req, res) => {
    res.status(200).send('Hello World');
  });

  router.post('/users', controller.Users.postUser);

  return router;
}