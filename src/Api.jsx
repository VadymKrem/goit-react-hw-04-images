import axios from 'axios';

const API_KEY = '37472485-f9bdad7e7011607296af4912b';

const BASE_URL = 'https://pixabay.com/api/';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }

  async fetchPost() {
    const OPTIONS = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 12,
    });

    try {
      const response = await axios.get(`${BASE_URL}?${OPTIONS.toString()}`);
      return response.data;
    } catch (error) {
      console.error(error.toJSON());
    }
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
