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
} from 'antd';

const { TextArea } = Input;

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

function PopupModal({ isModalOpen, setIsModalOpen, title, fields, onSubmit }) {
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
            setIsModalOpen(false);
        } catch (error) {
            console.log('Validation Failed:', error);
        }
    };

    // Render từng field theo kiểu của nó
    const renderField = (field) => {
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
                        <Select>
                            {field.options.map((option) => (
                                <Select.Option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
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
                        <Upload action="/upload.do" listType="picture-card">
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
        row.push(field);
        prevType = field.type;
    });

    if (row.length > 0) {
        groupedFields.push([...row]);
    }

    return (
        <Modal
            title={title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={() => setIsModalOpen(false)}
            width={700}
        >
            <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 18 }}
                layout="horizontal"
                disabled={componentDisabled}
            >
                {groupedFields.map((row, rowIndex) => (
                    <Row key={rowIndex} gutter={[16, 16]}>
                        {row.map((field) => (
                            <Col
                                span={row.length === 1 ? 24 : 12}
                                key={field.name}
                            >
                                {renderField(field)}
                            </Col>
                        ))}
                    </Row>
                ))}
            </Form>
        </Modal>
    );
}

export default PopupModal;



            // case 'select':
            //     return (
            //         <Form.Item
            //             key={field.name}
            //             label={field.label}
            //             name={field.name}
            //             rules={field.rules}
            //         >
            //             <Select>
            //                 {
            //                     genresSources && genresSources.map((genre) => {
            //                         <Select
            //                             key={genre.id}
            //                             value={genre.id}
            //                         >
            //                             {genre.name}
            //                         </Select>
            //                     })
            //                 }
            //             </Select>
            //         </Form.Item>
            //     );
