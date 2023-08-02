const { Users } = require('../models/index.cjs');

module.exports = {
  getUser : (req, res) => {
    console.log(req.params.user_id);
    Users.getUser(req.params.user_id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  postUser : (req, res) => {
    console.log("User to create:", req.body)
    Users.createUser(req.body)
      .then((user) => {
        console.log("Inserted user:", user);
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });

  },
};