const connectDB = require('../db/connection.cjs');

let usersCollection;
let tasksCollection;

var connectToCollections = async () => {
  if(usersCollection) {
    return;
  }
  try {
    const db = await connectDB();
    usersCollection = db.collection('users');
    tasksCollection = db.collection('tasks');
  }
  catch(err) {
    console.error(err);
  }
}

connectToCollections();

module.exports = {
  async createUser(user) {
    console.log(user);
    const newUser = {
      name: user.name,
      email: user.email,
      createdAt: new Date()
    }
    try {
      const result = await usersCollection.insertOne({...user});
      return result;
    } catch(err) {
      console.error(err);
    }
  }
}