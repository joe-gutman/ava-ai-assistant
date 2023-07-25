const { Users } = require('../models/index.cjs');

module.exports = {
  getUser : (req, res) => {

  },
  postUser : (req, res) => {
    Users.createUser(req.body)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });

  },
};