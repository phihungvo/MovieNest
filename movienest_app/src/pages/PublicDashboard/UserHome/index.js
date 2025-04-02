import {
    getMovieToday,
    getPopularMovie,
    getPopularMovieTrailers,
    getInThreatersMovieTrailers,
    getMovieInWeek,
} from '~/service/user/home';
import classNames from 'classnames/bind';
import styles from './UserHome.module.scss';
import Header from '../component/Header';
import Poster from '../component/Poster';
import SkeletonComponent from '../component/Skeleton';
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
        // return state === "Popular" ? await getPopularMovieTrailers() : await getInThreatersMovieTrailers();
        const data =
            state === 'Popular'
                ? await getPopularMovieTrailers()
                : await getInThreatersMovieTrailers();
        console.log('Trailer data:', data); // Add this line to inspect the data
        return data;
    };
    //const movieId = 99861;

    const handleCallDetailMovie = async () => {
        const data = await getDetailtMovie(99861);
        console.log('Movie detail data: ', data);
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
                // isTrailer={false}
            />

            <Poster
                title="Lasted Trailers"
                options={['Popular', 'In Theaters']}
                fetchData={fetchTrailerMovies}
                defaultValue="Popular"
                isTrailer={true}
            />

            <Poster
                title="Popular Movies"
                options={[]}
                fetchData={fetchPopularMovies}
                // isTrailer={false}
            />

            <div>
                <button onClick={handleCallDetailMovie()}>Call api</button>
            </div>
            <SkeletonComponent />
        </>
    );
}

export default UserHome;
