import React, { useState, useEffect } from 'react';
import moment from 'moment';
import TextField from '../TextField';
import PasswordField from '../PasswordField';
import DateField from '../DateField';
import DateRange from '../DateRange';
import TimeField from '../TimeField';
import InputNumberField from '../InputNumberField';
import SelectField from '../SelectField';
import CalendarField from '../CalendarField';
import TextAreaField from '../TextAreaField';
import UploadField from '../UploadField';
import CheckboxGroup from '../CheckboxGroup';
import Checkbox from '../Checkbox';
import RadioGroup from '../RadioGroup';
import { Button, Col, Form, message, Modal, Row } from 'antd';

function PopupModal({
    isModalOpen,
    setIsModalOpen,
    title,
    fields = [],
    dataSources = {}, // Đổi thành object để linh hoạt hơn
    onSubmit,
    initialValues,
    isDeleteMode,
    formInstance,
    footer,
    width = 700,
    onBeforeSubmit,
    deleteMessage,
    deleteConfirmLabel = 'Xóa',
    cancelLabel = 'Hủy',
    submitLabel = 'Xác nhận',
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processedFields, setProcessedFields] = useState([]);
    const form = formInstance;

    // Xử lý fields với dữ liệu động khi component khởi tạo hoặc khi dependencies thay đổi
    useEffect(() => {
        if (!fields || fields.length === 0) return;

        const updatedFields = fields.map((field) => {
            // Tạo bản sao của field để tránh thay đổi props
            const updatedField = { ...field };

            // Xử lý các trường select mà cần dataSources
            if (field.dataSourceKey && dataSources[field.dataSourceKey]) {
                const dataSource = dataSources[field.dataSourceKey];

                // Chuyển đổi dataSource thành mảng options cho trường select
                if (Array.isArray(dataSource)) {
                    updatedField.options = dataSource.map((item) => {
                        // Nếu dataSource là array of objects
                        if (typeof item === 'object') {
                            return {
                                label:
                                    item[field.labelKey || 'name'] ||
                                    item[field.labelKey || 'title'] ||
                                    `Item ${item[field.valueKey || 'id']}`,
                                value: item[field.valueKey || 'id'],
                                data: item, // Lưu toàn bộ data để có thể sử dụng sau này nếu cần
                            };
                        }
                        // Nếu dataSource là array of strings/numbers
                        return {
                            label: item,
                            value: item,
                        };
                    });
                }
                // Nếu dataSource đã là object với format {label, value}
                else if (
                    typeof dataSource === 'object' &&
                    !Array.isArray(dataSource)
                ) {
                    updatedField.options = Object.keys(dataSource).map(
                        (key) => ({
                            label: dataSource[key],
                            value: key,
                        }),
                    );
                }
            }

            // Xử lý các trường select đơn giản có options tĩnh
            if (field.type === 'yesno' || field.type === 'boolean') {
                updatedField.type = 'select';
                updatedField.options = field.options || ['Yes', 'No'];
            }

            return updatedField;
        });

        setProcessedFields(updatedFields);
    }, [fields, dataSources]);

    if (isDeleteMode) {
        return (
            <Modal
                title={title}
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={
                    footer || [
                        <Button
                            key="cancel"
                            onClick={() => setIsModalOpen(false)}
                        >
                            {cancelLabel}
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            danger
                            onClick={() => onSubmit(initialValues)}
                        >
                            {deleteConfirmLabel}
                        </Button>,
                    ]
                }
            >
                {deleteMessage || (
                    <>
                        {initialValues?.title && (
                            <p>
                                Bạn có chắc chắn muốn xóa{' '}
                                <b>
                                    <i>{initialValues.title}</i>
                                </b>{' '}
                                ?
                            </p>
                        )}
                        <p>Hành động này không thể hoàn tác.</p>
                    </>
                )}
            </Modal>
        );
    }

    const handleOk = async () => {
        try {
            setIsSubmitting(true);

            const values = await form.validateFields();

            const finalValues = onBeforeSubmit
                ? await onBeforeSubmit(values)
                : values;

            await onSubmit(finalValues);
            console.log('Final form value: ', finalValues)

            setIsModalOpen(false);
        } catch (error) {
            console.log('Validation Failed: ', error);
            message.error('Vui lòng kiểm tra lại thông tin nhập liệu');
        } finally {
            setIsSubmitting(false);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'text':
                return <TextField field={field} />;
            case 'password':
                return <PasswordField field={field} />;
            case 'date':
                return <DateField field={field} />;
            case 'daterange':
                return <DateRange field={field} />;
            case 'time':
                return <TimeField field={field} />;
            case 'number':
                return <InputNumberField field={field} />;
            case 'select':
                return <SelectField field={field} />;
            case 'cascader':
                return <CalendarField field={field} />;
            case 'textarea':
                return <TextAreaField field={field} />;
            case 'upload':
                return <UploadField field={field} />;
            case 'checkbox':
                return <Checkbox field={field} />;
            case 'checkbox-group':
                return <CheckboxGroup field={field} />;
            case 'radio':
                return <RadioGroup field={field} />;
            default:
                return null;
        }
    };

    // Nhóm các trường thành các hàng (2 trường mỗi hàng trừ khi fullWidth = true)
    const groupedFields = [];
    if (processedFields && processedFields.length > 0) {
        let row = [];

        processedFields.forEach((field) => {
            // Nếu trường cần độ rộng đầy đủ hoặc hàng đã có 2 trường
            if (field.fullWidth || row.length >= 2) {
                if (row.length > 0) {
                    groupedFields.push([...row]);
                }
                row = [field];
            } else {
                row.push(field);
            }
        });

        // Thêm hàng cuối cùng
        if (row.length > 0) {
            groupedFields.push([...row]);
        }
    }

    return (
        <Modal
            title={title}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            width={width}
            centered={true}
            destroyOnClose={true}
            maskClosable={false}
            footer={
                footer || [
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        {cancelLabel}
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        loading={isSubmitting}
                    >
                        {submitLabel}
                    </Button>,
                ]
            }
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={true}
                validateMessages={{
                    required: '${label} là trường bắt buộc!',
                    types: {
                        email: '${label} không phải là email hợp lệ!',
                        number: '${label} không phải là số hợp lệ!',
                    },
                    number: {
                        range: '${label} phải nằm trong khoảng ${min} đến ${max}',
                    },
                }}
            >
                {groupedFields.map((row, rowIndex) => (
                    <Row key={rowIndex} gutter={[16, 0]}>
                        {row.map((field) => {
                            const isFullWidth =
                                row.length === 1 || field.fullWidth;
                            return (
                                <Col
                                    span={isFullWidth ? 24 : 12}
                                    key={
                                        field.name ||
                                        `field-${rowIndex}-${Math.random()}`
                                    }
                                >
                                    {renderField(field)}
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
