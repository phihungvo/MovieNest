package carevn.luv2code.MovieNest.mapper;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.entity.Genres;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.repository.GenresRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MovieMapper extends EntityMapper<MovieDTO, Movie> {

//    @Mapping(target = "genres", source = "genre_ids", qualifiedByName = "mapIdsToGenres")
//    Movie toEntity(MovieDTO movieDTO);
//
//    @Mapping(target = "genre_ids", source = "genres", qualifiedByName = "mapGenresToIds")
//    MovieDTO toDto(Movie movie);

//    @Named("mapGenresToIds")
//    default List<UUID> mapGenresToIds(List<Genres> genres) {
//        if (genres == null) return new ArrayList<>();
//        return genres.stream().map(Genres::getId).collect(Collectors.toList());
//    }
//
//
//    @Named("mapIdsToGenres")
//    default List<Genres> mapIdsToGenres(List<UUID> ids, @Context GenresRepository genresRepository) {
//        if (ids == null) return new ArrayList<>();
//        return ids.stream().map(genresRepository::findById)
//                .filter(Optional::isPresent)
//                .map(Optional::get)
//                .collect(Collectors.toList());
//    }
}
