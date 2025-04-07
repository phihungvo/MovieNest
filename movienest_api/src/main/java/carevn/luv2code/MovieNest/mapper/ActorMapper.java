package carevn.luv2code.MovieNest.mapper;

import carevn.luv2code.MovieNest.dto.ActorDTO;
import carevn.luv2code.MovieNest.entity.Actor;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ActorMapper extends EntityMapper<ActorDTO, Actor> {

}
