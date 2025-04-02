import React, { useEffect, useState } from 'react';
import { Card, Flex, Progress } from 'antd';
import styles from './CardInfo.module.scss';
import classNames from 'classnames/bind';
import { PlayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProgressOverlay from '../ProgressOverplay';

const cx = classNames.bind(styles);

function CardInfo({ movieResult, isTrailer }) {
    const { Meta } = Card;
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerURL, setTrailerURL] = useState('');

    const handleClickPlayButton = (movie) => {
        setTrailerURL(
            `https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`,
        );
        setShowTrailer(true);
    };

    const handleCloseTrailer = () => {
        setShowTrailer(false);
        // Dừng video bằng cách xóa URL
        setTrailerURL('');
    };

    const navigate = useNavigate();

    const handleMovieDetailClick = (id) => {
        navigate(`/movie/${id}`);
    };

    console.log('movieResult, ', movieResult);

    // Xử lý bấm ESC để đóng trailer
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && showTrailer) {
                handleCloseTrailer();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showTrailer]);

    return (
        <div className={cx('card-film')}>
            {movieResult.map((movie) => (
                <Card
                    key={movie.id}
                    hoverable
                    style={
                        isTrailer
                            ? { width: 300, height: 320, marginLeft: 15 }
                            : { width: 150, height: 320, marginLeft: 15 }
                    }
                    cover={
                        isTrailer ? (
                            <div className={cx('card-content')}>
                                <img
                                    alt={movie.title}
                                    src={`https://image.tmdb.org/t/p/w500${movie.image_path}`}
                                    style={{
                                        width: '100%',
                                        height: '225px',
                                        objectFit: 'cover',
                                        borderTopLeftRadius: '25px',
                                        borderTopRightRadius: '25px',
                                    }}
                                />
                                <div className={cx('play-icon')}>
                                    <button
                                        onClick={() =>
                                            handleClickPlayButton(movie)
                                        }
                                    >
                                        <PlayCircleOutlined
                                            className={cx('icon')}
                                        />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <img
                                alt={movie.title}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                style={{
                                    width: '150px',
                                    height: '225px',
                                    objectFit: 'cover',
                                    borderTopLeftRadius: '25px',
                                    borderTopRightRadius: '25px',
                                }}
                                onClick={() => handleMovieDetailClick(movie.id)}
                            />
                        )
                    }
                >
                    {isTrailer ? (
                        <></>
                    ) : (
                        // <div className={cx('progress-overlay')} >
                        //     <Flex wrap gap="small">
                        //         <Progress
                        //             type="circle"
                        //             percent={Math.min(Math.floor(movie.popularity), 100)}
                        //             size={35}
                        //             strokeColor='#21d07a'
                        //             trailColor='#1f4a29'
                        //         />
                        //     </Flex>
                        // </div>
                        // console.log('movie: ', movie)

                        <ProgressOverlay popularity={movie.vote_average} size={35}/>
                    )}
                    <Meta
                        className={cx('info')}
                        title={movie.title}
                        description={movie.release_date}
                    />
                </Card>
            ))}

            {showTrailer && (
                <>
                    {/* Lớp phủ mờ */}
                    <div
                        className={cx('overlay')}
                        onClick={handleCloseTrailer}
                    ></div>

                    {/* Container trailer */}
                    <div className={cx('trailer-container')}>
                        <div className={cx('trailer-wrapper')}>
                            <button
                                className={cx('close-button')}
                                onClick={handleCloseTrailer}
                            >
                                <CloseCircleOutlined />
                            </button>
                            <iframe
                                src={trailerURL}
                                title="Movie Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CardInfo;
