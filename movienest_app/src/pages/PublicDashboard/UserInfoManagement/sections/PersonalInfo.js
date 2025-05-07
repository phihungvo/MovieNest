import { Form, Input, Button } from 'antd';
import { useAuth } from '~/routes/AuthContext';
import classNames from 'classnames/bind';
import styles from './PersonalInfo.module.scss';

const cx = classNames.bind(styles);

function PersonalInfo() {
    const { user } = useAuth();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    return (
        <div className={cx('personal-info')}>
            <h2>Thông tin cá nhân</h2>
            <Form
                form={form}
                layout="vertical"
                initialValues={user}
                onFinish={onFinish}
            >
                <Form.Item name="username" label="Tên đăng nhập">
                    <Input disabled />
                </Form.Item>
                <Form.Item name="email" label="Email">
                    <Input />
                </Form.Item>
                <Form.Item name="firstName" label="Tên">
                    <Input />
                </Form.Item>
                <Form.Item name="lastName" label="Họ">
                    <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Số điện thoại">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cập nhật thông tin
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default PersonalInfo;
