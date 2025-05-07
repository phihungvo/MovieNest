package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.dto.requests.UserUpdateRequest;
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

import java.util.*;
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
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        User user = userMapper.toEntity(userDTO);
        user.setCreateAt(new Date());

        if (userDTO.getRoles() != null) {
            Set<Role> roles = userDTO
                    .getRoles()
                    .stream()
                    .map(Role::valueOf)
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }
        userRepository.save(user);
    }

    @Override
    public void updateUser(UUID userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUserFromDto(request, user);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(request.getPassword());
        user.setUpdateAt(new Date());
        if (request.getRoles() != null) {
            Set<Role> roles = request.getRoles()
                    .stream()
                    .map(Role::valueOf)
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }
        userRepository.save(user);
    }

    @Override
    public Page<UserDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> pageUsers = userRepository.findAll(pageable);
        return pageUsers.map(this::convertToDTO);
    }

    @Override
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.getComments().forEach(comment -> comment.setUser(null));
        userRepository.delete(user);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUserName(user.getUserName());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPassword(user.getPassword());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCreateAt(user.getCreateAt());
        dto.setUpdateAt(user.getUpdateAt());
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