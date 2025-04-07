package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.ActorDTO;
import carevn.luv2code.MovieNest.entity.Actor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ActorService {

    List<Actor> findAll();

    Page<Actor> findAllWithPage(int page, int size);

    Actor findById(UUID id);

    ActorDTO create(ActorDTO actor);

    Actor update(UUID id, Actor actor);

    void delete(Actor actor);
}
