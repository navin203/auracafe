import api from './api';

export const historyService = {
  async getHistory(limit = 20) {
    return api.get(`/search-history?limit=${limit}`);
  },

  async addHistory(item) {
    return api.post('/search-history', item);
  },

  async deleteItem(id) {
    return api.delete(`/search-history/${id}`);
  },

  async clearHistory() {
    return api.delete('/search-history');
  }
};
