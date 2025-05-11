package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.dto.response.MovieDetailResponse;
import carevn.luv2code.MovieNest.entity.*;
import carevn.luv2code.MovieNest.enums.Country;
import carevn.luv2code.MovieNest.enums.MovieType;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.mapper.MovieMapper;
import carevn.luv2code.MovieNest.repository.*;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class MovieServiceImpl implements MovieService {

    private static final Logger log = LoggerFactory.getLogger(MovieServiceImpl.class);

    private final MovieRepository movieRepository;

    private final GenresRepository genresRepository;

    private final TrailerRepository trailerRepository;

    private final CommentRepository commentRepository;

    private final UserMovieCollectionRepository userMovieCollectionRepository;

    private final MovieMapper movieMapper;
    private final UserRepository userRepository;

    public MovieServiceImpl(MovieRepository movieRepository,
                            GenresRepository genresRepository,
                            TrailerRepository trailerRepository,
                            CommentRepository commentRepository,
                            UserMovieCollectionRepository userMovieCollectionRepository,
                            MovieMapper movieMapper,
                            UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.genresRepository = genresRepository;
        this.trailerRepository = trailerRepository;
        this.commentRepository = commentRepository;
        this.userMovieCollectionRepository = userMovieCollectionRepository;
        this.movieMapper = movieMapper;
        this.userRepository = userRepository;
    }

    @Override
    public void save(MovieDTO movieDTO) {
        if (movieRepository.existsByTitle(movieDTO.getTitle())) {
            throw new AppException(ErrorCode.MOVIE_ALREADY_EXISTS);
        }

        Movie movie = movieMapper.toEntity(movieDTO);
        movie.setRuntime(movieDTO.getRuntime());
        movie.setDirector(movieDTO.getDirector());
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
    public MovieDTO findMovieById(UUID movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(
                () -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));
        MovieDTO movieDTO = movieMapper.toDto(movie);
        movieDTO.setCountry(movie.getCountry().toString());
//        movieDTO.setCollectedByUsersID(movie.getCollectedByUsers().stream().map(User::getId).collect(Collectors.toSet()));
        movieDTO.setGenres(movie.getGenres().stream().map(Genres::getId).collect(Collectors.toList()));
        movieDTO.setTrailers(movie.getTrailers().stream().map(Trailer::getId).collect(Collectors.toList()));
        movieDTO.setComments(movie.getComments().stream().map(Comment::getId).collect(Collectors.toList()));
        return movieDTO;
    }

    @Override
    public MovieDetailResponse getMovieDetail(UUID movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));

        MovieDetailResponse movieDetailResponse = new MovieDetailResponse();
        movieDetailResponse.setTitle(movie.getTitle());
        movieDetailResponse.setOverview(movie.getOverview());
        movieDetailResponse.setBackdropPath(movie.getBackdropPath());
        movieDetailResponse.setCountry(movie.getCountry().toString());
        movieDetailResponse.setVoteAverage(movie.getVoteAverage());
        movieDetailResponse.setGenres(movie.getGenres().stream().map(Genres::getId).collect(Collectors.toList()));
        movieDetailResponse.setComments(movie.getComments().stream().map(Comment::getId).collect(Collectors.toList()));

        return movieDetailResponse;
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

        movieMapper.updateMovieFromDto(movieDTO, movieExisted);

        if (movieDTO.getCountry() != null) movieExisted.setCountry(Country.valueOf(movieDTO.getCountry()));

        if (movieDTO.getGenres() != null) {
            List<Genres> genresList = genresRepository.findAllById(movieDTO.getGenres());
            movieExisted.setGenres(genresList);
        }

        if (movieDTO.getTrailers() != null) {
            List<Trailer> trailerList = trailerRepository.findAllById(movieDTO.getTrailers());

            for (Trailer oldTrailer : movieExisted.getTrailers()) {
                oldTrailer.setMovie(null);
            }

            for (Trailer trailer : trailerList) {
                trailer.setMovie(movieExisted);
            }

            movieExisted.setTrailers(trailerList);
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
    public void deleteMovie(UUID movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        movie.getGenres().clear();

        movie.getTrailers().clear();
//        movie.getComments().clear();

        movieRepository.delete(movie);
    }

    @Override
    public List<Movie> findMovieByCountry(Country country) {
        return movieRepository.findMoviesByCountry(country);
    }

    @Override
    public boolean checkMovieCollection(UUID movieId, UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));
            
        return userMovieCollectionRepository.existsByUserAndMovie(user, movie);
    }
}
