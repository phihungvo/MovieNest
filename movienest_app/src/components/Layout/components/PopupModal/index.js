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
    Button
} from 'antd';

const { TextArea } = Input;

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

function PopupModal({ isModalOpen, setIsModalOpen, title, genresSources, fields, onSubmit }) {
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                onSubmit(values); // Gửi dữ liệu lên component cha
                form.resetFields();
            })
            .catch((errorInfo) => {
                console.log('Validation Failed:', errorInfo);
            });
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
                            {genresSources && genresSources.map((genre) => (
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
                        getValueFromEvent={normFile}
                        style={{ marginLeft: '50px' }}
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
            onCancel={() => setIsModalOpen(false)}
            width={700}
            footer={[
                <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
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

// // Sắp xếp các field vào các hàng (2 field cùng type một hàng nếu có thể)
// const groupedFields = [];
// let row = [];
// let prevType = null;

// fields.forEach((field) => {
//     if (prevType !== field.type || row.length >= 2) {
//         if (row.length > 0) {
//             groupedFields.push([...row]);
//         }
//         row = [];
//     }
//         // Nếu kiểu field (type) khác với kiểu của field trước đó (prevType) hoặc
//         // Nếu hàng hiện tại đã có đủ 2 fields (row.length >= 2)
//         // ➡ Thì bắt đầu một hàng mới:
//             // Lưu hàng cũ vào groupedFields (nếu có).
//             // Reset row về mảng rỗng để bắt đầu hàng mới.

//     row.push(field); // Thêm field hiện tại vào row.

//     prevType = field.type; // Cập nhật prevType để theo dõi kiểu field hiện tại.
// });

// // Nếu vẫn còn row chưa được thêm vào groupedFields, thì thêm nó vào.
// if (row.length > 0) {
//     groupedFields.push([...row]);
// }
