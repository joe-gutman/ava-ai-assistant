const { connectDB } = require('../db/connection.cjs');

let usersCollection;

var connectToCollections = async () => {
  if(usersCollection) {
    return;
  }
  try {
    const db = await connectDB();
    usersCollection = db.collection('users');
  }
  catch(err) {
    console.error(err);
  }
}

connectToCollections();

module.exports = {
  async createUser(user) {
    const newUser = {
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      email: user.email,
      openai_key: 0,
      createdAt: new Date(),
      address: user.address,
      city: user.city,
      state: user.state,
      zipcode: user.zipcode
    };

    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
        throw new Error('User with the same email already exists');
    }
    const result = await usersCollection.insertOne({ ...newUser });
    if (result.insertedCount === 1) {
        const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
        return insertedUser;
    } else {
        throw new Error('Failed to create user');
    }
  },

  async getUser(user_id) {
    try {
      const user = await usersCollection.findOne({"user_id": user_id});
      return user;
    } catch(err) {
      console.error(err);
    }
  }
}