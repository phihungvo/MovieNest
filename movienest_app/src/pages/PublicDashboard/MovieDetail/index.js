import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MovieDetail.module.scss';
import { getMovieImage } from '~/service/admin/uploadFile';
import { findMovieById } from '~/service/user/movie';
// Import các API service để lấy chi tiết phim
// import { getMovieDetail } from '~/service/movie';

const cx = classNames.bind(styles);

function MovieDetail() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchMovieDetail = async () => {
            setLoading(true);
            try {
                // Gọi API để lấy chi tiết phim
                // const response = await getMovieDetail(movieId);
                // setMovie(response.data);

                // Phần này sẽ cần thay thế bằng API thực tế của bạn
                // Đây chỉ là dữ liệu mẫu
                const mockData = {
                    id: movieId,
                    title: `Phim ${movieId}`,
                    overview: 'Mô tả chi tiết về bộ phim...',
                    releaseDate: '2023-04-23',
                    posterPath: '/images/default-movie-poster.jpg',
                    backdropPath: '/images/default-movie-backdrop.jpg',
                    voteAverage: 8.5,
                    genres: ['Hành động', 'Phiêu lưu'],
                    runtime: 120,
                    trailer_key: 'abc123',
                };

                const movieData = await findMovieById(movieId);

                console.log('response movie detail page: ', movieData);

                const mockData2 = {
                    ...mockData,
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
                };

                setMovie(mockData2);

                // Load hình ảnh nếu cần
                if (mockData.posterPath) {
                    try {
                        // Nếu là URL đầy đủ
                        if (
                            mockData.posterPath.startsWith('http://') ||
                            mockData.posterPath.startsWith('https://')
                        ) {
                            setImageUrl(mockData.posterPath);
                        }
                        // Nếu là đường dẫn TMDB
                        else if (!mockData.posterPath.includes('/api/')) {
                            setImageUrl(
                                `https://image.tmdb.org/t/p/w500${mockData.posterPath}`,
                            );
                        }
                        // Nếu là đường dẫn local
                        else {
                            const imgUrl = await getMovieImage(
                                mockData.posterPath,
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
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchMovieDetail();
        }
    }, [movieId]);

    if (loading) {
        return <div className={cx('loading')}>Đang tải thông tin phim...</div>;
    }

    if (!movie) {
        return (
            <div className={cx('error')}>Không tìm thấy thông tin phim!</div>
        );
    }

    return (
        <div className={cx('movie-detail')}>
            <div
                className={cx('backdrop')}
                style={{ backgroundImage: `url(${movie.backdropPath})` }}
            >
                <div className={cx('overlay')}></div>
            </div>

            <div className={cx('content')}>
                <div className={cx('poster')}>
                    <img
                        src={imageUrl || '/images/default-movie-poster.jpg'}
                        alt={movie.title}
                    />
                </div>

                <div className={cx('info')}>
                    <h1 className={cx('title')}>{movie.title}</h1>

                    <div className={cx('meta')}>
                        <span className={cx('release-date')}>
                            {movie.releaseDate}
                        </span>
                        <span className={cx('runtime')}>
                            {movie.runtime} phút
                        </span>
                        <div className={cx('genres')}>
                            {movie.genres?.map((genre, index) => (
                                <span key={index} className={cx('genre')}>
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={cx('rating')}>
                        <span className={cx('vote')}>
                            {movie.voteAverage?.toFixed(1)}
                        </span>
                    </div>

                    <div className={cx('overview')}>
                        <h3>Nội dung phim</h3>
                        <p>{movie.overview}</p>
                    </div>

                    {movie.trailer_key && (
                        <div className={cx('trailer')}>
                            <button className={cx('trailer-button')}>
                                Xem Trailer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;
