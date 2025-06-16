import React, { useEffect, useState } from 'react';
import { Card, Flex, Progress, message } from 'antd';
import styles from './CardInfo.module.scss';
import classNames from 'classnames/bind';
import { PlayCircleOutlined, CloseCircleOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProgressOverlay from '../ProgressOverplay';
import { getMovieImage } from '~/service/admin/uploadFile';
import { useAuth } from '~/routes/AuthContext';
import { createCollection, unCollect } from '~/service/user/user';
import { checkMovieCollection } from '~/service/user/movie';

const cx = classNames.bind(styles);

function CardInfo({ movieResult, isTrailer }) {
    const { Meta } = Card;
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerURL, setTrailerURL] = useState('');
    const [imageUrls, setImageUrls] = useState({});
    const { user } = useAuth();
    const currentUserId = user?.userId;
    const [movies, setMovies] = useState(movieResult);
    const [collectedMovies, setCollectedMovies] = useState({}); 

    useEffect(() => {
        setMovies(movieResult);
    }, [movieResult]);

    const handleClickPlayButton = (movie) => {
        console.log('trailer key: ', movie.key);
        setTrailerURL(
            `https://www.youtube.com/embed/${
                movie.trailer_key || movie.trailer_key
            }?autoplay=1`,
        );
        setShowTrailer(true);
    };

    const handleCloseTrailer = () => {
        setShowTrailer(false);
        setTrailerURL('');
    };

    const navigate = useNavigate();

    const handleMovieDetailClick = (id) => {
        navigate(`/movie/${id}`);
    };

    const handleCollectMovie = async (movieId) => {
        if (!currentUserId) {
            message.warning('Vui lòng đăng nhập để sưu tập phim!');
            return;
        }

        try {
            const isCurrentlyCollected = collectedMovies[movieId];
            if (!isCurrentlyCollected) {
                await createCollection(currentUserId, movieId);
            } else {
                await unCollect(currentUserId, movieId);
            }
            
            // Cập nhật trạng thái collect trong state
            setCollectedMovies(prev => ({
                ...prev,
                [movieId]: !isCurrentlyCollected
            }));
        } catch (error) {
            console.error('Error toggling collection:', error);
        }
    };

    useEffect(() => {
        const loadImages = async () => {
            const imagePromises = movieResult.map(async (movie) => {
                let imagePath = isTrailer
                    ? movie.backdropPath
                    : movie.posterPath;

                if (!imagePath) {
                    return {
                        id: movie.id,
                        url: '/images/default-movie-poster.jpg',
                    };
                }

                // Kiểm tra nếu đã là URL đầy đủ
                if (
                    imagePath &&
                    (imagePath.startsWith('http://') ||
                        imagePath.startsWith('https://'))
                ) {
                    return { id: movie.id, url: imagePath };
                }

                // Kiểm tra nếu là đường dẫn TMDB
                if (imagePath && !imagePath.includes('/api/')) {
                    return {
                        id: movie.id,
                        url: `https://image.tmdb.org/t/p/w500${imagePath}`,
                    };
                }

                // Lấy ảnh từ máy chủ local nếu là đường dẫn lưu trữ nội bộ
                if (imagePath) {
                    try {
                        const imgUrl = await getMovieImage(imagePath);
                        return { id: movie.id, url: imgUrl };
                    } catch (error) {
                        console.error(
                            `Lỗi tải ảnh cho movie ${movie.id}:`,
                            error,
                        );
                    }
                }

                // Trả về ảnh mặc định nếu không tìm thấy
                return {
                    id: movie.id,
                    url: '/images/default-movie-poster.jpg',
                };
            });

            const loadedImages = await Promise.all(imagePromises);

            // Chuyển mảng kết quả thành object với key là movie.id và value là URL
            const newImageUrls = {};
            loadedImages.forEach((item) => {
                newImageUrls[item.id] = item.url;
            });

            setImageUrls(newImageUrls);
        };

        if (movieResult && movieResult.length > 0) {
            loadImages();
        }
    }, [movieResult, isTrailer]);

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

    // useEffect để check trạng thái collect của từng phim
    useEffect(() => {
        const checkCollectionStatus = async () => {
            if (!currentUserId) return;

            const statusMap = {};
            for (const movie of movies) {
                try {
                    const isCollected = await checkMovieCollection(movie.id, currentUserId);
                    statusMap[movie.id] = isCollected;
                } catch (error) {
                    console.error(`Error checking collection status for movie ${movie.id}:`, error);
                    statusMap[movie.id] = false;
                }
            }
            setCollectedMovies(statusMap);
        };

        checkCollectionStatus();
    }, [currentUserId, movies]);

    return (
        <div className={cx('card-film')}>
            {Array.isArray(movies) &&
                movies.map((movie) => (
                    <Card
                        key={movie.id}
                        hoverable
                        style={
                            isTrailer
                                ? {
                                      width: 300,
                                      height: 320,
                                      marginLeft: 15,
                                      flexShrink: 0,
                                  }
                                : {
                                      width: 150,
                                      height: 320,
                                      marginLeft: 15,
                                      flexShrink: 0,
                                  }
                        }
                        cover={
                            isTrailer ? (
                                <div className={cx('card-content')}>
                                    <img
                                        alt={movie.title}
                                        src={
                                            imageUrls[movie.id] ||
                                            '/images/loading-placeholder.gif'
                                        }
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
                                <div className={cx('card-content')}>
                                    <img
                                        alt={movie.title}
                                        src={
                                            imageUrls[movie.id] ||
                                            '/images/loading-placeholder.gif'
                                        }
                                        style={{
                                            width: '150px',
                                            height: '225px',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '25px',
                                            borderTopRightRadius: '25px',
                                        }}
                                        onClick={() =>
                                            handleMovieDetailClick(movie.id)
                                        }
                                    />
                                    <div className={cx('button-container')}>
                                        <Progress
                                            type="circle"
                                            percent={Math.round(movie.voteAverage * 10)}
                                            width={35}
                                            strokeWidth={8}
                                            strokeColor="#52c41a"
                                        />
                                        <button 
                                            className={cx('collect-button', { 
                                                collected: collectedMovies[movie.id] 
                                            })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCollectMovie(movie.id);
                                            }}
                                        >
                                            {collectedMovies[movie.id] ? <HeartFilled /> : <HeartOutlined />}
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    >
                        <Meta
                            className={cx('info')}
                            title={movie.title}
                            description={
                                movie.releaseDate
                                    ? new Date(
                                          movie.releaseDate ||
                                              movie.release_date,
                                      ).toLocaleDateString('vi-VN')
                                    : ''
                            }
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
