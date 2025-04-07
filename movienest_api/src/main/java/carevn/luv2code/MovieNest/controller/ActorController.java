package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.ActorDTO;
import carevn.luv2code.MovieNest.entity.Actor;
import carevn.luv2code.MovieNest.service.ActorService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/actor")
public class ActorController {

    private final ActorService actorService;

    public ActorController(ActorService actorService) {
        this.actorService = actorService;
    }

    @PostMapping("/create")
    public ResponseEntity<ActorDTO> addActor(@RequestBody ActorDTO actor) {
        return ResponseEntity.ok(actorService.create(actor));
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<Actor>> findAll() {
        return ResponseEntity.ok(actorService.findAll());
    }

    @GetMapping("/getAllPagable")
    public ResponseEntity<Page<Actor>> getAllActorsPagable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<Actor> actors = actorService.findAllWithPage(page, size);
        return ResponseEntity.ok(actors);
    }

}
