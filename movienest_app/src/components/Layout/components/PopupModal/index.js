import React, { useState, useEffect } from 'react';
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
import moment from 'moment';
import { uploadFile } from '~/service/admin/uploadFile';

const { TextArea } = Input;

function PopupModal({
    isModalOpen,
    setIsModalOpen,
    title,
    dataSources,
    trailerSource,
    fields,
    onSubmit,
    initialValues,
    isDeleteMode,
    formInstance,
    uploadFileFields = [],
}) {
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    // Sử dụng form instance được truyền từ component cha
    const form = formInstance;

    // Xử lý khi form có giá trị ban đầu từ prop initialValues
    useEffect(() => {
        if (initialValues && !isDeleteMode) {
            // Form đã được set giá trị từ component cha (Movie.jsx)
            console.log('Modal received initialValues:', initialValues);
        }
    }, [initialValues, isDeleteMode]);

    const handleOk = async () => {
        setUploadLoading(true);

        try {
            if (isDeleteMode) {
                onSubmit(initialValues);
            } else {
                const values = await form.validateFields();

                const formData = {
                    ...values,
                    popular: values.popular === 'Yes',
                    inTheater: values.inTheater === 'Yes',
                    official: values.official === 'Yes',
                    adult: values.adult === 'Yes',
                };

                // Process upload fields
                for (const field of uploadFileFields) {
                    if (values[field] && values[field].length > 0) {
                        const fileInfo = values[field][0];
                        
                        if (fileInfo.originFileObj) {
                            formData[field] = fileInfo;
                        } else if (fileInfo.url) {
                            formData[field] = fileInfo.url;
                        } else {
                            formData[field] = null;
                        }
                    } else {
                        formData[field] = null;
                    }
                }

                // Process date fields
                if (formData.releaseDate) {
                    formData.releaseDate = formData.releaseDate.format 
                        ? formData.releaseDate.format('YYYY-MM-DD')
                        : formData.releaseDate;
                }

                // Ensure genres is an array
                if (formData.genres && !Array.isArray(formData.genres)) {
                    formData.genres = [formData.genres];
                }

                // Nếu đang edit, giữ lại ID
                if (initialValues && initialValues.id) {
                    formData.id = initialValues.id;
                }
                
                console.log('Submitting formData:', formData);
                onSubmit(formData);
            }
        } catch (error) {
            console.log('Validation Failed: ', error);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleCancel = () => {
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
                        <Select mode={field.multiple ? 'multiple' : undefined}>
                            {field.options
                                ? field.options.map((option) => (
                                      <Select.Option
                                          key={option}
                                          value={option}
                                      >
                                          {option}
                                      </Select.Option>
                                  ))
                                : field.name === 'trailers'
                                ? trailerSource?.map((trailer) => (
                                      <Select.Option
                                          key={trailer.id}
                                          value={trailer.id}
                                      >
                                          {trailer.title}
                                      </Select.Option>
                                  ))
                                : dataSources?.map((genre) => (
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
            case 'yesno':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rules}
                    >
                        <Select>
                            {(field.options || []).map((option, index) => (
                                <Select.Option key={index} value={option}>
                                    {option}
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
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false}
                            maxCount={1}
                            accept="image/*"
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
                        </Upload>
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    // Helper function để xử lý upload
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    // Render delete modal
    if (isDeleteMode) {
        return (
            <Modal
                title={title}
                centered
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        onClick={handleOk}
                    >
                        Delete
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn xóa <b><i> {initialValues?.title} </i></b> ?</p>
                <p>Hành động này không thể hoàn tác.</p>
            </Modal>
        );
    }

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
        row.push(field);
        prevType = field.type;
    });

    // Thêm row cuối cùng vào groupedFields
    if (row.length > 0) {
        groupedFields.push([...row]);
    }

    return (
        <Modal
            title={title}
            open={isModalOpen}
            onCancel={handleCancel}
            width={700}
            // style={{ top: 20 }}
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
