package carevn.luv2code.MovieNest.security;

import carevn.luv2code.MovieNest.entity.InvalidatedToken;
import carevn.luv2code.MovieNest.repository.InvalidatedTokenRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@RequiredArgsConstructor
public class TokenBlacklist {

    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final JwtService jwtService;

    public void addToBlacklist(String token) {
        Date expiryDate = jwtService.extractClaim(token, Claims::getExpiration);
        
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .token(token)  
                .expiryTime(expiryDate)
                .build();
        
        invalidatedTokenRepository.save(invalidatedToken);
    }

    public boolean isTokenBlacklisted(String token) {
        return invalidatedTokenRepository.findByToken(token).isPresent();
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupExpiredTokens() {
        invalidatedTokenRepository.deleteByExpiryTimeBefore(new Date());
    }
}