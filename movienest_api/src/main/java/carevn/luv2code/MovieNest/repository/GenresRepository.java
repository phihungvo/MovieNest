package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.Genres;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GenresRepository extends JpaRepository<Genres, UUID> {

    @Query("SELECT g FROM Genres g WHERE g.name LIKE %:keyWord%")
    List<Genres> searchGenres(@Param("keyWord") String keyWord);

    @Query("SELECT g FROM Movie m JOIN m.genres g WHERE m.id = :movieId")
    List<Genres> findGenresByMovieId(@Param("movieId") UUID movieId);

}