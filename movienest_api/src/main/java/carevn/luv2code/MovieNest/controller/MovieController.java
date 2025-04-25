package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.enums.Country;
import carevn.luv2code.MovieNest.service.MovieService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @GetMapping("/{movieId}")
    public ResponseEntity<Movie> findMovieById(@PathVariable UUID movieId) {
        return new ResponseEntity<>(movieService.findMovieById(movieId), HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<Movie>> getAllMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "") String keyWord
    ){
        Page<Movie> movies = movieService.findAllMovies(page, size, keyWord);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/this-week")
    public ResponseEntity<List<Movie>> getMoviesThisWeek(){
        return new ResponseEntity<>(movieService.getMoviesThisWeek(), HttpStatus.OK);
    }

    @GetMapping("/today")
    public ResponseEntity<List<Movie>> getMoviesToday(){
        return new ResponseEntity<>(movieService.getMoviesToday(), HttpStatus.OK);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Movie>> getMoviesPopular(){
        return new ResponseEntity<>(movieService.getMoviePopular(), HttpStatus.OK);
    }

    @GetMapping("/in-theater")
    public ResponseEntity<List<Movie>> getMoviesInTheater(){
        return new ResponseEntity<>(movieService.getMovieInTheater(), HttpStatus.OK);
    }

    @GetMapping("/korean-movie")
    public ResponseEntity<List<Movie>> getKoreanMovies(){
        return new ResponseEntity<>(movieService.findMovieByCountry(Country.KOREA), HttpStatus.OK);
    }

    @GetMapping("/vietnamese-movie")
    public ResponseEntity<List<Movie>> getVietnameseMovies(){
        return new ResponseEntity<>(movieService.findMovieByCountry(Country.VIETNAM), HttpStatus.OK);
    }

    @GetMapping("/thailand-movie")
    public ResponseEntity<List<Movie>> getThailandMovies(){
        return new ResponseEntity<>(movieService.findMovieByCountry(Country.THAILAND), HttpStatus.OK);
    }

//    @GetMapping("/thailand-movie")
//    public ResponseEntity<List<Movie>> getAnimationMovies(){
//        return new ResponseEntity<>(movieService.findMovieByCountry(Country.), HttpStatus.OK);
//    }

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

    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> deleteMovie(@PathVariable UUID movieId){
        movieService.deleteMovie(movieId);
        return ResponseEntity.ok().build();
    }

}
