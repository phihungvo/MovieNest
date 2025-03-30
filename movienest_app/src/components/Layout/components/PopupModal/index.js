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
} from 'antd';
import { uploadFile } from '~/service/admin/uploadFile';

const { TextArea } = Input;

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

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
            const formData = { ...values }; // Copy of values

            console.log('Values: >>> ', values);

            // Process poster and backdrop upload if exists
            if (values.posterPath && values.posterPath.length > 0) {
                const posterFile = values.posterPath[0].originFileObj;

                try {
                    const response = await uploadFile(posterFile);
                    console.log('Poster uploaded response:', response);
                    // Save URL return frm server
                    formData.posterPath = response.url;
                } catch (error) {
                    console.error('Error uploading poster: ', error);
                    formData.posterPath = null;
                }
            } else {
                values.posterPath = null;
            }

            if (values.backdropPath && values.backdropPath.length > 0) {
                const backdropFile = values.backdropPath[0].originFileObj;

                try {
                    const response = await uploadFile(backdropFile);
                    console.log('Backdrop uploaded response: ', response);

                    formData.backdropPath = response.url;
                } catch (error) {
                    console.error('Error uploading backdrop:', error);
                    formData.backdropPath = null;
                }
            } else {
                values.backdropPath = null;
            }
            // Ensure genres is an array
            if (values.genres && !Array.isArray(values.genres)) {
                values.genres = [values.genres];
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
                            // action="/upload.do"
                            listType="picture-card"
                            beforeUpload={() => false}
                            maxCount={1} // Allow only one file
                            accept="image/*" // Accept only images
                            onPreview={(file) => {
                                if (file.url) {
                                    window.open(file.url);
                                } else if (file.originFileObj) {
                                    const objectUrl = URL.createObjectURL(
                                        file.originFileObj,
                                    );
                                    window.open(objectUrl);
                                }
                            }}
                        >
                            {uploadButton}
                            <button
                                type="button"
                                style={{ border: 0, background: 'none' }}
                            >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    // Sắp xếp các field vào các hàng (2 field cùng type một hàng nếu có thể)
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
        row.push(field); // Thêm field hiện tại vào row.
        prevType = field.type;
    });

    // Nếu vẫn còn row chưa được thêm vào groupedFields, thì thêm nó vào.
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
