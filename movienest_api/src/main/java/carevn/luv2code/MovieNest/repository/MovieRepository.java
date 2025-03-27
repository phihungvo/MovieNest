package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> {

    @Query("SELECT m FROM Movie m where m.title LIKE %:keyWord%")
    List<Movie> searchMovie(@Param("keyWord") String keyWord);

    List<Movie> findByReleaseDate(Date release_date);

    Optional<Movie> findByTitle(String title);
}
