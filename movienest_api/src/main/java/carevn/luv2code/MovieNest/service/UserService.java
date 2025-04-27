package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.entity.User;
import org.springframework.data.domain.Page;

public interface UserService {

    User findByUsername(String username);

    void save(User user);

    void updateUser(UserDTO userDTO);

    Page<User> findAll(int page, int size);
}
