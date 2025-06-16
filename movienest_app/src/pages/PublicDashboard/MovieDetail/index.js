import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MovieDetail.module.scss';
import { getMovieImage } from '~/service/admin/uploadFile';
import { checkMovieCollection, findMovieById, movieDetail } from '~/service/user/movie';
import { message } from 'antd';
import {
    CaretRightOutlined,
    HeartOutlined,
    PlayCircleOutlined,
    ShareAltOutlined,
    StarOutlined,
    WhatsAppOutlined,
    HeartFilled,
} from '@ant-design/icons';
import Poster from '../component/Poster';
import { getAllActorNoPaging } from '~/service/admin/actor';
import Header from '../component/Header';
import {CommentList} from '~/components/Layout/components/CommentList';
import { getAllComments } from '~/service/admin/comment';
import { useAuth } from '~/routes/AuthContext';
import { createCollection, findCollectedMoviesByUserId, unCollect } from '~/service/user/user';
import { getAllGenres, getGenresByMovieId } from '~/service/admin/genres';

const cx = classNames.bind(styles);

// Add MovieDetail type definition
const MovieDetailType = {
    id: '',
    title: '',
    overview: '',
    releaseDate: '',
    posterPath: '',
    backdropPath: '',
    voteAverage: 0,
    genres: [],
    runtime: 0,
    director: '',
    actors: [],
    episodeCount: 0,
    country: '',
    collected: false,
    rating: 0,
    year: 'N/A'
};

function MovieDetail() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(MovieDetailType);
    const [imageUrl, setImageUrl] = useState('');
    const [tabState, setTabState] = useState(0);
    const [comments, setComments] = useState([]);
    const { user } = useAuth();
    const currentUserId = user?.userId;

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const [movieData, collectionStatus, genresSource] = await Promise.all([
                    movieDetail(movieId),
                    currentUserId ? checkMovieCollection(movieId, currentUserId) : Promise.resolve(false),
                    getGenresByMovieId(movieId)
                ])
                
                setMovie({
                    ...MovieDetailType,
                    ...movieData,
                    id: movieId,
                    releaseDate: movieData?.releaseDate ? new Date(movieData.releaseDate).toLocaleDateString('vi-VN') : '',
                    year: movieData?.releaseDate ? new Date(movieData.releaseDate).getFullYear() : 'N/A',
                    rating: movieData?.voteAverage || 0,
                    collected: collectionStatus,
                    actors: movieData?.actors || [],
                    director: movieData?.director || 'Chưa cập nhật',
                    genres: genresSource?.map(genre => genre.name) || [],
                    country: movieData?.country || 'Chưa cập nhật'
                });

                if (movieData.posterPath) {
                    setImageUrl(movieData.posterPath.startsWith('http') 
                        ? movieData.posterPath 
                        : await getMovieImage(movieData.posterPath));
                }
            } catch (error) {
                console.error('Lỗi khi tải chi tiết phim:', error);
            }
        };

        if (movieId) {  
            fetchMovieDetail();
        }
    }, [movieId, currentUserId]);

    const handleCollectMovie = async () => {
        if (!currentUserId) {
            message.warning('Vui lòng đăng nhập để sưu tập phim!');
            return;
        }

        try {
            if (!movie.collected) {
                await createCollection(currentUserId, movieId);
            } else {
                await unCollect(currentUserId, movieId);
            }
            setMovie(prev => ({...prev, collected: !prev.collected}));
        } catch (error) {
            console.error('Error toggling collection:', error);
            message.error('Có lỗi xảy ra khi thực hiện thao tác!');
        }
    };

    
    if (!movie) {
        return (
            <div className={cx('error')}>Không tìm thấy thông tin phim!</div>
        );
    }

    const optionTabs = [
        'Chọn tập',
        'Diễn viên',
        'Đề xuất cho bạn',
        'Bình luận',
    ];

    const buttonOptions = [
        {
            title: 'Xem phim',
            icon: <PlayCircleOutlined />,
        },
        {
            title: movie.collected ? 'Đã sưu tập' : 'Sưu tập',
            icon: movie.collected ? <HeartFilled style={{ color: '#ff6b00' }} /> : <HeartOutlined />,
            onClick: handleCollectMovie,
        },
    ];

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
                                {(movie?.rating || 0).toFixed(1)}
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
