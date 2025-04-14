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
                // Nếu là delete mode, không cần validate form
                onSubmit(initialValues);
            } else {
                // Validate và lấy giá trị từ form
                const values = await form.validateFields();
                const formData = { ...values };

                console.log('Values from form:', values);

                // if (formData.voteAverage !== undefined) {
                //     formData.voteAverage = formData.voteAverage;
                //     delete formData.voteAverage;
                // }

                // if (formData.voteCount !== undefined) {
                //     formData.voteCount = formData.voteCount;
                //     delete formData.voteCount;
                // }

                if (formData.popular) {
                    formData.popular = formData.popular === 'Yes';
                }
                if (formData.inTheater) {
                    formData.inTheater = formData.inTheater === 'Yes';
                }

                if (formData.official) {
                    formData.official = formData.official === 'Yes';
                }

                if (formData.adult) {
                    formData.adult = formData.adult === 'Yes';
                }

                // Xử lý các trường file (nếu có)
                if (uploadFileFields.length > 0) {
                    for (const field of uploadFileFields) {
                        if (values[field] && values[field].length > 0) {
                            // Kiểm tra nếu file đã có URL (trường hợp edit)
                            if (values[field][0].url) {
                                formData[field] = values[field][0].url;
                            } else if (values[field][0].originFileObj) {
                                // Nếu là file mới upload
                                const file = values[field][0].originFileObj;
                                try {
                                    const response = await uploadFile(file);
                                    console.log(
                                        `${field} uploaded response:`,
                                        response,
                                    );
                                    formData[field] = response.url;
                                } catch (error) {
                                    console.error(
                                        `Error uploading ${field}:`,
                                        error,
                                    );
                                    formData[field] = null;
                                }
                            }
                        } else {
                            formData[field] = null;
                        }
                    }
                }

                // Xử lý ngày tháng
                if (formData.releaseDate) {
                    formData.releaseDate =
                        formData.releaseDate.format('YYYY-MM-DD');
                }

                // Ensure genres is an array
                if (formData.genres && !Array.isArray(formData.genres)) {
                    formData.genres = [formData.genres];
                }

                // Nếu đang edit, giữ lại ID
                if (initialValues && initialValues.id) {
                    formData.id = initialValues.id;
                }

                console.log('Final form data to submit:', formData);
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
                        <DatePicker
                            style={{ width: '100%' }}
                        />
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
                <p>
                    Are you sure you want to delete the movie "
                    {initialValues?.title}"?
                </p>
                <p>This action cannot be undone.</p>
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
