package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.enums.Country;
import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface MovieService {

    void save(MovieDTO movieDTO);

    List<Movie> searchMovieByTitle(String keyWord);

    Page<Movie> findAllMovies(int page, int size);

    List<Movie> findAllNoPaging();

    List<Movie> getMoviesToday();

    List<Movie> getMoviePopular();

    List<Movie> getMovieInTheater();

    List<Movie> getMoviesThisWeek();

    Movie updateMovie(UUID id, MovieDTO movieDTO);

    boolean deleteMovie(UUID id);

    List<Movie> findMovieByCountry(Country country);
}
