import React from "react";
import { Modal, Form, Input, DatePicker, InputNumber, Select, Upload, Rate } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

function GenericModalForm({ isModalOpen, setIsModalOpen, title, fields, onSubmit }) {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
            setIsModalOpen(false);
        } catch (error) {
            console.log("Validation Failed:", error);
        }
    };

    return (
        <Modal
            title={title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={() => setIsModalOpen(false)}
            width={700}
        >
            <Form form={form} layout="vertical">
                {fields.map((field) => {
                    switch (field.type) {
                        case "text":
                            return (
                                <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                                    <Input />
                                </Form.Item>
                            );
                        case "date":
                            return (
                                <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item>
                            );
                        case "number":
                            return (
                                <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                                    <InputNumber style={{ width: "100%" }} />
                                </Form.Item>
                            );
                        case "select":
                            return (
                                <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                                    <Select>
                                        {field.options.map((option) => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            );
                        case "rate":
                            return (
                                <Form.Item key={field.name} label={field.label} name={field.name}>
                                    <Rate />
                                </Form.Item>
                            );
                        case "textarea":
                            return (
                                <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                                    <TextArea rows={3} />
                                </Form.Item>
                            );
                        case "upload":
                            return (
                                <Form.Item key={field.name} label={field.label} name={field.name} valuePropName="fileList" getValueFromEvent={normFile}>
                                    <Upload action="/upload.do" listType="picture-card">
                                        <button type="button" style={{ border: 0, background: "none" }}>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </button>
                                    </Upload>
                                </Form.Item>
                            );
                        default:
                            return null;
                    }
                })}
            </Form>
        </Modal>
    );
}

export default GenericModalForm;


