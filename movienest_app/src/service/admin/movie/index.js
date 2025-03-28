import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const TOKEN = process.env.REACT_APP_TOKEN;

export const getAllMovies = async ({page = 0, pageSize = 5}) => {
    try {
        const response = await axios.get(`${API_URL}/movie/getAll`, {
            params: {
                page: page,
                pageSize: pageSize
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching movies:", error.response ? error.response.data : error.message);
        throw error; // Ném lỗi để component có thể xử lý
    }
};
