package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.Trailer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrailerRepository extends JpaRepository<Trailer, UUID> {
    List<Trailer> findByMovieId(UUID movieId);

    Page<Trailer> findAll(Pageable pageable);

    boolean existsByTitle(String title);

    boolean existsByTitleAndKey(String title, String key);

    Page<Trailer> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query("SELECT t FROM Trailer t WHERE t.movie IS NULL")
    List<Trailer> findTrailerWithoutMovies();

}
