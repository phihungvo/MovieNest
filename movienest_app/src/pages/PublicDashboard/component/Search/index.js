import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames/bind";
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function SearchMovie({ movieData }) {
    const navigate = useNavigate();

    const handleSelectMovie = (movie) => {
        navigate(`/movie/${movie.id}`);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner-content')}>
                <div className={cx('search-title')}>Tìm kiếm hot</div>
                <List
                    dataSource={movieData}
                    renderItem={(movie, index) => (
                        <div
                            key={movie.id}
                            className={cx('item')}
                            onClick={() => handleSelectMovie(movie)}
                        >
                            <span className={cx('index')}>{index + 1}</span>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <span className={cx('title')}>{movie.title}</span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

export default SearchMovie;
