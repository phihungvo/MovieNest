// Tách logic xử lý ảnh thành hàm riêng
export const processImageUpload = async (imageData) => {
    if (!imageData) return null;

    let imagePath = imageData;
    
    // Xử lý file mới upload
    if (imageData.originFileObj) {
        try {
            // Upload file mới
            const uploadResult = await uploadFile(imageData.originFileObj);
            imagePath = uploadResult.url;
            console.log(
                `Image ${uploadResult.alreadyExists ? 'already exists' : 'uploaded'}: ${imagePath}`
            );
        } catch (uploadError) {
            // Nếu upload thất bại do file đã tồn tại, thử lấy URL
            if (
                uploadError.response &&
                uploadError.response.data &&
                uploadError.response.data.message &&
                uploadError.response.data.message.includes('already exists')
            ) {
                console.log('File already exists, using existing URL');
                imagePath = `${API_URL}/storage/files/${imageData.originFileObj.name}`;
            } else {
                throw uploadError;
            }
        }
    } 
    // Xử lý ảnh có sẵn từ form
    else if (imageData.url) {
        imagePath = imageData.url;
    } 
    // Xử lý định dạng mảng (từ Ant Design Upload)
    else if (Array.isArray(imageData) && imageData.length > 0) {
        if (imageData[0].originFileObj) {
            try {
                const uploadResult = await uploadFile(imageData[0].originFileObj);
                imagePath = uploadResult.url;
                console.log(
                    `Image ${uploadResult.alreadyExists ? 'already exists' : 'uploaded'}: ${imagePath}`
                );
            } catch (uploadError) {
                // Nếu upload thất bại do file đã tồn tại, thử lấy URL
                if (
                    uploadError.response &&
                    uploadError.response.data &&
                    uploadError.response.data.message &&
                    uploadError.response.data.message.includes('already exists')
                ) {
                    console.log('File already exists, using existing URL');
                    imagePath = `${API_URL}/storage/files/${imageData[0].originFileObj.name}`;
                } else {
                    throw uploadError;
                }
            }
        } else if (imageData[0].url) {
            imagePath = imageData[0].url;
        }
    }
    // Nếu imagePath đã là URL chuỗi, giữ nguyên như vậy
    
    return imagePath;
};

// Hàm xử lý cập nhật phim đã refactor
export const handleUpdateMovie = async (movieId, formData) => {
    const TOKEN = getToken();

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        // Xử lý ảnh poster sử dụng hàm mới
        const posterPath = await processImageUpload(formData.posterPath);
        
        // Xử lý ảnh backdrop sử dụng hàm mới
        const backdropPath = await processImageUpload(formData.backdropPath);

        console.log(
            'Final posterPath and backdropPath: ',
            posterPath,
            ' : ',
            backdropPath,
        );

        // Cập nhật formData với đường dẫn ảnh mới
        const updatedFormData = {
            ...formData,
            posterPath,
            backdropPath,
            releaseDate
        };

        console.log('Updating movie with data>>>>>>>>>>>>>:', updatedFormData);

        const response = await axios.put(
            API_ENDPOINTS.MOVIES.UPDATE(movieId),
            updatedFormData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.data) {
            message.success('Movie updated successfully!');
        }
        return response.data;
    } catch (error) {
        message.error(
            'Error updating movie: ' + (error.message || 'Unknown error'),
        );
        throw error;
    }
};