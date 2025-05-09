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

//    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
//            "FROM User u JOIN u.collectedMovies m " +
//            "WHERE u.id = :userId AND m.id = :movieId")
//    boolean existsUserCollectedMovie(@Param("userId") UUID userId, @Param("movieId") UUID movieId);

    @Query("""
    SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END
    FROM User u JOIN u.collectedMovies m
    WHERE u.id = :userId AND m.id = :movieId
""")
    boolean existsUserCollectedMovie(@Param("userId") UUID userId, @Param("movieId") UUID movieId);


    @Query(value = """
    SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
    FROM user_movie_collection
    WHERE user_id = UNHEX(REPLACE(:userId, '-', ''))
      AND movie_id = UNHEX(REPLACE(:movieId, '-', ''))
""", nativeQuery = true)
    boolean existsInUserMovieCollection(@Param("userId") UUID userId, @Param("movieId") UUID movieId);

    // Lấy user kèm theo danh sách phim đã sưu tập
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.collectedMovies WHERE u.id = :userId")
    Optional<User> findByIdWithCollectedMovies(@Param("userId") UUID userId);

    @Query("SELECT m FROM Movie m JOIN m.collectedByUsers u WHERE u.id = :userId")
    List<Movie> findMoviesByUserId(@Param("userId") UUID userId);

    @Query(value = "SELECT movie_id FROM user_movie_collection WHERE user_id = :userId", nativeQuery = true)
    List<UUID> findCollectedMovieIds(@Param("userId") UUID userId);

}
