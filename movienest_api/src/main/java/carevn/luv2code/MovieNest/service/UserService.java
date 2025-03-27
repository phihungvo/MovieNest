package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.entity.User;

import java.util.List;

public interface UserService {

    User findByUsername(String username);

    void save(User user);

    void updateUser(UserDTO userDTO);

    List<User> findAll();
}
