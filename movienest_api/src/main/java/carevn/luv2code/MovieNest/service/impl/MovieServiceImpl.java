package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Comment;
import carevn.luv2code.MovieNest.entity.Genres;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.Trailer;
import carevn.luv2code.MovieNest.enums.Country;
import carevn.luv2code.MovieNest.enums.MovieType;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.repository.CommentRepository;
import carevn.luv2code.MovieNest.repository.GenresRepository;
import carevn.luv2code.MovieNest.repository.MovieRepository;
import carevn.luv2code.MovieNest.repository.TrailerRepository;
import carevn.luv2code.MovieNest.service.MovieService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class MovieServiceImpl implements MovieService {

    private static final Logger log = LoggerFactory.getLogger(MovieServiceImpl.class);

    private final MovieRepository movieRepository;

    private final GenresRepository genresRepository;

    private final TrailerRepository trailerRepository;

    private final CommentRepository commentRepository;

    public MovieServiceImpl(MovieRepository movieRepository,
                            GenresRepository genresRepository,
                            TrailerRepository trailerRepository,
                            CommentRepository commentRepository
    ) {
        this.movieRepository = movieRepository;
        this.genresRepository = genresRepository;
        this.trailerRepository = trailerRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public void save(MovieDTO movieDTO) {
        if (movieRepository.existsByTitle(movieDTO.getTitle())) {
            throw new AppException(ErrorCode.MOVIE_ALREADY_EXISTS);
        }

        Movie movie = new Movie();
        movie.setTitle(movieDTO.getTitle());
        movie.setOverview(movieDTO.getOverview());
        movie.setReleaseDate(movieDTO.getReleaseDate());
        movie.setPosterPath(movieDTO.getPosterPath());
        movie.setBackdropPath(movieDTO.getBackdropPath());
        if (movieDTO.getVoteAverage() != null) movie.setVoteAverage(movieDTO.getVoteAverage());
        if (movieDTO.getPopular() != null) movie.setPopular(movieDTO.getPopular());
        if (movieDTO.getInTheater() != null) movie.setInTheater(movieDTO.getInTheater());
        if (movieDTO.getVoteCount() != null) movie.setVoteCount(movieDTO.getVoteCount());
        if (movieDTO.getAdult() != null) movie.setAdult(movieDTO.getAdult());
        if (movieDTO.getPopularity() != null) movie.setPopularity(movieDTO.getPopularity());
        movie.setCountry(Country.valueOf(movieDTO.getCountry()));

        if (movieDTO.getGenres() != null && !movieDTO.getGenres().isEmpty()) {
            List<Genres> genresList = genresRepository.findAllById(movieDTO.getGenres());
            movie.setGenres(genresList);
        }

        if (movieDTO.getTrailers() != null && !movieDTO.getTrailers().isEmpty()) {
            List<Trailer> trailerList = trailerRepository.findAllById(movieDTO.getTrailers());
            for (Trailer trailer : trailerList) {
                trailer.setMovie(movie);
            }
            movie.setTrailers(trailerList);
        }

        movieRepository.save(movie);
    }


    @Override
    public List<Movie> searchMovieByTitle(String keyWord) {
        List<Movie> movies = new ArrayList<>();
        movies = movieRepository.searchMovie(keyWord);
        log.info("Found {} movies", movies.size());
        return movies;
    }


    @Override
    public Page<Movie> findAllMovies(int page, int size, String keyWord) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> moviePage;

        if (keyWord != null && !keyWord.trim().isEmpty()) {
            moviePage = movieRepository.findByTitleContainingIgnoreCase(keyWord, pageable);
        } else {
            moviePage = movieRepository.findAll(pageable);
        }

        return moviePage;
    }

    @Override
    public Movie findMovieById(UUID movieId) {
        return movieRepository.findById(movieId).orElseThrow(
                () -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));
    }

    @Override
    public List<Movie> findAllNoPaging() {
        return movieRepository.findAll();
    }

    @Override
    public List<Movie> getMoviesToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        Date startDate = java.sql.Timestamp.valueOf(startOfDay);
        Date endDate = java.sql.Timestamp.valueOf(endOfDay);

        return movieRepository.findByReleaseDateBetween(startDate, endDate);
    }

    @Override
    public List<Movie> getMoviePopular() {
        List<Movie> moviePopular = new ArrayList<>();
        moviePopular = movieRepository.findTop15ByPopularTrue();
        return moviePopular;
    }

    @Override
    public List<Movie> getMovieInTheater() {
        List<Movie> movieInTheater = new ArrayList<>();
        movieInTheater = movieRepository.findTop15ByInTheaterTrue();
        return movieInTheater;
    }

    @Override
    public List<Movie> getMoviesThisWeek() {
        LocalDate startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        Date from = java.sql.Date.valueOf(startOfWeek);
        Date to = java.sql.Date.valueOf(endOfWeek);

        return movieRepository.findByReleaseDateBetween(from, to);
    }

    @Override
    public Movie updateMovie(UUID id, MovieDTO movieDTO) {
        Movie movieExisted = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));

        movieExisted.setTitle(movieDTO.getTitle());
        movieExisted.setOverview(movieDTO.getOverview());
        movieExisted.setReleaseDate(movieDTO.getReleaseDate());
        movieExisted.setPosterPath(movieDTO.getPosterPath());
        movieExisted.setBackdropPath(movieDTO.getBackdropPath());
        if (movieDTO.getVoteAverage() != null) movieExisted.setVoteAverage(movieDTO.getVoteAverage());
        if (movieDTO.getPopular() != null) movieExisted.setPopular(movieDTO.getPopular());
        if (movieDTO.getInTheater() != null) movieExisted.setInTheater(movieDTO.getInTheater());
        if (movieDTO.getVoteCount() != null) movieExisted.setVoteCount(movieDTO.getVoteCount());
        if (movieDTO.getAdult() != null) movieExisted.setAdult(movieDTO.getAdult());
        if (movieDTO.getPopularity() != null) movieExisted.setPopularity(movieDTO.getPopularity());
        if (movieDTO.getCountry() != null) movieExisted.setCountry(Country.valueOf(movieDTO.getCountry()));

        if (movieDTO.getGenres() != null) {
            List<Genres> genresList = genresRepository.findAllById(movieDTO.getGenres());
            movieExisted.setGenres(genresList);
        }

        if (movieDTO.getTrailers() != null) {
            movieExisted.getTrailers().clear();

            List<Trailer> trailerList = trailerRepository.findAllById(movieDTO.getTrailers());
//            movieExisted.setTrailers(trailerList);
            for (Trailer trailer : trailerList) {
                trailer.setMovie(movieExisted);
                movieExisted.getTrailers().add(trailer);
            }
        }

        if (movieDTO.getComments() != null && !movieDTO.getComments().isEmpty()) {
            List<Comment> commentList = commentRepository.findAllById(movieDTO.getComments());
            for (Comment comment : commentList) {
                comment.setMovie(movieExisted);
            }
            movieExisted.setComments(commentList);
        }

        return movieRepository.save(movieExisted);
    }

    @Override
    @Transactional
    public boolean deleteMovie(UUID movieId) {
        movieRepository.deleteById(movieId);
        return true;
    }

    @Override
    public List<Movie> findMovieByCountry(Country country) {
        return movieRepository.findMoviesByCountry(country);
    }
}
