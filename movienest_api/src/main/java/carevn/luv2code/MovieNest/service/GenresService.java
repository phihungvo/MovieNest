package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.entity.Genres;

import java.util.List;
import java.util.UUID;

public interface GenresService {

    void createGenres(Genres genres);

    List<Genres> searchGenres(String keyWord);

    List<Genres> findAllGenres();

    Genres findGenreById(UUID id);

    boolean deleteGenreById(UUID id);
}
