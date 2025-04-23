import React, { useEffect, useState } from 'react';
import { Card, Flex, Progress } from 'antd';
import styles from './CardInfo.module.scss';
import classNames from 'classnames/bind';
import { PlayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProgressOverlay from '../ProgressOverplay';
import { getMovieImage } from '~/service/admin/uploadFile';

const cx = classNames.bind(styles);

function CardInfo({ movieResult, isTrailer }) {
    const { Meta } = Card;
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerURL, setTrailerURL] = useState('');
    const [imageUrls, setImageUrls] = useState({});

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
        // Dừng video bằng cách xóa URL
        setTrailerURL('');
    };

    const navigate = useNavigate();

    const handleMovieDetailClick = (id) => {
        navigate(`/movie/${id}`);
    };

    useEffect(() => {
        const loadImages = async () => {
            // setLoading(true);

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

    return (
        <div className={cx('card-film')}>
            {Array.isArray(movieResult) && movieResult.map((movie) => (
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

                        <ProgressOverlay
                            popularity={movie.voteAverage}
                            size={35}
                        />
                    )}
                    <Meta
                        className={cx('info')}
                        title={movie.title}
                        description={movie.releaseDate || movie.release_date}
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
