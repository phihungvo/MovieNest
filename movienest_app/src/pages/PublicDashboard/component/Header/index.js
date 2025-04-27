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
import SearchMovie from '../Search/index';
import { useDebounce } from '~/hooks';
import { searchMovieByKeyWord } from '~/service/admin/movie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/routes/AuthContext';

const cx = classNames.bind(styles);

function Header({ activeSearch = true }) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const debounced = useDebounce(searchValue, 400);
    const inputRef = useRef();

    // Xử lý sự kiện scroll
    useEffect(() => {
        const handleScroll = () => {
            // Tính toán độ trong suốt dựa trên vị trí scroll
            const scrollPosition = window.scrollY;
            
            // Nếu scroll xuống quá 50px, thêm class scrolled
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

    const hanleInputChange = (e) => {
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
                console.log('Success when get movies.', results);
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

    return (
        <>
            <header className={cx('wrapper', { scrolled })}>
                <div className={cx('inner')}>
                    <div className={cx('sub_media')}>
                        <div className={cx('leftMenu')}>
                            <img src="https://i.imgur.com/ZEbJI8l.png" />
                            <NavMenu publicRoutes={publicRoutes} />
                        </div>
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
                            <Tippy content="Hồ sơ và cài đặt!">
                                <div
                                    className={cx('icon')}
                                    onClick={() => handleLogin()}
                                >
                                    {/* <img src="https://khoinguonsangtao.vn/wp-content/uploads/2022/09/hinh-anh-gai-xinh-cap-2-3.jpg" alt="avatar" /> */}
                                </div>
                            </Tippy>
                            <p>{user?.username}</p>
                        </div>
                    </div>
                </div>
            </header>
            {/* {activeSearch && (
                <div className={cx('search-bar')}>
                    <div className={cx('search-form')}>
                        <FontAwesomeIcon
                            className={cx()}
                            icon={faMagnifyingGlass}
                        />

                        <input
                            ref={inputRef}
                            value={searchValue}
                            className={cx('search-input')}
                            placeholder="Search for a movie, tv show or person ..."
                            onChange={hanleInputChange}
                        />

                        <div className={'status_loading'}>
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
                    </div>
                </div>
            )}
            {searchResult?.length > 0 && (
                <SearchMovie movieData={searchResult} />
            )} */}
        </>
    );
}

export default Header;