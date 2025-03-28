package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Movie;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MovieService {

    void save(MovieDTO movieDTO);

    List<Movie> searchMovieByTitle(String keyWord);

    Page<Movie> findAllMovies(int page, int size);
}
