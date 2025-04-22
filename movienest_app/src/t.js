// Hàm chung để lấy phim và trailer của chúng
const getMoviesWithTrailers = async (endpoint) => {
    const TOKEN = getToken();
    
    try {
        // Lấy danh sách phim từ endpoint được truyền vào
        const moviesResponse = await axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        const movies = moviesResponse.data;
        console.log(`Movies from ${endpoint}: `, movies);

        // Lặp qua từng phim và lấy video trailer
        const moviesWithTrailers = await Promise.all(
            movies.slice(0, 20).map(async (movie) => {
                try {
                    const trailerResponse = await getTrailerByMovieId(movie.id);
                    
                    return {
                        ...movie,
                        trailer_key: trailerResponse.length > 0 ? trailerResponse[0].key : null,
                    };
                } catch (error) {
                    console.error(`Error fetching videos for movie ${movie.id}:`, error);
                    return {
                        ...movie,
                        trailer_key: null,
                        image_path: null,
                    };
                }
            }),
        );

        // Lọc ra những phim có trailer
        return moviesWithTrailers.filter((movie) => movie.trailer_key !== null);
    } catch (error) {
        console.error(`Error fetching movies from ${endpoint}:`, error);
        return [];
    }
};

// Lấy phim đang chiếu phổ biến (popular) và thông tin video trailers của các phim đó
export const getPopularMovieTrailers = async () => {
    return getMoviesWithTrailers(API_ENDPOINTS.MOVIES.POPULAR);
};

// Lấy phim đang chiếu trong rạp (in theaters) và thông tin video trailers của các phim đó
export const getInThreatersMovieTrailers = async () => {
    return getMoviesWithTrailers(API_ENDPOINTS.MOVIES.IN_THEATER);
};