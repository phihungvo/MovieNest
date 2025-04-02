package carevn.luv2code.MovieNest.security;

import carevn.luv2code.MovieNest.dto.requests.RegisterRequest;
import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.enums.Role;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Set roles - default to USER if not provided
        Set<Role> roles = request.getRoles() != null && !request.getRoles().isEmpty()
                ? request.getRoles()
                : Collections.singleton(Role.USER);
        user.setRoles(roles);

        // Save user
        userRepository.save(user);

        // Generate and return JWT token
        return jwtService.generateToken(user);
    }


}