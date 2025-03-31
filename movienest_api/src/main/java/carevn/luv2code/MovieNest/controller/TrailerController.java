package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.TrailerDTO;
import carevn.luv2code.MovieNest.entity.Trailer;
import carevn.luv2code.MovieNest.service.TrailerService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trailers")
public class TrailerController {

    private TrailerService trailerService;

    public TrailerController(TrailerService trailerService) {
        this.trailerService = trailerService;
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createTrailer(@Valid @RequestBody TrailerDTO trailerDTO) {
        trailerService.createTrailer(trailerDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<Trailer>> getAllTrailers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<Trailer> trailer = trailerService.findAllTrailers(page, size);
        return ResponseEntity.ok(trailer);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Trailer>> getTrailersByMovieId(@PathVariable("movieId") UUID movieid) {
        return ResponseEntity.ok(trailerService.getTrailersByMovieId(movieid));
    }

    @GetMapping("/{trailerId}")
    public ResponseEntity<Trailer> getTrailerById(@PathVariable("trailerId") UUID trailerId) {
        return ResponseEntity.ok(trailerService.getTrailerById(trailerId));
    }

    @PutMapping("/{trailerId}")
    public ResponseEntity<Trailer> updateTrailer(@PathVariable("trailerId") UUID trailerId,
                                                 @RequestBody TrailerDTO trailerDTO) {
        return ResponseEntity.ok(trailerService.updateTrailer(trailerId, trailerDTO));
    }

    @DeleteMapping("/{trailerId}")
    public ResponseEntity<Void> deleteTrailer(@PathVariable("trailerId") UUID trailerId) {
        trailerService.deleteTrailer(trailerId);
        return ResponseEntity.ok().build();
    }

}








