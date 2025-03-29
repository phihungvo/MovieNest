package carevn.luv2code.MovieNest.mapper;
import carevn.luv2code.MovieNest.dto.GenresDTO;
import carevn.luv2code.MovieNest.entity.Genres;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface GenreMapper extends EntityMapper<GenresDTO, Genres> {

}
