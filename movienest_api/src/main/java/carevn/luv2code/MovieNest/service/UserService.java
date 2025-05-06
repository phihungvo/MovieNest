package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.entity.User;
import org.springframework.data.domain.Page;

public interface UserService {

    User findByUsername(String username);

    void save(UserDTO userDTO);

    void updateUser(UserDTO userDTO);

    Page<UserDTO> findAll(int page, int size);
}
