import { Form, Input, Button, Upload, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '~/routes/AuthContext';
import { personalInfoTranslations } from '~/translations/personalInfo';
import classNames from 'classnames/bind';
import styles from './PersonalInfo.module.scss';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

function PersonalInfo() {
    const { user, language = 'vi' } = useAuth();
    const t = personalInfoTranslations[language || 'vi'];
    const [form] = Form.useForm();

    useEffect(() => {
        if (!user) return;

        form.resetFields();
        form.setFieldsValue({
            ...user,
            username: user?.username || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
        });
    }, [language, user]);

    const beforeUpload = (file) => {
        // const isImage = file.type.startsWith();
        // if (!isImage) {
        //     message.error(t.errorImageOnly);
        //     return false;
        // }
        const isLt5M = file.size / 1024 / 1024 < 9;
        if (!isLt5M) {
            message.error(t.errorFileSize);
            return false;
        }
        return true;
    };

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    return (
        <div className={cx('personal-info')}>
            <div className={cx('header')}>
                <h2>{t.title}</h2>
            </div>
            <Form
                form={form}
                layout="vertical"
                initialValues={user}
                onFinish={onFinish}
            >
                <Row gutter={24} align="middle">
                    <Col span={16}>
                        <Form.Item
                            name="avatar"
                            label={t.avatar}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) return e;
                                return e?.fileList;
                            }}
                            style={{ marginBottom: 16 }}
                        >
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={beforeUpload}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>
                                    {t.uploadButton}
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="username" label={t.username}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="email" label={t.email}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="lastName" label={t.lastName}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="firstName" label={t.firstName}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="phoneNumber" label={t.phoneNumber}>
                    <Input />
                </Form.Item>

                <Form.Item>
                    <div className="submit-button-container">
                        <Button type="primary" htmlType="submit">
                            {t.updateButton}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}

export default PersonalInfo;
