import classNames from 'classnames';
import styles from './Actor.module.scss';
import SmartButton from '~/components/Layout/components/SmartButton';
import SmartInput from '~/components/Layout/components/SmartInput';
import SmartTable from '~/components/Layout/components/SmartTable';
import {
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { Form, message } from 'antd';
import {
    createActor,
    getAllActorNoPaging,
    getAllPagable,
    handleUpdateActor,
    deleteActor,
} from '~/service/admin/actor';
import PopupModal from '~/components/Layout/components/PopupModal';
import { useState, useEffect, use } from 'react';
const cx = classNames.bind(styles);

const columns = [
    {
        title: 'Actor Name',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        fixed: 'left',
    },
    {
        title: 'Character',
        dataIndex: 'character',
        key: 'character',
        width: 200,
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: 200,
    },
    {
        title: 'Birthday',
        dataIndex: 'birthday',
        key: 'birthday',
        width: 200,

        render: (date) =>
            date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
    },
    {
        title: 'placeOfBirth',
        dataIndex: 'placeOfBirth',
        key: 'placeOfBirth',
        width: 200,
    },
    {
        title: 'Profile Path',
        dataIndex: 'profilePath',
        key: 'profilePath',
        width: 200,
        render: (url) => (
            <img
                src={url ? url : '/default-poster.jpg'}
                alt="Profile path"
                style={{ width: '50px' }}
            />
        ),
    },
    {
        title: 'Actions',
        fixed: 'right',
        width: 200,
        render: (_, record) => (
            <>
                <SmartButton
                    title="Edit"
                    type="primary"
                    icon={<EditOutlined />}
                    buttonWidth={80}
                    // onClick={() => handleEditMovie(record)}
                />
                <SmartButton
                    title="Delete"
                    type="danger"
                    icon={<DeleteOutlined />}
                    buttonWidth={80}
                    // onClick={() => handleDeleteMovie(record)}
                />
            </>
        ),
    },
];

const movieModalFields = [
    {
        label: 'Actor Name',
        name: 'name',
        type: 'text',
        rules: [{ required: true, message: 'Actor name is required!' }],
    },
    { label: 'Character', name: 'character', type: 'text' },
    {
        label: 'Gender',
        name: 'gender',
        type: 'yesno',
        options: ['Male', 'Female'],
    },
    {
        label: 'Birthday',
        name: 'birthday',
        type: 'date',
    },
    { label: 'Biography', name: 'biography', type: 'textarea' },
];

function Actor() {
    const [actorSource, setActorSource] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [modalMode, setModalMode] = useState(null); // 'create', 'edit' or 'delete'
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalModeTitle, setModalModeTitle] = useState(null);
    const [form] = Form.useForm();

    const handleAddActor = () => {
        setModalMode('create');
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCreateActor = async (formData) => {
        console.log('Form data submitted:', formData);

        const response = await createActor(formData);

        handleGetAllActors();
        setIsModalOpen(false);
    };

    const handleGetAllActors = async (page = 1, pageSize = 5) => {
        // setLoading(true);
        try {
            const response = await getAllPagable({ page, pageSize });

            const actorList = response.content;

            if (Array.isArray(actorList)) {
                setActorSource(actorList);
                setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: response.totalElements,
                }));
            }

            setActorSource(actorList);
        } catch (error) {
            console.error('Failed to fetch actors:', error);
        }
    };

    const handleTableChange = (pagination) => {
        handleGetAllActors(pagination.current, pagination.pageSize);
    };

    const handleFormSubmit = (formData) => {
        if (modalMode === 'create') {
            handleCreateActor(formData);
        }
    };

    useEffect(() => {
        handleGetAllActors();
    }, []);

    const getModalModeTitle = () => {
        switch (modalModeTitle) {
            case 'create':
                return 'Add New Actor';
            case 'edit':
                return 'Edit Actor';
            case 'delete':
                return 'Delete Actor';
            default:
                return 'Actor Details';
        }
    };

    return (
        <div className={cx('actor-wrapper')}>
            <div className={cx('card-header')}>
                <h2>Actor Management</h2>
                <div>
                    <SmartButton
                        title="Add new"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={handleAddActor}
                    />
                </div>
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
                    <SmartButton title="Bộ lọc" icon={<FilterOutlined />} />
                    <SmartButton title="Excel" icon={<CloudUploadOutlined />} />
                </div>
            </div>
            <div className={cx('actor-container')}>
                <SmartTable
                    title={getModalModeTitle()}
                    columns={columns}
                    dataSources={actorSource}
                    // loading={loading}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            </div>

            <PopupModal
                isModalOpen={isModalOpen}
                title={getModalModeTitle()}
                setIsModalOpen={setIsModalOpen}
                fields={modalMode === 'delete' ? [] : movieModalFields}
                onSubmit={handleFormSubmit}
                isDeleteMode={modalMode === 'delete'}
                formInstance={form}
            />
        </div>
    );
}

export default Actor;
