package carevn.luv2code.MovieNest.mapper;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Movie;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MovieMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "trailers", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "country", ignore = true)
    void updateMovieFromDto(MovieDTO dto, @MappingTarget Movie movie);

    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "trailers", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "country", ignore = true)
    Movie toEntity(MovieDTO dto);

    @Mapping(target = "country", ignore = true)
    @Mapping(target = "collectedByUsersID", ignore = true)
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "trailers", ignore = true)
    @Mapping(target = "comments", ignore = true)
    MovieDTO toDto(Movie movie);

}


