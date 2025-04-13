const BASE_URL = process.env.REACT_APP_API_URL;

const API_ENDPOINTS = {
  MOVIES: {
    GET_ALL: `${BASE_URL}/movie/getAll`, // With pagination
    GET_ALL_NO_PAGING: `${BASE_URL}/movie/findAllNoPaging`,
    GET_BY_ID: (id) => `${BASE_URL}/movie/${id}`,
    CREATE: `${BASE_URL}/movie/create`,
    UPDATE: (id) => `${BASE_URL}/movie/update/${id}`,
    DELETE: (id) => `${BASE_URL}/movie/delete?movieId=${id}`,
    SEARCH: (keyWord) => `${BASE_URL}/movie/search?keyWord=${encodeURIComponent(keyWord)}`,
  },

  GENRES: {
    GET_ALL: `${BASE_URL}/genres`,
    CREATE: `${BASE_URL}/genres`,
    DELETE: (id) => `${BASE_URL}/genres/${id}`,
  },
};

export default API_ENDPOINTS;
