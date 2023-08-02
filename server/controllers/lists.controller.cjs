const { Lists } = require('../models/index.cjs');

module.exports = {
  getList: (req, res) => {
    const { user_id } = req.query;
    const { list_name } = req.query;
    console.log("User ID:", user_id);
    console.log("List name:", list_name);
    if (list_name === undefined) {
      console.log("Controller Getting all lists for user:", user_id)
      Lists.getList(user_id)
        .then((lists) => {
          res.status(200).send(lists);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } else {
      console.log("Getting list:", list_name, "for user:", user_id)
      Lists.getList({user_id, list_name})
        .then((list) => {
          res.status(200).send(list);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  },

  postList : (req, res) => {
    console.log("List to create:", req.body)
    Lists.createList(req.body)
      .then((list) => {
        res.status(200).send(list);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },

  deleteList : (req, res) => {
    console.log("List to delete:", req.body)
    const { user_id } = req.query;
    const { list_name } = req.query;
    console.log("User ID:", user_id);
    console.log("List name:", list_name);
    Lists.deleteList({user_id, list_name})
      .then((list) => {
        res.status(200).send(list);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },

  updateListItem : (req, res) => {
    console.log("List to update:", req.body)
    Lists.updateListItem(req.body)
      .then((list) => {
        res.status(200).send(list);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },

  postListItem : (req, res) => {
    console.log("List to update:", req.body)
    Lists.postListItem(req.body)
      .then((list) => {
        res.status(200).send(list);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
    },

  deleteListItem : (req, res) => {
    console.log("List to delete:", req.body)
    const { user_id } = req.query;
    const { list_name } = req.query;
    const { list_item } = req.query;
    console.log("User ID:", user_id);
    console.log("List name:", list_name);
    Lists.deleteListItem({user_id, list_name, list_item})
      .then((list) => {
        res.status(200).send(list);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

}