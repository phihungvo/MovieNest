import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '~/constants/endpoints';
import { getToken } from '~/constants/token';

export const getAllBanners = async ({ page = 0, pageSize = 5 }) => {
    try {
        const response = await axios.get(API_ENDPOINTS.BANNER.GET_ALL, {
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('response data: ', response.data);

        return response.data;
    } catch (error) {
        console.error(
            'Error fetching banners:',
            error.response ? error.response.data : error.message,
        );
    }
};

export const createBanner = async (formData) => {
    console.log('Form data: ', formData);
    try {
        const response = await axios.post(
            API_ENDPOINTS.BANNER.CREATE,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error when creating banner: ', error);
    }
};

export const updateBanner = async (bannerId, formData) => {
    try {
        const response = await axios.put(
            API_ENDPOINTS.BANNER.UPDATE(bannerId),
            formData,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error when updating banner: ', error);
    }
};

export const deleteBanner = async (bannerId) => {
    try {
        const response = await axios.delete(
            API_ENDPOINTS.BANNER.DELETE(bannerId),
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response) {
            console.log('Banner delete success!');
        }
    } catch (error) {
        console.error('Error deleting comment: ', error);
        throw error;
    }
};
