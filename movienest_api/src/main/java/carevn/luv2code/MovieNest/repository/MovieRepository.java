package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.enums.Country;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> {

    boolean existsByTitle(String title);

    @Query("SELECT m FROM Movie m where m.title LIKE %:keyWord%")
    List<Movie> searchMovie(@Param("keyWord") String keyWord);

    List<Movie> findByReleaseDate(Date release_date);

    Page<Movie> findAll(Pageable pageable);

    List<Movie> findByReleaseDateBetween(Date from, Date to);

    List<Movie> findTop15ByPopularTrue();

    List<Movie> findTop15ByInTheaterTrue();

    @Query("SELECT m FROM Movie m WHERE m.country = :country ")
    List<Movie> findMoviesByCountry(Country country);

}
