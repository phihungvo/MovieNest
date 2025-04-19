import React from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/AdminDashboard/Trailer/Trailer.module.scss';
import { useState, useEffect } from 'react';
import moment from 'moment';
import SmartTable from '~/components/Layout/components/SmartTable';
import {
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    CloudUploadOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import SmartInput from '~/components/Layout/components/SmartInput';
import SmartButton from '~/components/Layout/components/SmartButton';
import PopupModal from '~/components/Layout/components/PopupModal';
import { Form, message } from 'antd';
import { getAllUser } from '~/service/admin/user';

const cx = classNames.bind(styles);

function User() {
    const [userSource, setUserSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [modalMode, setModalMode] = useState('create');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'UserName',
            dataIndex: 'username',
            key: 'username',
            width: 200,
            fixed: 'left',
        },
        {
            title: 'email',
            dataIndex: 'email',
            key: 'email',
            width: 150,
        },
        { title: 'address', dataIndex: 'address', key: 'address', width: 150 },
        {
            title: 'phone_number',
            dataIndex: 'phone_number',
            key: 'phone_number',
            width: 200,
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            key: 'roles',
            width: 100,
            render: (roles) => (roles ? 'USER' : 'ADMIN'),
        },
        {
            title: 'Create At',
            dataIndex: 'create_at',
            key: 'create_at',
            width: 200,
            render: (date) =>
                date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
        },
        {
            title: 'Actions',
            fixed: 'right',
            render: (_, record) => (
                <>
                    <SmartButton
                        title="Edit"
                        type="primary"
                        icon={<EditOutlined />}
                        buttonWidth={80}
                        // onClick={() => handleEditTrailer(record)}
                    />
                    <SmartButton
                        title="Delete"
                        type="danger"
                        icon={<DeleteOutlined />}
                        buttonWidth={80}
                        // onClick={() => handleDeleteTrailer(record)}
                        style={{ marginLeft: '8px' }}
                    />
                </>
            ),
        },
    ];

    const userModalFields = [
        {
            label: 'User Name',
            name: 'username',
            type: 'text',
            rules: [{ required: true, message: 'User Name is required!' }],
        },
        {
            label: 'Email',
            name: 'email',
            type: 'text',
            rules: [{ required: true, message: 'Email is required!' }],
        },
        {
            label: 'Password',
            name: 'password',
            type: 'text',
        },
        {
            label: 'Address',
            name: 'address',
            type: 'text',
        },
        {
            label: 'Role',
            name: 'roles',
            type: 'select',
            options: ['USER', 'ADMIN', 'MODERATOR'],
        },
        {
            label: 'Bio',
            name: 'bio',
            type: 'textarea',
        },
    ];

    const handleGetAllUsers = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await getAllUser({ page: page - 1, pageSize });
            const userList = response.content;

            if (response && Array.isArray(userList)) {
                const transformedTrailers = userList.map((user) => {
                    return {
                        ...user,
                        keyDisplay: user.key,
                    };
                });

                setUserSource(transformedTrailers);
                setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: response.totalElements,
                }));
            } else {
                console.error('Invalid data users: ', response);
                setUserSource([]);
            }
        } catch (error) {
            console.error('Error fetching user', error);
            setUserSource([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = () => {
        setModalMode('create');
        form.resetFields();
        setIsModalOpen(true);
    };

    useEffect(() => {
        handleGetAllUsers();
    }, []);

    const handleFormSubmit = (formData) => {};

    const handleTableChange = (pagination) => {
        handleGetAllUsers(pagination.current, pagination.pageSize);
    };
    const getModalTitle = () => {
        switch (modalMode) {
            case 'create':
                return 'Add New User';
            case 'edit':
                return 'Edit User';
            case 'delete':
                return 'Delete User';
            default:
                return 'User Details';
        }
    };

    return (
        <div className={cx('trailer-wrapper')}>
            <div className={cx('trailer-header')}>
                <h2>User Management</h2>
            </div>
            <hr
                style={{
                    borderColor: '#e5e7eb',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                }}
            />
            <div className={cx('sub_header')}>
                <SmartInput
                    size="large"
                    placeholder="Search"
                    icon={<SearchOutlined />}
                />
                <div className={cx('features')}>
                    <SmartButton
                        title="Add new"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={handleAddUser}
                    />
                    <SmartButton title="Bộ lọc" icon={<FilterOutlined />} />
                    <SmartButton title="Excel" icon={<CloudUploadOutlined />} />
                </div>
            </div>
            <div className={cx('trailer-container')}>
                <SmartTable
                    columns={columns}
                    dataSources={userSource}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            </div>

            <PopupModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title={getModalTitle()}
                fields={modalMode === 'delete' ? [] : userModalFields}
                formInstance={form}
            />
        </div>
    );
}

export default User;
