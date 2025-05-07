import { Form, Input, Button, Divider, Switch } from 'antd';
import styles from './SecuritySettings.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function SecuritySettings() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    return (
        <div className={cx('security-settings')}>
            <h2>Bảo mật</h2>
            
            <div className={cx('section')}>
                <h3>Đổi mật khẩu</h3>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <Divider />

            <div className={cx('section')}>
                <h3>Xác thực hai yếu tố</h3>
                <div className={cx('two-factor')}>
                    <Switch defaultChecked={false} />
                    <span>Bật xác thực hai yếu tố</span>
                </div>
            </div>
        </div>
    );
}

export default SecuritySettings;
