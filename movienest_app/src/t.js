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