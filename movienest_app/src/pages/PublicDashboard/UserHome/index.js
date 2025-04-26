import {
    getMovieToday,
    getPopularMovie,
    getPopularMovieTrailers,
    getInThreatersMovieTrailers,
    getVietnameMovieTrailers,
    getMovieInWeek,
} from '~/service/user/home';
import { ArrowUpOutlined } from '@ant-design/icons';
import {
    findAllKoreanMovies,
    findAllVietnamMovies,
} from '~/service/admin/movie';
import classNames from 'classnames/bind';
import styles from './UserHome.module.scss';
import Header from '../component/Header';
import Poster from '../component/Poster';
import { getDetailtMovie } from '~/service/user/home';
import { getAllActorNoPaging } from '~/service/admin/actor';
import MovieBanner from './banner';
import AppFooter from '../component/Footer';

const cx = classNames.bind(styles);

function UserHome() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

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

    const handleCallAllActors = async () => {
        return await getAllActorNoPaging();
    };

    return (
        <>
            <Header />

            <MovieBanner />

            <Poster
                title="Trending Movies"
                options={['This Week', 'Today']}
                fetchData={fetchTrendingMovies}
                defaultValue="This Week"
                cardInfo={true}
            />

            <Poster
                title="Lasted Trailers"
                options={['Popular', 'In Theaters']}
                fetchData={fetchTrailerMovies}
                defaultValue="Popular"
                isTrailer={true}
                cardInfo={true}
            />

            <Poster
                title="Vietnam Movies"
                options={[]}
                fetchData={fetchVietnamMovies}
                isTrailer={true}
                cardInfo={true}
            />

            <Poster
                title="Popular Movies"
                options={[]}
                fetchData={fetchPopularMovies}
                // isTrailer={false}
                cardInfo={true}
            />

            <Poster
                title="Korean Movies"
                options={[]}
                fetchData={fetchKoreanMovies}
                isTrailer={true}
                cardInfo={true}
            />

            <Poster
                title="Famous Actor"
                options={[]}
                fetchData={handleCallAllActors}
                cardInfo={false}
            />

            <AppFooter />
        </>
    );
}

export default UserHome;
