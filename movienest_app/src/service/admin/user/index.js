import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/login`,
            {
                email,
                password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Login Response:', response.data);

        if (response.status === 200) {
            return response.data.token;
        } else {
            console.error('Login failed with status:', response.status);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error(
            'Error in login function:',
            error.response?.data || error.message,
        );
        throw error;
    }
};

export const register = async (username, email, password) => {
    try {
        console.log('Start call api with api_url: ', { API_URL });

        const response = await axios.post(
            `${API_URL}/auth/register`,
            { username, email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Nếu backend yêu cầu cookie/session
            },
        );

        console.log('Register Response: ', response.data);

        if (response.status === 200) {
            return response.data.token;
        } else {
            console.error('Register failed with status:', response.status);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error(
            'Error in register function:',
            error.response?.data || error.message,
        );
        throw error;
    }
};
