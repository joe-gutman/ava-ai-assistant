require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const PORT = process.env.PORT;
const routes = require('./routes.cjs');
const { connectDB } = require('./db/connection.cjs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var startServer = async () => {
  try {
    const db = await connectDB();

    if(db) {
      console.log('Connected to MongoDB at:', db.databaseName);
      app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`);
      });

      const routes = require('./routes.cjs');
      app.use('/', routes());
    }

  } catch (err) {
    console.error(err);
  }
};

startServer();