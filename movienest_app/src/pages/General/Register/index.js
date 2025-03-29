import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Select, message, errorMsg } from 'antd';
import { register } from '~/service/admin/user';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

function Register() {
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleNavigate = () => {
        navigate('/admin/login');
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = await register(
                values.username,
                values.email,
                values.password,
            );

            if (!token) {
                message.error('Register failed. Invalid credentials.');
            }

            message.success('Register successful!');

            localStorage.setItem('token', token);

            navigate('/admin/movie');
        } catch (error) {
            console.error('Lỗi:', error);

            let errorMsg = 'Có lỗi xảy ra khi đăng ký';

            if (error.response) {
                if (error.response.status === 403) {
                    errorMsg =
                        'Không có quyền truy cập. Vui lòng kiểm tra lại thông tin đăng ký.';
                } else if (error.response.data && error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            }

            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2>Register</h2>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                    residence: ['zhejiang', 'hangzhou', 'xihu'],
                    prefix: '86',
                }}
                style={{ maxWidth: 600 }}
                scrollToFirstError
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        {
                            type: 'text',
                            message: 'The input is not valid Username!',
                        },
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value
                                    ? Promise.resolve()
                                    : Promise.reject(
                                          new Error('Should accept agreement'),
                                      ),
                        },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        I have read the <a href="">agreement</a>
                    </Checkbox>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Register
                    </Button>
                    <Button
                        onClick={handleNavigate}
                        loading={loading}
                        style={{ marginLeft: '10px' }}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default Register;
