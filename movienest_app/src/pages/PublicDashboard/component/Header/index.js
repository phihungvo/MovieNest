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
import { useLanguage } from '~/contexts/LanguageContext';
import { GlobalOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function Header({ activeSearch = true }) {
    const { currentLanguage, setCurrentLanguage, translate } = useLanguage();
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
        { title: translate('navigation.movies'), path: '/movies' },
        { title: translate('navigation.tvShows'), path: '/tv-shows' },
        { title: translate('navigation.people'), path: '/people' },
        { title: translate('navigation.more'), path: '/more' },
    ];

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        message.success('Đăng xuất thành công!');
    };

    const handleNavigate = (urlPathNavigate) => {
        return () => navigate(urlPathNavigate);
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />} onClick={handleNavigate('/user-info-management')}>
                {translate('user.profile')}
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                {translate('user.settings')}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                {translate('user.logout')}
            </Menu.Item>
        </Menu>
    );

    const languageMenu = (
        <Menu>
            <Menu.Item key="vi" onClick={() => setCurrentLanguage('vi')}>
                🇻🇳 Tiếng Việt
            </Menu.Item>
            <Menu.Item key="en" onClick={() => setCurrentLanguage('en')}>
                🇺🇸 English
            </Menu.Item>
            <Menu.Item key="zh" onClick={() => setCurrentLanguage('zh')}>
                🇨🇳 中文
            </Menu.Item>
            <Menu.Item key="th" onClick={() => setCurrentLanguage('th')}>
                🇹🇭 ภาษาไทย
            </Menu.Item>
            <Menu.Item key="id" onClick={() => setCurrentLanguage('id')}>
                🇮🇩 Bahasa Indonesia
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
                                        placeholder={translate('user.search')}
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
                            <Dropdown overlay={languageMenu} trigger={['click']}>
                                <div className={cx('icon', 'language-switcher')}>
                                    <GlobalOutlined style={{ fontSize: '18px' }} />
                                </div>
                            </Dropdown>
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
                                    title={translate('user.login')} 
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
