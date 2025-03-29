package carevn.luv2code.MovieNest.mapper;

import carevn.luv2code.MovieNest.dto.TrailerDTO;
import carevn.luv2code.MovieNest.entity.Trailer;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TrailerMapper extends EntityMapper<TrailerDTO, Trailer> {
}
