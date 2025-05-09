package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.dto.requests.UserUpdateRequest;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface UserService {

    User findByUsername(String username);

    void save(UserDTO userDTO);

    void updateUser(UUID userId, UserUpdateRequest request);

    Page<UserDTO> findAll(int page, int size);

    void deleteUser(UUID userId);

    User collectMovie(UUID userId, UUID movieId);

    void unCollectedMovie(UUID userId, UUID movieId);

    List<MovieDTO> getCollectedMovies(UUID userId);
}
