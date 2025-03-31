import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getAllMovies = async ({ page = 0, pageSize = 5 }) => {
    const TOKEN = localStorage.getItem('token');

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
    const TOKEN = localStorage.getItem('token');

    console.log('form data: ', formData);

    try {
        // Simplify date handling
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        console.log('Release date: ', releaseDate);

        const response = await axios.post(
            `${API_URL}/movie/create`,
            {
                title: formData.title,
                overview: formData.overview,
                releaseDate: releaseDate,
                posterPath: formData.posterPath,
                backdropPath: formData.backdropPath,
                vote_average: formData.voteAverage || 0,
                vote_count: formData.voteCount || 0,
                genres: formData.genres ? [formData.genres] : [],
                trailers: formData.trailers ? [formData.trailers] : [],
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
