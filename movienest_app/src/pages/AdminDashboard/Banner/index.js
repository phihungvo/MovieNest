import classNames from 'classnames/bind';
import styles from './Banner.module.scss';
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    CloudUploadOutlined,
} from '@ant-design/icons';
import SmartButton from '~/components/Layout/components/SmartButton';
import SmartInput from '~/components/Layout/components/SmartInput';
import SmartTable from '~/components/Layout/components/SmartTable';
import { useEffect, useState } from 'react';
import {
    createBanner,
    getAllBanners,
    updateBanner,
    deleteBanner
} from '~/service/admin/banner';
import { Form, message, Tag } from 'antd';
import PopupModal from '~/components/Layout/components/PopupModal';
import { findAllMovieNoPaging } from '~/service/admin/movie';

const cx = (className) => styles[className];

function Banner() {
    const [bannerSources, setBannerSources] = useState([]);
    const [movieSources, setMovieSources] = useState([]);
    const [modalMode, setModalMode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchKeyword, setSearchKeyword] = useState('');

    const columns = [
        {
            title: 'Banner Title',
            dataIndex: 'title',
            key: 'title',
            width: 350,
            fixed: 'left',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 150,
        },
        {
            title: 'Image Url',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 400,

            render: (url) => (
                <img
                    src={url ? url : '/default-poster.jpg'}
                    alt="poster"
                    style={{ width: '300px' }}
                />
            ),
        },
        {
            title: 'Actions',
            fixed: 'right',
            width: 250,
            render: (_, record) => (
                <>
                    <SmartButton
                        title="Edit"
                        type="primary"
                        icon={<EditOutlined />}
                        buttonWidth={80}
                        onClick={() => handleEditBanner(record)}
                    />
                    <SmartButton
                        title="Delete"
                        type="danger"
                        icon={<DeleteOutlined />}
                        buttonWidth={80}
                        onClick={() => handleDeleteBanner(record)}
                        style={{ marginLeft: '8px' }}
                    />
                </>
            ),
        },
    ];

    const bannerModalFields = [
        {
            label: 'Banner Title',
            name: 'title',
            type: 'text',
            placeholder: 'Nhập Banner Title',
        },
        {
            label: 'Banner Type',
            name: 'type',
            type: 'select',
            options: ['SLIDER', 'POPUP', 'HOMEPAGE'],
        },
        {
            label: 'Image URL',
            name: 'imageUrl',
            type: 'text',
            placeholder: 'Nhập Image URL',
        },
        {
            label: 'Movie',
            name: 'movieId',
            type: 'select',
            dataSourceKey: 'movie',
            placeholder: 'Chọn phim',
            showSearch: true,
        },
    ];

    const handleCallGetAllMovies = async () => {
        const response = await findAllMovieNoPaging();
        setMovieSources({ movie: response });
    };

    const handleAddBanner = () => {
        setModalMode('create');
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCallCreateBanner = async (formData) => {
        console.log('form data: ', formData);
        await createBanner(formData);
        handleGetAllBanner();
        setIsModalOpen(false);
    };

    const handleEditBanner = (record) => {
        console.log('record: ', record);
        setSelectedBanner(record);
        setModalMode('edit');
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleCallUpdateBanner = async (formData) => {
        console.log('selected banner: ', selectedBanner)
        await updateBanner(selectedBanner.id, formData);
        handleGetAllBanner();
        setIsModalOpen(false);
    };

    const handleDeleteBanner = (record) => {
        setModalMode('delete');
        setSelectedBanner(record);
        setIsModalOpen(true);
    };

    const handleCallDeleteBanner = async () => {
        await deleteBanner(selectedBanner.id);
        handleGetAllBanner();
        setIsModalOpen(false);
    }

    const handleGetAllBanner = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await getAllBanners({ page: page - 1, pageSize });
            const bannerList = response.content;

            if (Array.isArray(bannerList)) {
                setBannerSources(bannerList);
                setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: response.totalElements,
                }));
            } else {
                console.error('Invalid data format:', response);
                setBannerSources([]);
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
            setBannerSources([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetAllBanner();
        handleCallGetAllMovies();
    }, []);

    const handleTableChange = (pagination) => {
        handleGetAllBanner(pagination.current, pagination.pageSize);
    };

    const handleFormSubmit = (formData) => {
        if (modalMode === 'create') {
            handleCallCreateBanner(formData);
        } else if (modalMode === 'edit'){
            handleCallUpdateBanner(formData);
        } else if (modalMode === 'delete'){
            handleCallDeleteBanner();
        }
    };

    const handleSearch = () => {
        handleGetAllBanner(1, pagination.pageSize);
    };

    const handleClearSearch = () => {
        setSearchKeyword('');
        handleGetAllBanner(1, pagination.pageSize);
    };

    const getModalModeTitle = () => {
        switch (modalMode) {
            case 'create':
                return 'Add New Banner';
            case 'edit':
                return 'Edit Banner';
            case 'delete':
                return 'Delete Banner';
            default:
                return 'Banner Details';
        }
    };

    return (
        <div className={cx('banner-wrapper')}>
            <div className={cx('sub_header')}>
                <SmartInput
                    size="large"
                    placeholder="Search"
                    icon={<SearchOutlined />}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onPressEnter={handleSearch}
                    allowClear
                    onClear={handleClearSearch}
                />
                <div className={cx('features')}>
                    <SmartButton
                        title="Add new"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={handleAddBanner}
                    />
                    <SmartButton title="Bộ lọc" icon={<FilterOutlined />} />
                    <SmartButton title="Excel" icon={<CloudUploadOutlined />} />
                </div>
            </div>

            <div className={cx('banner-container')}>
                <SmartTable
                    columns={columns}
                    dataSources={bannerSources}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            </div>

            <PopupModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title={getModalModeTitle()}
                fields={modalMode === 'delete' ? [] : bannerModalFields}
                dataSources={movieSources} 
                onSubmit={handleFormSubmit}
                initialValues={selectedBanner}
                isDeleteMode={modalMode === 'delete'}
                formInstance={form}
            />
        </div>
    );
}

export default Banner;
