package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.CollectionDTO;
import carevn.luv2code.MovieNest.service.CollectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping("/{userId}/collect/{movieId}")
    public ResponseEntity<CollectionDTO> addCollection(@PathVariable UUID userId, @PathVariable UUID movieId) {
        CollectionDTO collection = collectionService.collectMovie(userId, movieId);
        return new ResponseEntity<>(collection, HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}/un_collect/{movieId}")
    public ResponseEntity<String> removeCollection(@PathVariable UUID userId, @PathVariable UUID movieId) {
        collectionService.unCollectMovie(userId, movieId);
        return ResponseEntity.ok().body("Collection was removed successfully!");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CollectionDTO>> getAllCollectionsByUser(@PathVariable UUID userId) {
        List<CollectionDTO> collections = collectionService.getAllCollectionsByUser(userId);
        return new ResponseEntity<>(collections, HttpStatus.OK);
    }

}
