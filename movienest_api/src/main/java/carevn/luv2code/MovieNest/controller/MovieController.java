package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.service.MovieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movie")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/create")
    public ResponseEntity<MovieDTO> createMovie(@RequestBody MovieDTO movie) {
        System.out.println("Received movie: " + movie.getTitle());
        movieService.save(movie);
        return new ResponseEntity<>(movie, HttpStatus.CREATED);
    }

    @PostMapping("/search")
    public ResponseEntity<List<Movie>> searchMovie(@RequestParam("keyWord") String keyWord){
        List<Movie> movies = movieService.searchMovieByTitle(keyWord);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }
}
