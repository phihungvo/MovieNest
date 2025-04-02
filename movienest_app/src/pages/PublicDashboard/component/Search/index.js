import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider, List, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames/bind";
import styles from './Search.module.scss';

const cx = classNames.bind(styles)

function SearchMovie({ movieData }) {
    const navigate = useNavigate();

    // const handleSelectMovie = (movie) => {
    //     // navigate(`/search/results?query=${encodeURIComponent(movie.original_name)}&type=movie`);
    //     // navigate(`/search-result?name=${encodeURIComponent(movie.original_name)}`);
    //     navigate(`/search/result?name=${movie.original_name}`);
    // };

    const handleSelectMovie = (movie) => {
        console.log("Navigating to:", `/search/result?name=${movie.original_name}`);
        navigate(`/search/result?name=${movie.original_name}`);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner-content')}>
                <List
                    className={cx('item')}
                    size="small"
                    bordered
                    itemLayout="vertical" // Hiển thị danh sách theo chiều dọc
                    dataSource={movieData}
                    renderItem={(movie) => (
                        <List.Item
                            className={cx('item')}
                            onClick={() => handleSelectMovie(movie)}
                            style={{ cursor: 'pointer' }
                            }
                        >
                            <Typography.Text>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Typography.Text> {movie.original_name}
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
}

export default SearchMovie;
