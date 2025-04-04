package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Comment;
import carevn.luv2code.MovieNest.entity.Genres;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.Trailer;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.mapper.MovieMapper;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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

        if(movieRepository.existsByTitle(movieDTO.getTitle())){
            throw new AppException(ErrorCode.MOVIE_ALREADY_EXISTS);
        }

        // Tạo Movie entity và ánh xạ dữ liệu từ MovieDTO
        Movie movie = new Movie();
        movie.setTitle(movieDTO.getTitle());
        movie.setOverview(movieDTO.getOverview());
        movie.setReleaseDate(movieDTO.getReleaseDate());
        movie.setPosterPath(movieDTO.getPosterPath());
        movie.setBackdropPath(movieDTO.getBackdropPath());
        movie.setPopular(movieDTO.isPopular());
        movie.setInTheater(movieDTO.isInTheater());
        movie.setVoteAverage(movieDTO.getVoteAverage());
        movie.setVoteCount(movieDTO.getVoteCount());
        movie.setAdult(movieDTO.isAdult());
        movie.setPopularity(movieDTO.getPopularity());

        if (movieDTO.getGenres() != null && !movieDTO.getGenres().isEmpty()) {
            List<Genres> genresList = genresRepository.findAllById(movieDTO.getGenres());
            movie.setGenres(genresList);
        }

        if (movieDTO.getTrailers() != null && !movieDTO.getTrailers().isEmpty()) {
            List<Trailer> trailerList = trailerRepository.findAllById(movieDTO.getTrailers());
            movie.setTrailers(trailerList);
        }

//        if (movieDTO.getComments() != null && !movieDTO.getComments().isEmpty()) {
//            List<Comment> commentList = commentRepository.findAllById(movieDTO.getComments());
//            movie.setComments(commentList);
//        }

        movieRepository.save(movie);
        log.info("Saved movie: {}", movie.getTitle());
    }


    @Override
    public List<Movie> searchMovieByTitle(String keyWord) {
        List<Movie> movies = new ArrayList<>();
        movies = movieRepository.searchMovie(keyWord);
        log.info("Found {} movies", movies.size());
        return movies;
    }

    @Override
    public Page<Movie> findAllMovies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> pageMovies = movieRepository.findAll(pageable);
        return pageMovies;
    }

    @Override
    public List<Movie> findAllNoPaging() {
        return movieRepository.findAll();
    }

    @Override
    public Movie updateMovie(UUID id, MovieDTO movieDTO) {
        Movie movieExisted = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));

//        if(movieRepository.existsByTitle(movieDTO.getTitle())){
//            throw new AppException(ErrorCode.MOVIE_ALREADY_EXISTS);
//        }

        movieExisted.setTitle(movieDTO.getTitle());
        movieExisted.setOverview(movieDTO.getOverview());
        movieExisted.setReleaseDate(movieDTO.getReleaseDate());
        movieExisted.setPosterPath(movieDTO.getPosterPath());
        movieExisted.setBackdropPath(movieDTO.getBackdropPath());
        movieExisted.setVoteAverage(movieDTO.getVoteAverage());
        movieExisted.setPopular(movieDTO.isPopular());
        movieExisted.setInTheater(movieDTO.isInTheater());
        movieExisted.setVoteCount(movieDTO.getVoteCount());
        movieExisted.setAdult(movieDTO.isAdult());
        movieExisted.setPopularity(movieDTO.getPopularity());

        if (movieDTO.getGenres() != null && !movieDTO.getGenres().isEmpty()) {
            List<Genres> genresList = genresRepository.findAllById(movieDTO.getGenres());
            movieExisted.setGenres(genresList);
        }

        if (movieDTO.getTrailers() != null && !movieDTO.getTrailers().isEmpty()) {
            List<Trailer> trailerList = trailerRepository.findAllById(movieDTO.getTrailers());
            movieExisted.setTrailers(trailerList);
        }

        return movieRepository.save(movieExisted);
    }

    @Override
    public boolean deleteMovie(UUID movieId) {
        if (!movieRepository.existsById(movieId)) {
            return false;
        }
        movieRepository.deleteById(movieId);
        return true;
    }
}

