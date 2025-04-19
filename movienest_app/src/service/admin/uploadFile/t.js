// http://localhost:8080/api/movie/update/0bde48a3-1dbc-4174-95ec-d9753cd5ec3d
export const handleUpdateMovie = async (movieId, formData) => {
    const TOKEN = getToken();

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        // Process poster image
        let posterPath = formData.posterPath;
        if (posterPath) {
            if (posterPath.originFileObj) {
                try {
                    // New file upload
                    const posterResult = await uploadFile(posterPath.originFileObj);
                    posterPath = posterResult.url;
                    console.log(`Poster image ${posterResult.alreadyExists ? 'already exists' : 'uploaded'}: ${posterPath}`);
                } catch (uploadError) {
                    // If upload fails due to file already existing, try to get the URL
                    if (uploadError.response && uploadError.response.data && 
                        uploadError.response.data.message && 
                        uploadError.response.data.message.includes("already exists")) {
                        
                        console.log("Poster file already exists, using existing URL");
                        posterPath = `${API_URL}/storage/files/${posterPath.originFileObj.name}`;
                    } else {
                        throw uploadError;
                    }
                }
            } else if (posterPath.url) {
                // Existing image from form
                posterPath = posterPath.url;
            } else if (Array.isArray(posterPath) && posterPath.length > 0) {
                // Handle array format (from Ant Design Upload)
                if (posterPath[0].originFileObj) {
                    try {
                        const posterResult = await uploadFile(posterPath[0].originFileObj);
                        posterPath = posterResult.url;
                        console.log(`Poster image ${posterResult.alreadyExists ? 'already exists' : 'uploaded'}: ${posterPath}`);
                    } catch (uploadError) {
                        // If upload fails due to file already existing, try to get the URL
                        if (uploadError.response && uploadError.response.data && 
                            uploadError.response.data.message && 
                            uploadError.response.data.message.includes("already exists")) {
                            
                            console.log("Poster file already exists, using existing URL");
                            posterPath = `${API_URL}/storage/files/${posterPath[0].originFileObj.name}`;
                        } else {
                            throw uploadError;
                        }
                    }
                } else if (posterPath[0].url) {
                    posterPath = posterPath[0].url;
                }
            }
            // If posterPath is already a string URL, keep it as is
        }
        
        // Process backdrop image (same logic as poster)
        let backdropPath = formData.backdropPath;
        if (backdropPath) {
            if (backdropPath.originFileObj) {
                try {
                    // New file upload
                    const backdropResult = await uploadFile(backdropPath.originFileObj);
                    backdropPath = backdropResult.url;
                    console.log(`Backdrop image ${backdropResult.alreadyExists ? 'already exists' : 'uploaded'}: ${backdropPath}`);
                } catch (uploadError) {
                    // If upload fails due to file already existing, try to get the URL
                    if (uploadError.response && uploadError.response.data && 
                        uploadError.response.data.message && 
                        uploadError.response.data.message.includes("already exists")) {
                        
                        console.log("Backdrop file already exists, using existing URL");
                        backdropPath = `${API_URL}/storage/files/${backdropPath.originFileObj.name}`;
                    } else {
                        throw uploadError;
                    }
                }
            } else if (backdropPath.url) {
                // Existing image from form
                backdropPath = backdropPath.url;
            } else if (Array.isArray(backdropPath) && backdropPath.length > 0) {
                // Handle array format (from Ant Design Upload)
                if (backdropPath[0].originFileObj) {
                    try {
                        const backdropResult = await uploadFile(backdropPath[0].originFileObj);
                        backdropPath = backdropResult.url;
                        console.log(`Backdrop image ${backdropResult.alreadyExists ? 'already exists' : 'uploaded'}: ${backdropPath}`);
                    } catch (uploadError) {
                        // If upload fails due to file already existing, try to get the URL
                        if (uploadError.response && uploadError.response.data && 
                            uploadError.response.data.message && 
                            uploadError.response.data.message.includes("already exists")) {
                            
                            console.log("Backdrop file already exists, using existing URL");
                            backdropPath = `${API_URL}/storage/files/${backdropPath[0].originFileObj.name}`;
                        } else {
                            throw uploadError;
                        }
                    }
                } else if (backdropPath[0].url) {
                    backdropPath = backdropPath[0].url;
                }
            }
            // If backdropPath is already a string URL, keep it as is
        }

        console.log('Final posterPath and backdropPath: ', posterPath, ' : ', backdropPath);

        // Convert boolean string values to actual booleans
        const updatedData = {
            ...formData,
            releaseDate: releaseDate,
            posterPath: posterPath,
            backdropPath: backdropPath,
            popular: formData.popular === 'Yes',
            adult: formData.adult === 'Yes',
            inTheater: formData.inTheater === 'Yes',
        };

        console.log('Updating movie with data:', updatedData);

        const response = await axios.put(
            API_ENDPOINTS.MOVIES.UPDATE(movieId),
            updatedData,
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
        message.error('Error updating movie: ' + (error.message || 'Unknown error'));
        throw error;
    }
};