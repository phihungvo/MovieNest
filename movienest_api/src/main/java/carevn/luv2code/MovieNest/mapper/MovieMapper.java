//package carevn.luv2code.MovieNest.mapper;
//
//import carevn.luv2code.MovieNest.dto.MovieDTO;
//import carevn.luv2code.MovieNest.dto.TrailerDTO;
//import carevn.luv2code.MovieNest.entity.Movie;
//import carevn.luv2code.MovieNest.entity.Trailer;
//import org.mapstruct.*;
//import org.springframework.stereotype.Component;
//
//@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//public interface MovieMapper {
//
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    @Mapping(target = "genres", ignore = true)
//    @Mapping(target = "trailers", ignore = true)
//    @Mapping(target = "comments", ignore = true)
//    @Mapping(target = "country", ignore = true)
//    void updateMovieFromDto(MovieDTO dto, @MappingTarget Movie movie);
//
//    @Mapping(target = "genres", ignore = true)
//    @Mapping(target = "trailers", ignore = true)
//    @Mapping(target = "comments", ignore = true)
//    @Mapping(target = "country", ignore = true)
//    Movie toEntity(MovieDTO dto);
//
//
//}
//
//
