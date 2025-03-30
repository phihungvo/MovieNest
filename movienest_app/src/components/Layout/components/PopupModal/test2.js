import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    DatePicker,
    Form,
    Input,
    InputNumber,
    Rate,
    Select,
    Upload,
    Modal,
    Row,
    Col,
    Button,
    message,
} from 'antd';
import axios from 'axios';

const { TextArea } = Input;

// Custom function to handle file upload and return URL
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await axios.post('http://localhost:8080/api/storage/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        if (response.status === 200) {
            // Get the file URL from the backend
            const fileInfoResponse = await axios.get('http://localhost:8080/api/storage/files');
            const fileInfo = fileInfoResponse.data.find(info => info.name === file.name);
            
            if (fileInfo) {
                message.success(`${file.name} uploaded successfully`);
                return fileInfo.url;
            }
        }
        return null;
    } catch (error) {
        message.error(`${file.name} upload failed: ${error.message}`);
        return null;
    }
};

function PopupModal({
    isModalOpen,
    setIsModalOpen,
    title,
    genresSources,
    fields,
    onSubmit,
}) {
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [form] = Form.useForm();
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [uploadLoading, setUploadLoading] = useState(false);

    const handleOk = async () => {
        setUploadLoading(true);
        try {
            const values = await form.validateFields();
            
            // Process poster upload if exists
            if (values.posterPath && values.posterPath.length > 0) {
                const posterFile = values.posterPath[0].originFileObj;
                const posterUrl = await uploadFile(posterFile);
                values.posterPath = posterUrl;
            } else {
                values.posterPath = null;
            }
            
            // Process backdrop upload if exists
            if (values.backdropPath && values.backdropPath.length > 0) {
                const backdropFile = values.backdropPath[0].originFileObj;
                const backdropUrl = await uploadFile(backdropFile);
                values.backdropPath = backdropUrl;
            } else {
                values.backdropPath = null;
            }
            
            // Ensure genres is an array
            if (values.genres && !Array.isArray(values.genres)) {
                values.genres = [values.genres];
            }
            
            onSubmit(values); // Send data to parent component
            form.resetFields();
            setUploadedFiles({});
        } catch (errorInfo) {
            console.log('Validation Failed:', errorInfo);
        } finally {
            setUploadLoading(false);
        }
    };
    
    const handleCancel = () => {
        form.resetFields();
        setUploadedFiles({});
        setIsModalOpen(false);
    };

    // Custom upload button for images
    const uploadButton = (
        <button type="button" style={{ border: 0, background: 'none' }}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    // Render each field based on its type
    const renderField = (field, isFullWidth) => {
        switch (field.type) {
            case 'text':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rules}
                    >
                        <Input />
                    </Form.Item>
                );
            case 'date':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rules}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                );
            case 'number':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rules}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                );
            case 'select':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rules}
                    >
                        <Select>
                            {genresSources &&
                                genresSources.map((genre) => (
                                    <Select.Option
                                        key={genre.id}
                                        value={genre.id}
                                    >
                                        {genre.name}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                );
            case 'rate':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Rate />
                    </Form.Item>
                );
            case 'textarea':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rules}
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                );
            case 'upload':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                        style={{ marginLeft: isFullWidth ? '0' : '50px' }}
                    >
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false} // Prevent auto upload
                            maxCount={1} // Allow only one file
                            accept="image/*" // Accept only images
                            onPreview={(file) => {
                                if (file.url) {
                                    window.open(file.url);
                                } else if (file.originFileObj) {
                                    const objectUrl = URL.createObjectURL(file.originFileObj);
                                    window.open(objectUrl);
                                }
                            }}
                        >
                            {uploadButton}
                        </Upload>
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    // Group fields into rows (2 fields of same type per row if possible)
    const groupedFields = [];
    let row = [];
    let prevType = null;

    fields.forEach((field) => {
        if (prevType !== field.type || row.length >= 2) {
            if (row.length > 0) {
                groupedFields.push([...row]);
            }
            row = [];
        }
        row.push(field);
        prevType = field.type;
    });

    // Add any remaining row
    if (row.length > 0) {
        groupedFields.push([...row]);
    }

    return (
        <Modal
            title={title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleOk}
                    loading={uploadLoading}
                >
                    Submit
                </Button>,
            ]}
        >
            <Form form={form} layout="horizontal" disabled={componentDisabled}>
                {groupedFields.map((row, rowIndex) => (
                    <Row key={rowIndex} gutter={[16, 16]}>
                        {row.map((field) => {
                            const isFullWidth = row.length === 1;
                            return (
                                <Col
                                    span={isFullWidth ? 24 : 12}
                                    key={field.name}
                                >
                                    {renderField(field, isFullWidth)}
                                </Col>
                            );
                        })}
                    </Row>
                ))}
            </Form>
        </Modal>
    );
}

export default PopupModal;

const handleOk = async () => {
    setUploadLoading(true);

    try {
        const values = await form.validateFields();
        const formData = { ...values }; // Tạo bản sao của values

        // Upload và lấy URL ảnh poster
        if (values.posterPath && values.posterPath.length > 0) {
            const posterFile = values.posterPath[0].originFileObj;
            try {
                const response = await uploadFile(posterFile);
                console.log('Poster uploaded response:', response);
                // Lưu URL trả về từ server
                formData.posterPath = response.url;
            } catch (error) {
                console.error('Error uploading poster:', error);
                formData.posterPath = null;
            }
        } else {
            formData.posterPath = null;
        }

        // Upload và lấy URL ảnh backdrop
        if (values.backdropPath && values.backdropPath.length > 0) {
            const backdropFile = values.backdropPath[0].originFileObj;
            try {
                const response = await uploadFile(backdropFile);
                console.log('Backdrop uploaded response:', response);
                // Lưu URL trả về từ server
                formData.backdropPath = response.url;
            } catch (error) {
                console.error('Error uploading backdrop:', error);
                formData.backdropPath = null;
            }
        } else {
            formData.backdropPath = null;
        }
        
        console.log('Final form data to submit:', formData);
        onSubmit(formData);
        form.resetFields();
        setUploadedFiles({});
    } catch (error) {
        console.log('Validation Failed: ', error);
    } finally {
        setUploadLoading(false);
    }
};


// export const uploadFile = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     // Lấy token mới nhất
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
//                 },
//             },
//         );
        
//         console.log('Upload response:', response.data);
        
//         // Trả về trực tiếp response.data mà không cần gọi getFileInfo()
//         return response.data;
//     } catch (error) {
//         console.error('File upload failed: ', error);
//         throw error;
//     }
// };