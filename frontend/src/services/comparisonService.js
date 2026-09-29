import api from './api';

export const comparisonService = {
  async getSavedComparisons() {
    return api.get('/comparisons');
  },

  async saveComparison({ title, preference, notes, cafes }) {
    return api.post('/comparisons', { title, preference, notes, cafes });
  },

  async getById(id) {
    return api.get(`/comparisons/${id}`);
  },

  async deleteComparison(id) {
    return api.delete(`/comparisons/${id}`);
  }
};
