import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '~/service/admin/user';
import { jwtDecode } from 'jwt-decode';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import SmartButton from '~/components/Layout/components/SmartButton';
import { PhoneOutlined, AppleOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '~/routes/AuthContext';

const cx = classNames.bind(styles);

function Login() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = await login(values.email, values.password);

            if (!token) {
                message.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
                return;
            }

            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);

            const roles = decodedToken.role || [];
            const userId = decodedToken.userId;
            const isAdmin = roles.includes('ADMIN');
            const username = decodedToken.username || decodedToken.sub || 'Unknown';

            localStorage.setItem('role', isAdmin ? 'admin' : 'user');
            // localStorage.setItem('userId', userId);

            // Cập nhật thông tin vào context
            authLogin({
                token,
                role: isAdmin ? 'admin' : 'user',
                roles: roles,
                userId: userId,
                username: username, // 👈 Thêm username vào đây
            });

            message.success('Đăng nhập thành công!');
            
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Lỗi:', error);

            let errorMsg = 'Có lỗi xảy ra khi đăng nhập.';

            if (error.response) {
                if (error.response.status === 403) {
                    errorMsg = 'Không có quyền truy cập. Vui lòng kiểm tra lại thông tin đăng nhập.';
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

    return (
        <div className={cx('login-container')}>
            <div className={cx('login-box')}>
                <h1>Chào mừng trở lại</h1>
                <Form
                    name="basic"
                    className={cx('login-form')}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
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

                    <Form.Item label={null}>
                        <Button
                            htmlType="submit"
                            block
                            style={{
                                backgroundColor: '#0ca37f',
                                color: '#fff',
                                padding: '16px 0',
                            }}
                        >
                            Login
                        </Button>
                    </Form.Item>

                    <p>
                        Chưa có tài khoản?{' '}
                        <a onClick={() => navigate('/register')}> Đăng ký</a>
                    </p>
                    <div className="divider">Hoặc</div>

                    <div className={cx('or-buttons')}>
                        <SmartButton
                            title="Tiếp tục với Google"
                            buttonWidth={340}
                            icon={<GoogleOutlined />}
                        />
                        <SmartButton
                            title="Tiếp tục với Tài khoản Apple"
                            buttonWidth={340}
                            icon={<AppleOutlined />}
                        />
                        <SmartButton
                            title="Tiếp tục với Điện thoại"
                            buttonWidth={340}
                            icon={<PhoneOutlined />}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Login;
