import axios from 'axios';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';
import { message } from 'antd';

export const login = async (email, password) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.AUTH.LOGIN,
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.status === 200) return response.data.token;
    } catch (error) {
        console.error('Error in login: ', error);
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.AUTH.REGISTER,
            { username, email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.status === 200) return response.data.token;
    } catch (error) {
        message.error('Register failed: ', error);
    }
};
