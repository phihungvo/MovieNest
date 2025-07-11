package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.entity.Genres;
import carevn.luv2code.MovieNest.service.GenresService;
import carevn.luv2code.MovieNest.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/genres")
public class GenresController {

    private final GenresService genresService;

    public GenresController(GenresService genresService) {
        this.genresService = genresService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createGenre(@RequestBody Genres genres) {
        genresService.createGenres(genres);
        return ResponseEntity.ok("Genre created");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Genres>> searchGenres(@RequestParam("keyWord") String keyWord) {
        return ResponseEntity.ok(genresService.searchGenres(keyWord));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Genres>> findAllGenres() {
        return ResponseEntity.ok(genresService.findAllGenres());
    }

    @GetMapping("/findById")
    public ResponseEntity<Genres> findGenreById(@RequestParam("id") UUID id) {
        return ResponseEntity.ok(genresService.findGenreById(id));
    }

    @GetMapping("/{movieId}/movie")
    public ResponseEntity<List<Genres>> findGenreByMovieId(@PathVariable UUID movieId) {
        return ResponseEntity.ok().body(genresService.findGenresByMovieId(movieId));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteGenreById(@RequestParam("id") UUID id) {
        boolean success = genresService.deleteGenreById(id);
        if (success) {
            return ResponseEntity.ok("Genre deleted");
        }
        return ResponseEntity.ok("Genre not deleted");
    }
}
