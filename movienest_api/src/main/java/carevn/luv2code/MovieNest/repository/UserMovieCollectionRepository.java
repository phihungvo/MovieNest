package carevn.luv2code.MovieNest.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.entity.UserMovieCollection;

@Repository
public interface UserMovieCollectionRepository extends JpaRepository<UserMovieCollection, UUID>{

    List<UserMovieCollection> findByUser(User user);

    List<UserMovieCollection> findByUserIdOrderByCollectedAtDesc(UUID userId);

    Optional<UserMovieCollection> findByUserAndMovie(User user, Movie movie);

    boolean existsByUserAndMovie(User user, Movie movie);
    
    void deleteByUserAndMovie(User user, Movie movie);

} 