import { Form, Input, Button, Divider, Switch, Row, Col } from 'antd';
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
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                name="currentPassword"
                                label="Mật khẩu hiện tại"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Vui lòng nhập mật khẩu hiện tại!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                name="newPassword"
                                label="Mật khẩu mới"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu mới!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng xác nhận mật khẩu!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue('newPassword') ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    'Mật khẩu xác nhận không khớp!',
                                                ),
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className={cx('button-wrapper')}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Cập nhật mật khẩu
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>

            <Divider />
        </div>
    );
}

export default SecuritySettings;
