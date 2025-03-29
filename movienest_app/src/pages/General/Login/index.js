import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '~/service/admin/user';

function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = await login(values.email, values.password);

            if (!token) {
                message.error('Login failed. Invalid credentials.');
                return;
            }

            message.success('Login successful!');

            localStorage.setItem('token', token);

            navigate('/admin/movie');
        } catch (error) {
            console.error('Lỗi:', error);

            let errorMsg = 'Có lỗi xảy ra khi đăng nhập.';

            if (error.response) {
                if (error.response.status === 403) {
                    errorMsg =
                        'Không có quyền truy cập. Vui lòng kiểm tra lại thông tin đăng nhập.';
                } else if (error.response.data && error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            }

            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleNavigate = () => {
        navigate('/admin/register');
    };

    return (
        <div>
            <h1>Login Page</h1>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" label={null}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    <Button
                        type="default"
                        onClick={handleNavigate}
                        style={{ marginLeft: '10px' }}
                    >
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;
