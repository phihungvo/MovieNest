import {
    getMovieToday,
    getPopularMovie,
    getPopularMovieTrailers,
    getInThreatersMovieTrailers,
    getVietnameMovieTrailers,
    getMovieInWeek,
} from '~/service/user/home';
import {
    findAllKoreanMovies,
    findAllVietnamMovies,
} from '~/service/admin/movie';
import classNames from 'classnames/bind';
import styles from './UserHome.module.scss';
import Header from '../component/Header';
import Poster from '../component/Poster';
import { getDetailtMovie } from '~/service/user/home';

const cx = classNames.bind(styles);

function UserHome() {
    const fetchTrendingMovies = async (state) => {
        return state === 'Today'
            ? await getMovieToday()
            : await getMovieInWeek();
    };

    const fetchPopularMovies = async () => {
        return await getPopularMovie();
    };

    const fetchTrailerMovies = async (state) => {
        const data =
            state === 'Popular'
                ? await getPopularMovieTrailers()
                : await getInThreatersMovieTrailers();
        return data;
    };

    const fetchKoreanMovies = async () => {
        const data = await findAllKoreanMovies();
        return data;
    };

    const fetchVietnamMovies = async () => {
        const data = await getVietnameMovieTrailers();
        return data;
    };

    const handleCallDetailMovie = async () => {
        await getDetailtMovie(99861);
    };

    return (
        <>
            <Header />
            <div className={cx('banner')}>
                <div className={cx('content-inner')}>
                    <h1>Welcome.</h1>
                    <h2>
                        Millions of movies, TV shows and people to discover.
                        Explore now.
                    </h2>
                    <div className={cx('search-inp')}>
                        <input placeholder="Search for a movie, tv show, person......" />
                        <button>Search</button>
                    </div>
                </div>
            </div>

            <Poster
                title="Trending Movies"
                options={['Today', 'This Week']}
                fetchData={fetchTrendingMovies}
                defaultValue="Today"
            />

            <Poster
                title="Lasted Trailers"
                options={['Popular', 'In Theaters']}
                fetchData={fetchTrailerMovies}
                defaultValue="Popular"
                isTrailer={true}
            />

            <Poster
                title="Vietnam Movies"
                options={[]}
                fetchData={fetchVietnamMovies}
                isTrailer={true}
            />

            <Poster
                title="Popular Movies"
                options={[]}
                fetchData={fetchPopularMovies}
                // isTrailer={false}
            />

            <Poster
                title="Korean Movies"
                options={[]}
                fetchData={fetchKoreanMovies}
                isTrailer={true}
            />

            {/*         

            <CommentList /> */}
            {/* <SkeletonComponent /> */}
        </>
    );
}

export default UserHome;
