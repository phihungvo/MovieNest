package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Genres;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.mapper.MovieMapper;
import carevn.luv2code.MovieNest.repository.GenresRepository;
import carevn.luv2code.MovieNest.repository.MovieRepository;
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

@Service
@Transactional
public class MovieServiceImpl implements MovieService {

    private static final Logger log = LoggerFactory.getLogger(MovieServiceImpl.class);

    private final MovieRepository movieRepository;

    private final GenresRepository genresRepository;

    private final MovieMapper movieMapper;

    public MovieServiceImpl(MovieRepository movieRepository,GenresRepository genresRepository ,MovieMapper movieMapper) {
        this.movieRepository = movieRepository;
        this.genresRepository = genresRepository;
        this.movieMapper = movieMapper;
    }

    @Override
    public void save(MovieDTO movieDTO) {
        Optional<Movie> existingMovie = movieRepository.findByTitle(movieDTO.getTitle());
        if (existingMovie.isPresent()) {
            throw new IllegalArgumentException("Movie with title already exists");
        }

        Movie movie = movieMapper.toEntity(movieDTO);
        List<Genres> genresList = genresRepository.findAllById(movieDTO.getGenre_ids());
        movie.setGenres(genresList);

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
}
