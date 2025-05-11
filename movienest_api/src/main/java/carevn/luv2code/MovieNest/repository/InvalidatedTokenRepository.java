package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, UUID> {
    
    Optional<InvalidatedToken> findByToken(String token);
    
    void deleteByExpiryTimeBefore(Date date);
}