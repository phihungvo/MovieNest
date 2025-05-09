import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MovieDetail.module.scss';
import { getMovieImage } from '~/service/admin/uploadFile';
import { findMovieById } from '~/service/user/movie';
import {
    CaretRightOutlined,
    HeartOutlined,
    PlayCircleOutlined,
    ShareAltOutlined,
    StarOutlined,
    WhatsAppOutlined,
} from '@ant-design/icons';
import Poster from '../component/Poster';
import { getAllActorNoPaging } from '~/service/admin/actor';
import Header from '../component/Header';
import {CommentList} from '~/components/Layout/components/CommentList';
import { getAllComments } from '~/service/admin/comment';
import { useAuth } from '~/routes/AuthContext';
import { collectMovie, findCollectedMoviesByUserId } from '~/service/user/user';

const cx = classNames.bind(styles);

function MovieDetail() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [tabState, setTabState] = useState(0);
    const [comments, setComments] = useState([]);
    const { user } = useAuth();
    const currentUserId = user?.userId;

    const handleCallGetCollection = async () => {
        await findCollectedMoviesByUserId(currentUserId);
    }

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const movieData = await findMovieById(movieId);

                const processedData = {
                    id: movieId,
                    title: movieData.title,
                    overview: movieData.overview,
                    releaseDate: new Date(
                        movieData.releaseDate,
                    ).toLocaleDateString('vi-VN'),
                    posterPath: movieData.posterPath,
                    backdropPath: movieData.backdropPath,
                    voteAverage: movieData.voteAverage,
                    genres:
                        movieData.genres && movieData.genres.length > 0
                            ? movieData.genres.map((genre) => genre.name)
                            : [],
                    runtime: movieData.runtime,
                    trailer_key: 'abc123',
                    director: movieData.director || 'Chưa cập nhật',
                    actors: movieData.actors || ['Chưa cập nhật'],
                    episodeCount: movieData.episodeCount || 0,
                    year:
                        new Date(movieData.releaseDate).getFullYear() || 'N/A',
                    country: movieData.country || 'Chưa cập nhật',
                    rating: movieData.voteAverage || 0,
                };

                setMovie(processedData);

                if (movieData.posterPath) {
                    try {
                        if (
                            movieData.posterPath.startsWith('http://') ||
                            movieData.posterPath.startsWith('https://')
                        ) {
                            setImageUrl(movieData.posterPath);
                        }
                        else {
                            const imgUrl = await getMovieImage(
                                movieData.posterPath,
                            );
                            setImageUrl(imgUrl);
                        }
                    } catch (error) {
                        console.error('Lỗi khi tải hình ảnh phim:', error);
                        setImageUrl('/images/default-movie-poster.jpg');
                    }
                }
            } catch (error) {
                console.error('Lỗi khi tải chi tiết phim:', error);
            }
        };

        if (movieId) {
            fetchMovieDetail();
        }
    }, [movieId]);

    useEffect(() => {
        const fetchComments = async () => {
            if (tabState === 3) {
                const response = await getAllComments({ page: 0, pageSize: 5 });
                setComments(response?.content || []);
            }
        };
    
        fetchComments();
        handleCallGetCollection();
    }, [tabState]);

    
    if (!movie) {
        return (
            <div className={cx('error')}>Không tìm thấy thông tin phim!</div>
        );
    }

    const handleCollectMovie = async () => {
        await collectMovie(currentUserId, movieId);
    }

   

    const optionTabs = [
        'Chọn tập',
        'Diễn viên',
        'Đề xuất cho bạn',
        'Bình luận',
    ];
    const buttonOptions = [
        {
            title: 'Chiếu phát',
            icon: <CaretRightOutlined />,
        },
        {
            title: 'Chia sẻ',
            icon: <ShareAltOutlined />,
        },
        {
            title: 'APP',
            icon: <WhatsAppOutlined />,
        },
        {
            title: 'Sưu tập',
            icon: <HeartOutlined />,
            onClick: handleCollectMovie
        },
    ];

    const handleCallAllActors = async () => {
        return await getAllActorNoPaging();
    };

    const handleGetAllComments = async () => {
        const response = await getAllComments();
        console.log('comment response: ',response)
    }

    const renderTabContent = () => {
        switch (tabState) {
            case 0:
                return <div>Danh sách tập phim sẽ hiển thị ở đây.</div>;
            case 1:
                return (
                    <div className={cx('actor-list')}>
                        Danh sách diễn viên sẽ hiển thị ở đây.
                        {/* <Poster
                            options={[]}
                            fetchData={handleCallAllActors}
                            cardInfo={false}
                        /> */}
                    </div>
                );
            case 2:
                return <div>Phim đề xuất cho bạn sẽ hiển thị ở đây.</div>;
            case 3:
                return <CommentList movieId={movieId} userId={currentUserId}/>;
            default:
                return null;
        }
    };

    return (
        <>
            <Header activeSearch={false} />

            <div className={cx('movie-detail-container')}>
                <div className={cx('backdrop-container')}>
                    <div
                        className={cx('backdrop-image')}
                        style={{
                            backgroundImage: `url(${movie.backdropPath})`,
                        }}
                    ></div>
                    <div className={cx('backdrop-gradient')}></div>
                </div>

                <div className={cx('content-container')}>
                    <div className={cx('movie-header')}>
                        <h1 className={cx('movie-title')}>{movie.title}</h1>

                        <div className={cx('movie-stats')}>
                            <span className={cx('rating')}>
                                <StarOutlined />
                                {movie.rating.toFixed(1)}
                            </span>
                            {movie.year && (
                                <span className={cx('stat-item')}>
                                    | {movie.year}
                                </span>
                            )}
                            {movie.episodeCount > 0 && (
                                <span className={cx('stat-item')}>
                                    | {movie.episodeCount} tập
                                </span>
                            )}
                        </div>

                        <div className={cx('movie-tags')}>
                            {movie.country && (
                                <span className={cx('tag')}>
                                    {movie.country}
                                </span>
                            )}
                            {movie.genres?.map((genre, index) => (
                                <span key={index} className={cx('tag')}>
                                    {genre}
                                </span>
                            ))}
                        </div>

                        <div className={cx('crew-info')}>
                            <div className={cx('crew-item')}>
                                <span className={cx('crew-label')}>
                                    Đạo diễn:{' '}
                                </span>
                                <span className={cx('crew-value')}>
                                    {movie.director}
                                </span>
                            </div>
                            <div className={cx('crew-item')}>
                                <span className={cx('crew-label')}>
                                    Diễn viên chính:{' '}
                                </span>
                                <span className={cx('crew-value')}>
                                    {Array.isArray(movie.actors)
                                        ? movie.actors.join(', ')
                                        : movie.actors}
                                </span>
                            </div>
                        </div>

                        <div className={cx('movie-description')}>
                            {movie.overview}
                        </div>

                        <div className={cx('action-buttons')}>
                            {buttonOptions.map((item, index) => (
                                <button
                                    className={cx(
                                        'btn',
                                        index === 0
                                            ? 'btn-primary'
                                            : 'btn-secondary',
                                    )}
                                    key={index}
                                    onClick={item.onClick}
                                >
                                    {item.icon}
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={cx('movie-tabs')}>
                        {optionTabs.map((tab, index) => (
                            <div
                                key={index}
                                className={cx('tab', {
                                    active: tabState === index,
                                })}
                                onClick={() => setTabState(index)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                    <div className={cx('movie-tab-content')}>
                        <div>{renderTabContent()}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MovieDetail;
