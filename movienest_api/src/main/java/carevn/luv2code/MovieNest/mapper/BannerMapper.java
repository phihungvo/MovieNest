package carevn.luv2code.MovieNest.mapper;

import carevn.luv2code.MovieNest.dto.BannerDTO;
import carevn.luv2code.MovieNest.entity.Banner;
import carevn.luv2code.MovieNest.entity.Movie;
import org.springframework.stereotype.Controller;

import java.util.UUID;
@Controller
public class BannerMapper {

    public static BannerDTO toDTO(Banner banner) {
        BannerDTO dto = new BannerDTO();
        dto.setId(banner.getId());
        dto.setTitle(banner.getTitle());
        dto.setType(banner.getType());
        dto.setImageUrl(banner.getImageUrl());
        dto.setMovieId(banner.getMovie() != null ? banner.getMovie().getId() : null);
        return dto;
    }

    public static Banner toEntity(BannerDTO dto) {
        Banner banner = new Banner();
        banner.setId(dto.getId());
        banner.setTitle(dto.getTitle());
        banner.setType(dto.getType());
        banner.setImageUrl(dto.getImageUrl());

        if (dto.getMovieId() != null) {
            Movie movie = new Movie();
            movie.setId(dto.getMovieId());
            banner.setMovie(movie);
        }

        return banner;
    }
}
