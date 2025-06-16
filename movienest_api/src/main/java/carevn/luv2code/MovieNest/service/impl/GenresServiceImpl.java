package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.entity.Genres;
import carevn.luv2code.MovieNest.repository.GenresRepository;
import carevn.luv2code.MovieNest.service.GenresService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GenresServiceImpl implements GenresService {

    private final GenresRepository genresRepository;

    public GenresServiceImpl(GenresRepository genresRepository) {
        this.genresRepository = genresRepository;
    }

    @Override
    public void createGenres(Genres genres) {
        Genres newGenres = new Genres();
        newGenres.setName(genres.getName());
        genresRepository.save(newGenres);
    }

    @Override
    public List<Genres> searchGenres(String keyWord) {
        List<Genres> genresList = new ArrayList<>();
        genresList = genresRepository.searchGenres(keyWord);
        if (genresList.isEmpty()) {
            return null;
        }
        return genresList;
    }

    @Override
    public List<Genres> findAllGenres() {
        List<Genres> genresList = new ArrayList<>();
        genresList = genresRepository.findAll();
        if (genresList.isEmpty()) {
            return null;
        }
        return genresList;
    }

    @Override
    public Genres findGenreById(UUID id) {
        return genresRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genres not found!"));
    }

    @Override
    public List<Genres> findGenresByMovieId(UUID movieId) {
        List<Genres> genresList = new ArrayList<>();
        genresRepository.findGenresByMovieId(movieId).forEach(genresList::add);
        return genresList;
    }

    @Override
    public boolean deleteGenreById(UUID id) {
        Genres genres = genresRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genres not found!"));
        boolean isDeleted = false;
        try {
            genresRepository.delete(genres);
        }catch (Exception e) {}
        return isDeleted = true;
    }
}
