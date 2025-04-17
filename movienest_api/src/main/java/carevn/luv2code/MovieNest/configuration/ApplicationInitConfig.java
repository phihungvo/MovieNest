package carevn.luv2code.MovieNest.configuration;

import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.enums.Role;
import carevn.luv2code.MovieNest.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        String adminEmail = "admin@admin.com";
        return args -> {
            if(userRepository.findByEmail(adminEmail).isEmpty()){
                var roles = new HashSet<String>();
                roles.add(Role.ADMIN.name());

                User user = User.builder()
                        .username("admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin"))
                        //.roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("Admin user has been created with default email: admin@admin.com" +
                        " and password: admin, please change it!");
            }
        };
    }
}