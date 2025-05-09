const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login`,
        REGISTER: `${BASE_URL}/auth/register`,
    },
    FILE: {
        UPLOAD: `${BASE_URL}/storage/upload`,
        CHECK_EXISTED: (file) =>
            `${BASE_URL}/storage/checkFileExists/${file.name}`,
        GET_INFO: `${BASE_URL}/storage/files`,
        GET_FILE: (filePath) => `${BASE_URL}/storage/files/${filePath}`,
    },

    USER: {
        GET_ALL: `${BASE_URL}/user/getAll`,
        CREATE: `${BASE_URL}/user/createUser`,
        UPDATE: (userId) => `${BASE_URL}/user/${userId}/update`,
        COLLECT_MOVIE: (userId, movieId) => `${BASE_URL}/user/${userId}/collect/${movieId}`,
        UN_COLLECTED_MOVIE: (userId, movieId) => `${BASE_URL}/user/${userId}/unCollect/${movieId}`,
        GET_COLLECTION_MOVIE: (userId) => `${BASE_URL}/user/${userId}/collections`,
    },
    MOVIES: {
        GET_ALL: `${BASE_URL}/movie/getAll`,
        GET_ALL_NO_PAGING: `${BASE_URL}/movie/findAllNoPaging`,
        GET_BY_ID: (id) => `${BASE_URL}/movie/${id}`,
        CREATE: `${BASE_URL}/movie/create`,
        UPDATE: (movieId) => `${BASE_URL}/movie/update/${movieId}`,
        DELETE: (id) => `${BASE_URL}/movie/delete?movieId=${id}`,
        SEARCH: (keyWord) =>
            `${BASE_URL}/movie/search?keyWord=${encodeURIComponent(keyWord)}`,
        TODAY: `${BASE_URL}/movie/today`,
        THIS_WEEK: `${BASE_URL}/movie/this-week`,
        POPULAR: `${BASE_URL}/movie/popular`,
        IN_THEATER: `${BASE_URL}/movie/in-theater`,
        KOREAN_MOVIES: `${BASE_URL}/movie/korean-movie`,
        VIETNAME_MOVIES: `${BASE_URL}/movie/vietnamese-movie`,
        THAILAND_MOVIES: `${BASE_URL}/movie/thailand-movie`,
    },

    TRAILER: {
        GET_ALL: `${BASE_URL}/trailers/getAll`,
        GET_ALL_NO_PAGING: `${BASE_URL}/trailers/getAllNoPaging`,
        GET_BY_ID: (trailerId) => `${BASE_URL}/trailers/${trailerId}`,
        CREATE: `${BASE_URL}/trailers/create`,
        UPDATE: (trailerId) => `${BASE_URL}/trailers/${trailerId}`,
        DELETE: (trailerId) => `${BASE_URL}/trailers/${trailerId}`,
        GET_TRAILER_BY_MOVIE_ID: (movieId) =>
            `${BASE_URL}/trailers/movie/${movieId}`,
        WITHOUT_MOVIE: `${BASE_URL}/trailers/without-movie`,
    },

    GENRES: {
        GET_ALL: `${BASE_URL}/genres/getAll`,
        CREATE: `${BASE_URL}/genres`,
        DELETE: (genresId) => `${BASE_URL}/genres/${genresId}`,
    },

    ACTOR: {
        GET_ALL: `${BASE_URL}/actor/getAllPagable`,
        GET_ALL_NO_PAGING: `${BASE_URL}/actor/findAll`,
        CREATE: `${BASE_URL}/actor/create`,
        UPDATE: (actorId) => `${BASE_URL}/actor/update/${actorId}`,
        DELETE: (actorId) => `${BASE_URL}/actor/delete/${actorId}`,
    },

    COMMENTS: {
        GET_ALL_COMMENT: `${BASE_URL}/comment/getAll`,
        GET_COMMENT_BY_MOVIE_ID: (movieId) =>
            `${BASE_URL}/comment/movie/${movieId}`,
        CREATE: `${BASE_URL}/comment/create`,
        UPDATE_PUT: (id) => `${BASE_URL}/comment/${id}`,
        UPDATE_FOR_USER: (id) => `${BASE_URL}/comment/${id}`,
        DELETE: (commentId) => `${BASE_URL}/comment/${commentId}`,
        REPLY_TO_A_COMMENT: (commentId) =>
            `${BASE_URL}/comment/${commentId}/reply`,
        REACTION_TO_A_COMMENT: (commentId) =>
            `${BASE_URL}/comment/${commentId}/reaction`,
    },
    BANNER: {
        CREATE: `${BASE_URL}/banner/create`,
        GET_ALL_NO_PAGING: `${BASE_URL}/banner`,
        GET_ALL: `${BASE_URL}/banner/getAll`,
        UPDATE: (bannerId) => `${BASE_URL}/banner/update/${bannerId}`,
        DELETE: (bannerId) => `${BASE_URL}/banner/${bannerId}`,
    },
};

export default API_ENDPOINTS;
