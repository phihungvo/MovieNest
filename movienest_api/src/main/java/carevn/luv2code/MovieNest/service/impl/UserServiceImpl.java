package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.dto.requests.UserUpdateRequest;
import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.enums.Role;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.mapper.MovieMapper;
import carevn.luv2code.MovieNest.mapper.UserMapper;
import carevn.luv2code.MovieNest.repository.MovieRepository;
import carevn.luv2code.MovieNest.repository.UserRepository;
import carevn.luv2code.MovieNest.service.UserService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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

    @PersistenceContext
    private EntityManager entityManager;

    private final UserRepository userRepository;

    private final UserMapper userMapper;
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, MovieRepository movieRepository, MovieMapper movieMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.movieRepository = movieRepository;
        this.movieMapper = movieMapper;
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
        user.setRoles(convertToRoleSet(userDTO.getRoles()));

        userRepository.save(user);
    }

    @Override
    public void updateUser(UUID userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.updateUserFromDto(request, user);
        user.setUpdateAt(new Date());

        if (!"admin@example.com".equals(request.getEmail())) {
            user.setEnabled(request.isEnabled());
            user.setRoles(convertToRoleSet(request.getRoles()));
        }
        userRepository.save(user);
    }

    @Override
    public Page<UserDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Override
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.getComments().forEach(comment -> comment.setUser(null));
        userRepository.delete(user);
    }

    private Set<Role> convertToRoleSet(List<String> roleNames) {
        if (roleNames == null) return Collections.emptySet();
        return roleNames.stream()
                .map(Role::valueOf)
                .collect(Collectors.toSet());
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
        dto.setEnabled(user.isEnabled());
        dto.setProfilePicture(user.getProfilePicture());

        if (user.getRoles() != null) {
            List<String> roles = user.getRoles().stream()
                    .map(Role::name)
                    .collect(Collectors.toList());
            dto.setRoles(roles);
        }

        return dto;
    }
}