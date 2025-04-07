package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.ActorDTO;
import carevn.luv2code.MovieNest.entity.Actor;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.mapper.ActorMapper;
import carevn.luv2code.MovieNest.repository.ActorRepository;
import carevn.luv2code.MovieNest.service.ActorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ActorServiceImpl implements ActorService {

    ActorRepository actorRepository;

    ActorMapper actorMapper;

    public ActorServiceImpl(ActorRepository actorRepository, ActorMapper actorMapper) {
        this.actorRepository = actorRepository;
        this.actorMapper = actorMapper;
    }

    @Override
    public List<Actor> findAll() {
        return actorRepository.findAll();
    }

    @Override
    public Page<Actor> findAllWithPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Actor> actorPage = actorRepository.findAll(pageable);
        return actorPage;
    }

    @Override
    public Actor findById(UUID id) {
        return actorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACTOR_NOT_EXISTED));
    }

    @Override
    public ActorDTO create(ActorDTO actor) {
        Actor actorEntity = actorMapper.toEntity(actor);
        actorEntity = actorRepository.save(actorEntity);
        return actorMapper.toDto(actorEntity);
    }

    @Override
    public Actor update(UUID id, Actor actor) {
        Actor updatedActor = actorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACTOR_NOT_EXISTED));
        return actorRepository.save(updatedActor);
    }

    @Override
    public void delete(Actor actor) {
        actorRepository.delete(actor);
    }
}
