import api from './api';

export const favoriteService = {
  async getFavorites() {
    return api.get('/favorites');
  },

  async addFavorite(cafe) {
    return api.post('/favorites', { cafe });
  },

  async removeFavorite(placeId) {
    return api.delete(`/favorites/${placeId}`);
  }
};
