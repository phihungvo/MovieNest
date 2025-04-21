import axios from 'axios';
import API_ENDPOINTS from '~/constants/endpoints';
import { getToken } from '~/constants/token';
import { getTrailerByMovieId } from '~/service/admin/trailer';

const API_KEY =
    process.env.REACT_APP_TMDB_API_KEY || 'aad34a977eb04581217d21401cd37a60';
const BASE_URL =
    process.env.REACT_APP_BASE_URL || 'https://api.themoviedb.org/3';

if (!BASE_URL) {
    console.error('⚠️ BASE_URL is undefined! Check your .env file.');
}

// Create axios instance with baseURL
const tmdbApi = axios.create({
    baseURL: BASE_URL,
});

// https://api.themoviedb.org/3/search/multi?query=b&page=500&api_key=aad34a977eb04581217d21401cd37a60
export const searchMovies = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/multi`, {
            params: {
                api_key: API_KEY,
                page: 1,
                query: query,
            },
        });
        console.error(
            'Fetching successfully search multi type... ',
            response.data.results,
        );
        return response.data.results;
    } catch (error) {
        console.error('Error fetching search multi type... ', error);
        return [];
    }
};

export const getMovieToday = async () => {
    const TOKEN = getToken();
    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.TODAY, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching movies today: ', error);
        return [];
    }
};

export const getMovieInWeek = async () => {
    const TOKEN = getToken();
    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.THIS_WEEK, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movies in this week: ', error);
        return [];
    }
};

export const getPopularMovie = async () => {
    const TOKEN = getToken();
    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.POPULAR, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching popular movies: ', error);
        return [];
    }
};

// Lấy phim đang chiếu phổ biến (popular) và thông tin video trailers của các phim đó
export const getPopularMovieTrailers = async () => {
    const TOKEN = getToken();
    console.log('TOKEN from localStorage (or cookie): ', TOKEN);

    try {
        // First get popular movies
        const moviesResponse = await axios.get(API_ENDPOINTS.MOVIES.POPULAR, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        const movies = moviesResponse.data;
        console.log('popular movie: ', movies);

        const moviesWithTrailers = await Promise.all(
            movies.slice(0, 20).map(async (movie) => {
                try {
                    const trailerResponse = await getTrailerByMovieId(movie.id);

                    console.log('Trailer response popular: ', trailerResponse);

                    return {
                        ...movie,
                        trailer_key:
                            trailerResponse.length > 0
                                ? trailerResponse[0].key
                                : null,
                    };
                } catch (error) {
                    console.error(
                        `Error fetching videos for movie ${movie.id}:`,
                        error,
                    );
                    return {
                        ...movie,
                        trailer_key: null,
                        image_path: null,
                    };
                }
            }),
        );

        return moviesWithTrailers.filter((movie) => movie.trailer_key !== null);
    } catch (error) {
        console.error('Error fetching popular movie trailers:', error);
        return [];
    }
};

// Lấy phim đang chiếu trong rạp (in theaters) và thông tin video trailers của các phim đó
export const getInThreatersMovieTrailers = async () => {
    const TOKEN = getToken();
    try {
        const moviesResponse = await axios.get(
            API_ENDPOINTS.MOVIES.IN_THEATER,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        const movies = moviesResponse.data;
        console.log('movie in theater: ', moviesResponse.data);

        // Lặp qua từng phim và lấy video trailer.
        const moviesWithTrailers = await Promise.all(
            movies.slice(0, 10).map(async (movie) => {
                try {
                    const trailerResponse = await getTrailerByMovieId(movie.id);

                    console.log(
                        'Trailer for in thearter movie: ||| >>>>: ',
                        trailerResponse,
                    );

                    // const imageOfMovie = await axios.get(
                    //     `${BASE_URL}/movie/${movie.id}/images`,
                    //     {
                    //         params: {
                    //             api_key: API_KEY,
                    //         },
                    //     },
                    // );

                    // const file_path = imageOfMovie.data.backdrops[0]
                    // const file_path =
                    //     imageOfMovie.data.backdrops &&
                    //     imageOfMovie.data.backdrops.length > 0
                    //         ? imageOfMovie.data.backdrops[0].file_path
                    //         : null;
                    // console.log('file path>>>>>: ', file_path.file_path)
                    // console.log('file path>>>>>: ', file_path);

                    // const trailers = videoResponse.data.results.filter(
                    //     (video) =>
                    //         video.type === 'Trailer' &&
                    //         video.site === 'YouTube',
                    // );

                    return {
                        ...movie,
                        trailer_key:
                            trailerResponse.length > 0
                                ? trailerResponse[0].key
                                : null,
                    };
                } catch (error) {
                    console.error(
                        `Error fetching videos for movie ${movie.id}:`,
                        error,
                    );
                    return {
                        ...movie,
                        trailer_key: null,
                        image_path: null,
                    };
                }
            }),
        );

        return moviesWithTrailers.filter((movie) => movie.trailer_key !== null);
    } catch (error) {
        console.error('Error fetching in theaters movie trailers:', error);
        return [];
    }
};

// https://api.themoviedb.org/3/movie/99861?api_key=aad34a977eb04581217d21401cd37a60
export const getDetailtMovie = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: API_KEY,
            },
        });

        // console.log('Reponse detail movie: ', response.data.results);
    } catch (error) {
        console.log('Get Detail Movie with error: ', error);
        return [];
    }
};
