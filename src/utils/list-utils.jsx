import axios from 'axios';

const baseUrl = 'http://localhost:3000'; // Replace this with your actual API URL

const api = {
  async createList(user_id, list_name) {
    try {
      const response = await axios.post(`${baseUrl}/list`, { user_id, list_name });
      return response.data;
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  },

  async deleteList(user_id, list_name) {
    console.log('deleting list (list-utils):', user_id, list_name);
    try {
      const response = await axios.delete(`${baseUrl}/list?user_id=${user_id}&list_name=${list_name}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting list:', error);
      throw error;
    }
  },

  async getList(user, list_name) {
    if (!list_name) {
      try {
        console.log(`${baseUrl}/list?user_id=${user}&list_name=${list_name}`)
        const response = await axios.get(`${baseUrl}/list?user_id=${user}`);
        return response.data;
      }
      catch (error) {
        console.error('Error getting list:', error);
        throw error;
      }
    } else {
      try {
        console.log(`${baseUrl}/list?user_id=${user}&list_name=${list_name}`)
        const response = await axios.get(`${baseUrl}/list?user_id=${user}&list_name=${list_name}`);
        return response.data;
      } catch (error) {
        console.error('Error getting list:', error);
        throw error;
      }
    }
  },

  async addListItem(user_id, list_name, list_item) {
    try {
      const response = await axios.post(`${baseUrl}/list/listitem/`, { user_id, list_name, list_item });
      return response.data;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  async deleteListItem(user_id, list_name, list_item) {
    try {
      const response = await axios.delete(`${baseUrl}/list/listitem?user_id=${user_id}&list_name=${list_name}&list_item=${list_item}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  async updateListItem(user_id, list_name, list_item, complete) {
    try {
      const response = await axios.put(`${baseUrl}/list/listitem/`, { user_id, list_name, list_item, complete });
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }
};

export default api;