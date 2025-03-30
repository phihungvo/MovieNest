import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// // Upload a file and return the URL if successful
// export const uploadFile = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     const TOKEN = localStorage.getItem('token');

//     try {
//         console.log('Uploading file:', file.name);
//         const response = await axios.post(
//             `${API_URL}/storage/upload`,
//             formData,
//             {
//                 headers: {
//                     Authorization: `Bearer ${TOKEN}`,
//                     'Content-Type': 'multipart/form-data',
//                     Expect: '',
//                 },
//             },
//         );

//         if (response.status === 200) {
//             // Get the file URL from backend
//             const fileInfoResponse = await getFileInfo();
//             const fileInfo = fileInfoResponse.find(
//                 (info) => info.name === file.name,
//             );

//             if (fileInfo) {
//                 return fileInfo.url;
//             }
//         }

//         return null;
//     } catch (error) {
//         console.error('File upload failed: ', error);
//         throw error;
//     }
// };

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Lấy token mới nhất
    const TOKEN = localStorage.getItem('token');
    
    try {
        console.log('Uploading file:', file.name);
        const response = await axios.post(
            `${API_URL}/storage/upload`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        
        console.log('Upload response:', response.data);
        
        // Trả về trực tiếp response.data mà không cần gọi getFileInfo()
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
        const response = await axios.get(`${API_URL}/storage/files`, {
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

export const getFileByName = async (filename) => {

    const TOKEN = localStorage.getItem('token');

    try {
        const response = await axios.get(
            `${API_URL}/storage/files/${filename}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.log(`Failed to get file ${filename}: `, error);
        throw error;
    }
};

export default {
    uploadFile,
    getFileInfo,
    getFileByName,
};
