import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const TOKEN = process.env.REACT_APP_TOKEN;

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
        // Chuyển đổi ngày tháng
        const releaseDate = formData.releaseDate
            ? formData.releaseDate.isValid
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate
            : null;

        const response = await axios.post(
            `${API_URL}/movie/create`,
            {
                title: formData.title,
                overview: formData.overview,
                releaseDate: releaseDate,
                poster_path: formData.poster?.url || '',
                backdrop_path: formData.backdrop?.[0]?.url || '',
                vote_average: formData.voteAverage,
                vote_count: formData.voteCount,
                genre_ids: [formData.category], // Giả sử chỉ chọn 1 thể loại
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
        console.error('Error creating movie:', error.response ? error.response.data : error);
        throw error; // Ném lỗi để component có thể xử lý
    }
};
