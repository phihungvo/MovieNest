import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const TOKEN = localStorage.getItem("token");

export const getAllMovies = async ({ page = 0, pageSize = 5 }) => {
    try {
        const response = await axios.get(`${API_URL}/movie/getAll`, {
            params: {
                page: page,
                pageSize: pageSize,
            },
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Token: ", TOKEN)
        return response.data;
    } catch (error) {
        console.error(
            'Error fetching movies:',
            error.response ? error.response.data : error.message,
        );
        throw error; // Ném lỗi để component có thể xử lý
    }
};

export const createMovie = async (formData) => {
    try {
        // Simplify date handling
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        // Correctly extract file URLs from Upload component
        const posterPath =
            formData.poster && formData.poster.length > 0
                ? formData.poster[0].name ||
                  formData.poster[0].response?.name ||
                  ''
                : '';

        const backdropPath =
            formData.backdrop && formData.backdrop.length > 0
                ? formData.backdrop[0].name ||
                  formData.backdrop[0].response?.name ||
                  ''
                : '';

        const response = await axios.post(
            `${API_URL}/movie/create`,
            {
                title: formData.title,
                overview: formData.overview,
                releaseDate: releaseDate,
                poster_path: posterPath,
                backdrop_path: backdropPath,
                vote_average: formData.voteAverage || 0,
                vote_count: formData.voteCount || 0,
                genre_ids: formData.category ? [formData.category] : [],
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Movie Created:', response.data);
        return response.data; // Trả về dữ liệu phim đã tạo
    } catch (error) {
        console.error(
            'Error creating movie:',
            error.response ? error.response.data : error,
        );
        throw error; // Ném lỗi để component có thể xử lý
    }
};
