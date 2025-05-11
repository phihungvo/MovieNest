package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUserName(String userName);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findAll(Pageable pageable);

    @Query("SELECT m FROM Movie m JOIN m.collectedByUsers u WHERE u.id = :userId")
    List<Movie> findMoviesByUserId(@Param("userId") UUID userId);

    @Query(value = "SELECT movie_id FROM user_movie_collection WHERE user_id = :userId", nativeQuery = true)
    List<UUID> findCollectedMovieIds(@Param("userId") UUID userId);

}
