const express = require('express');
const router = express.Router();
const controller = require('./controllers/index.cjs');

module.exports = () => {
  router.get('/', (req, res) => {
    res.send('Hello World!');
  });
  // routers for handling user getting, posting
  router.get('/login/', controller.Users.getUser);
  router.post('/register/', controller.Users.postUser);

  router.get('/list/', controller.Lists.getList);
  router.post('/list/', controller.Lists.postList);
  router.post('/list/listitem/', controller.Lists.postListItem);
  router.delete('/list/', controller.Lists.deleteList);
  router.delete('/list/listitem/', controller.Lists.deleteListItem);
  router.put('/list/listItem', controller.Lists.updateListItem);

  // router.delete('/listItems/', controller.ListItems.deleteListItem);


  return router;
}