package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.enums.Role;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.mapper.UserMapper;
import carevn.luv2code.MovieNest.repository.UserRepository;
import carevn.luv2code.MovieNest.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public void save(UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);

        if (userDTO.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            for (String roleStr : userDTO.getRoles()) {
                Role role = Role.valueOf(roleStr);
                roles.add(role);
            }
            user.setRoles(roles);
        }

        userRepository.save(user);
    }

    @Override
    public void updateUser(UserDTO userDTO) {
        User user = new User();
        user = userMapper.toEntity(userDTO);
        userRepository.save(user);
    }

    @Override
    public Page<UserDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> pageUsers = userRepository.findAll(pageable);
        return pageUsers.map(this::convertToDTO);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCreateAt(user.getCreateAt());
        dto.setProfilePicture(user.getProfilePicture());
        if (user.getRoles() != null) {
            List<String> roleNames = user.getRoles()
                    .stream()
                    .map(Role::name)
                    .collect(Collectors.toList());
            dto.setRoles(roleNames);
        }
        return dto;
    }
}