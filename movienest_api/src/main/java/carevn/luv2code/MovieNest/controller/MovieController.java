package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.service.MovieService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

//@CrossOrigin(origins = "http://localhost:3000")
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

    @GetMapping("/getAll")
    public ResponseEntity<Page<Movie>> getAllMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ){
        Page<Movie> movies = movieService.findAllMovies(page, size);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/findAllNoPaging")
    public ResponseEntity<List<Movie>> findAllNoPaging(){
        List<Movie> movies = movieService.findAllNoPaging();
        return ResponseEntity.ok(movies);
    }

    @PutMapping("/update/{movieId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable UUID movieId, @RequestBody MovieDTO movieDTO){
        Movie movie = movieService.updateMovie(movieId, movieDTO);
        return ResponseEntity.ok(movie);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMovie(@RequestParam UUID movieId){
        boolean deleted = movieService.deleteMovie(movieId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
        }
        return ResponseEntity.ok("Movie deleted");
    }

}
