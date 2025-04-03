import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// const TOKEN = process.env.REACT_APP_TOKEN;

const TOKEN = localStorage.getItem("token");

// http://localhost:8080/api/admin/findAll
export const getAllGenres = async () => {
    try {
        const response = await axios.get(`${API_URL}/genres/findAll`, {
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
