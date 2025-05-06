package carevn.luv2code.MovieNest.mapper;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.entity.User;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface UserMapper{

    UserDTO toDTO(User user);

    User toEntity(UserDTO userDTO);
}
