import classNames from 'classnames';
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
import moment from 'moment';
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
import styles from './Actor.module.scss';

const cx = (className) => styles[className];

const movieModalFields = [
    {
        label: 'Actor Name',
        name: 'name',
        type: 'text',
        rules: [{ required: true, message: 'Actor name is required!' }],
    },
    { label: 'Character', name: 'character', type: 'text' },
    { label: 'Place of birth', name: 'placeOfBirth', type: 'text' },
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
    const [selectedActor, setSelectedActor] = useState(null);
    const [form] = Form.useForm();

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
            width: 100,
        },
        {
            title: 'Birthday',
            dataIndex: 'birthday',
            key: 'birthday',
            width: 120,
            render: (date) =>
                date ? moment(date).format('DD/MM/YYYY') : 'N/A',
        },
        {
            title: 'placeOfBirth',
            dataIndex: 'placeOfBirth',
            key: 'placeOfBirth',
            width: 200,
        },
        {
            title: 'Profile',
            dataIndex: 'profilePath',
            key: 'profilePath',
            width: 80,
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
                        onClick={() => handleEditActor(record)}
                    />
                    <SmartButton
                        title="Delete"
                        type="danger"
                        icon={<DeleteOutlined />}
                        buttonWidth={80}
                        onClick={() => handleDeleteActor(record)}
                    />
                </>
            ),
        },
    ];

    const actorModalFields = [
        {
            label: 'Actor Name',
            name: 'name',
            type: 'text',
            rules: [{ required: true, message: 'Actor Name is required!' }],
        },
        { label: 'Character', name: 'character', type: 'text' },
        { label: 'Biography', name: 'biography', type: 'text' },
        {
            label: 'Gender',
            name: 'gender',
            type: 'yesno',
            options: ['Male', 'Female'],
        },
        { label: 'Profile Path', name: 'profilePath', type: 'text' },
        {
            label: 'Birthday',
            name: 'birthday',
            type: 'date',
        },
        { label: 'Place Of Birth', name: 'placeOfBirth', type: 'text' },
    ];

    const handleAddActor = () => {
        setModalMode('create');
        setSelectedActor(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCallCreateActor = async (formData) => {
        await createActor(formData);
        handleGetAllActors();
        setIsModalOpen(false);
    };

    const handleCallUpdateActor = async (formData) => {
        await handleUpdateActor(selectedActor.id, formData);
        handleGetAllActors();
        setIsModalOpen(false);
    };

    const handleEditActor = (record) => {
        setSelectedActor(record);
        setModalMode('edit');

        const formData = {
            name: record.name,
            character: record.character,
            placeOfBirth: record.placeOfBirth,
            gender: record.gender === 'Male' ? 'Male' : 'Female',
            birthday:
                record.birthday && moment(record.birthday).isValid()
                    ? moment(record.birthday)
                    : null,
            biography: record.biography,
            profilePath: record.profilePath,
        };

        form.setFieldsValue(formData);
        setIsModalOpen(true);
    };

    const handleDeleteActor = (record) => {
        setModalMode('delete');
        setSelectedActor(record);
        setIsModalOpen(true);
    };

    const handleCallDeleteActor = async () => {
        await deleteActor(selectedActor.id);
        message.success('Actor deleted successfully!');
        handleGetAllActors();
        setIsModalOpen(false);
    };

    const handleGetAllActors = async (page = 1, pageSize = 5) => {
        // setLoading(true);
        const response = await getAllPagable({ page: page - 1, pageSize });

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
    };

    const handleTableChange = (pagination) => {
        handleGetAllActors(pagination.current, pagination.pageSize);
    };

    const handleFormSubmit = (formData) => {
        if (modalMode === 'create') {
            handleCallCreateActor(formData);
        } else if (modalMode === 'edit') {
            handleCallUpdateActor(formData);
        } else if (modalMode === 'delete') {
            handleCallDeleteActor();
        }
    };

    useEffect(() => {
        handleGetAllActors();
    }, []);

    const getModalModeTitle = () => {
        switch (modalMode) {
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
                        onClick={handleAddActor}
                    />
                    <SmartButton title="Bộ lọc" icon={<FilterOutlined />} />
                    <SmartButton title="Excel" icon={<CloudUploadOutlined />} />
                </div>
            </div>
            <div className={cx('actor-container')}>
                <SmartTable
                    title={getModalModeTitle()}
                    columns={columns}
                    dataSources={actorSource}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            </div>

            <PopupModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title={getModalModeTitle()}
                fields={modalMode === 'delete' ? [] : actorModalFields}
                onSubmit={handleFormSubmit}
                initialValues={selectedActor}
                isDeleteMode={modalMode === 'delete'}
                formInstance={form}
            />
        </div>
    );
}

export default Actor;
