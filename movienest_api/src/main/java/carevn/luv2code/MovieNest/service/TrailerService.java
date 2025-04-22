package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.TrailerDTO;
import carevn.luv2code.MovieNest.entity.Trailer;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface TrailerService {

    void createTrailer(TrailerDTO trailerDTO);

    Page<Trailer> findAllTrailers(int page, int size, String keyWord);

    List<Trailer> findAllTrailersNoPagination();

    List<Trailer> getTrailersByMovieId(UUID movieId);

    Trailer getTrailerById(UUID trailerId);

    List<Trailer> getTrailersWithoutMovies();

    Trailer updateTrailer(UUID trailerId, TrailerDTO trailerDTO);

    void deleteTrailer(UUID trailerId);

}
