import axios from 'axios';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';

const API_URL = process.env.REACT_APP_API_URL;

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Lấy token mới nhất
    const TOKEN = localStorage.getItem('token');

    try {
        const checkResponse = await axios.get(
            API_ENDPOINTS.FILE.CHECK_EXISTED(file),
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        );

        // If file exists, get its URL without uploading again
        if (checkResponse.data && checkResponse.data.exists) {
            console.log('File already exists on server, retrieving URL');
            const fileUrl = `${API_URL}/storage/files/${file.name}`;

            return {
                filename: file.name,
                url: fileUrl,
                alreadyExists: true,
            };
        }

        const response = await axios.post(API_ENDPOINTS.FILE.UPLOAD, formData, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Upload file response:', response.data);

        return response.data;
    } catch (error) {
        console.error('File upload failed: ', error);
        throw error;
    }
};

// Get all file infor
export const getFileInfo = async () => {
    const TOKEN = localStorage.getItem('token');

    try {
        const response = await axios.get(API_ENDPOINTS.FILE.GET_INFO, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get file info: ', error);
        throw error;
    }
};

export const getMovieImage = async (imagePath) => {
    const TOKEN = localStorage.getItem('token');

    try {
        if (
            imagePath &&
            (imagePath.startsWith('http://') ||
                imagePath.startsWith('https://'))
        ) {
            return imagePath;
        }

        const response = await axios.get(API_ENDPOINTS.FILE.GET_FILE, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            responseType: 'blob',
        });
        // Tạo URL từ blob response
        return URL.createObjectURL(response.data);
    } catch (error) {
        console.error('Lỗi khi lấy ảnh movie:', error);
        return '/images/default-movie-poster.jpg';
    }
};

export default {
    uploadFile,
    getFileInfo,
    getMovieImage,
};
