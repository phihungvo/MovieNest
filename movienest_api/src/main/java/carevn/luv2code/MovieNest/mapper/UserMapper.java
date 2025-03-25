package carevn.luv2code.MovieNest.mapper;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper extends EntityMapper<UserDTO, User> {
}
