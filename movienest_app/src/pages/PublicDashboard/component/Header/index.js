import NavMenu from '../NavMenu';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
    faBell,
    faLanguage,
    faMagnifyingGlass,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { message } from 'antd';
import SearchMovie from '../Search/index';
import { useDebounce } from '~/hooks';
import { searchMovieByKeyWord } from '~/service/admin/movie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/routes/AuthContext';
import { Menu, Dropdown } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import SmartButton from '~/components/Layout/components/SmartButton';

const cx = classNames.bind(styles);

function Header({ activeSearch = true }) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const debounced = useDebounce(searchValue, 400);
    const inputRef = useRef();

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;

            if (scrollPosition > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Dọn dẹp event listener khi component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }

        setLoading(true);

        const fetchMovies = async () => {
            try {
                const results = await searchMovieByKeyWord(debounced);
                setSearchResult(results);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log('Error when get movies.');
            }
        };

        fetchMovies();
    }, [debounced]);

    const publicRoutes = [
        { title: 'Movies', path: '/movies' },
        { title: 'TV Shows', path: '/tv-shows' },
        { title: 'People', path: '/people' },
        { title: 'More', path: '/more' },
    ];

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        message.success('Đăng xuất thành công!');
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                Hồ sơ
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                Cài đặt
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <header className={cx('wrapper', { scrolled })}>
                <div className={cx('inner')}>
                    <div className={cx('sub_media')}>
                        <div className={cx('leftMenu')}>
                            <img
                                src="https://i.imgur.com/ZEbJI8l.png"
                                alt="Logo"
                                onClick={handleLogoClick}
                                style={{ cursor: 'pointer' }}
                            />
                            <NavMenu publicRoutes={publicRoutes} />
                        </div>

                        {activeSearch && (
                            <div className={cx('search-bar')}>
                                <div className={cx('search-form')}>
                                    <FontAwesomeIcon
                                        className={cx('search-icon')}
                                        icon={faMagnifyingGlass}
                                    />
                                    <input
                                        ref={inputRef}
                                        value={searchValue}
                                        className={cx('search-input')}
                                        placeholder="Tìm kiếm..."
                                        onChange={handleInputChange}
                                    />
                                    <div className={cx('status_loading')}>
                                        {!!searchValue && !loading && (
                                            <button
                                                className={cx('clear')}
                                                onClick={handleClear}
                                            >
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            </button>
                                        )}
                                        {loading && (
                                            <FontAwesomeIcon
                                                className={cx('loading')}
                                                icon={faSpinner}
                                            />
                                        )}
                                    </div>
                                    {searchResult?.length > 0 && (
                                        <SearchMovie movieData={searchResult} />
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={cx('rightMenu')}>
                            <FontAwesomeIcon
                                className={cx('icon')}
                                icon={faPlus}
                            />
                            <FontAwesomeIcon
                                className={cx('icon')}
                                icon={faLanguage}
                            />
                            <div className={cx('badge')}>
                                <FontAwesomeIcon
                                    className={cx('icon')}
                                    icon={faBell}
                                />
                                <div className={cx('count')}> 1 </div>
                            </div>
                            {user ? (
                                <Dropdown overlay={userMenu} trigger={['click']}>
                                    <div className={cx('user-profile')}>
                                        <div className={cx('avatar')}>
                                            <img src="https://i.pravatar.cc/150" alt="avatar" />
                                        </div>
                                        <span className={cx('username')}>{user.username}</span>
                                    </div>
                                </Dropdown>
                            ) : (
                                <SmartButton
                                    title="Đăng nhập" 
                                    onClick={() => navigate('/login')}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
