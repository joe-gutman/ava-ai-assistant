const { connectDB } = require('../db/connection.cjs');

let listsCollection;

var connectToCollections = async () => {
  if(listsCollection) {
    return;
  }
  try {
    const db = await connectDB();
    listsCollection = db.collection('lists');
  }
  catch(err) {
    console.error(err);
  }
}

connectToCollections();

module.exports = {
  async createList(listData) {
    if (listData.list_name !== undefined || listData.list_name !== '') {

      const newList = {
        user_id: listData.user_id,
        list_name: listData.list_name.toLowerCase(),
        list_items: [],
        createdAt: new Date(),
      };

      console.log("New list:", newList);

      const existingList = await listsCollection.findOne({ user_id: listData.user_id, list_name: listData.list_name.toLowerCase() });

      if (existingList) {
        return existingList;
      }

      const result = await listsCollection.insertOne({ ...newList });
      console.log("Result:", result);
      if (result.acknowledged === true && result.insertedId) {
        const newList = await listsCollection.findOne({ _id: result.insertedId });
        console.log("Inserted list:", newList);
        return newList;
      } else {
        throw new Error('Failed to create list');
      }
    } else {
      throw new Error('List name is required');
    }
  },

  async deleteList(listData) {
    try {
      const result = await listsCollection.deleteOne({ user_id: listData.user_id, list_name: listData.list_name.toLowerCase() });
      console.log("Delete result:", result);
      if (result.deletedCount === 1) {
        return result;
      } else {
        throw new Error('Failed to delete list');
      }
    } catch (error) {
      console.error('Failed to delete list:', error);
      throw error;
    }
  },

  async getList(listData) {
    console.log("INITIAL List data:", listData);
    try {
      if (listData.list_name === undefined || listData.list_name === null) {
        // Fetch all lists for the given user
        console.log("Fetching all lists for user:", listData);
        const lists = await listsCollection.find({ user_id: listData }).toArray();
        console.log("Lists:", lists);
        return lists;
      } else {
        // Fetch the specific list with the provided name
        const list = await listsCollection.findOne({ user_id: listData.user_id, list_name: listData.list_name.toLowerCase() });
        return list;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async postListItem(listData) {
    try {
      const result = await listsCollection.updateOne(
        { user_id: listData.user_id, list_name: listData.list_name.toLowerCase() },{ $addToSet: { list_items: { list_item: listData.list_item, complete: false }, },
        }
      );

      if (result.modifiedCount === 1) {
        const updatedList = await listsCollection.findOne({ user_id: listData.user_id, list_name: listData.list_name.toLowerCase() });
        return updatedList;
      } else {
        throw new Error('Failed to update list');
      }
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  },

  async deleteListItem(listData) {
    console.log("deleting:", listData);
    try {

      const result = await listsCollection.updateOne(
        {
          user_id: listData.user_id,
          list_name: listData.list_name.toLowerCase(),
          "list_items.list_item": listData.list_item,
        },
        { $pull: { list_items: { list_item: listData.list_item } } }
      );

      if (result.modifiedCount === 1) {
        const updatedList = await listsCollection.findOne({ user_id: listData.user_id, list_name: listData.list_name.toLowerCase() });
        return updatedList;
      } else {
        throw new Error('Failed to update list');
      }
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  },


  async updateListItem(listData) {
    try {
      const result = await listsCollection.updateOne({ user_id: listData.user_id, list_name: listData.list_name.toLowerCase(), "list_items.list_item": listData.list_item }, { $set: { "list_items.$.complete": listData.complete } });


      if (result.matchedCount === 1 && result.modifiedCount === 1) {
        // The update was successful
        const updatedList = await listsCollection.findOne({
          user_id: listData.user_id,
          list_name: listData.list_name.toLowerCase()
        });
        return updatedList;
      } else {
        throw new Error('Failed to update list');
      }
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  }
}
