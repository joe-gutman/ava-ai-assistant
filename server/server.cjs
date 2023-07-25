const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const routes = require('./routes.cjs');
const connectToDB = require('./db/connection.cjs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connectDB = async () => {
  try {
    const db = await connectToDB();

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

connectDB();