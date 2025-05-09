package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.MovieDTO;
import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.dto.requests.UserUpdateRequest;
import carevn.luv2code.MovieNest.entity.Movie;
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
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
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
        User user = getUserById(userId);

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
        User user = getUserById(userId);
        user.getComments().forEach(comment -> comment.setUser(null));
        userRepository.delete(user);
    }

    @Override
    public User collectMovie(UUID userId, UUID movieId) {
        User user = getUserById(userId);
        Movie movie = getMovieById(movieId);

        if (userRepository.existsUserCollectedMovie(userId, movieId)) {
            log.info("User collected movie {} from user {}", movieId, user);
            throw new AppException(ErrorCode.USER_HAS_COLLECTED_MOVIE);
        }

        Set<Movie> collectedMovies = user.getCollectedMovies();
        collectedMovies.add(movie);
        user.setCollectedMovies(collectedMovies);

        Set<User> collectedUsers = movie.getCollectedByUsers();
        collectedUsers.add(user);
        movie.setCollectedByUsers(collectedUsers);
        movieRepository.save(movie);

        return userRepository.save(user);
    }

    @Override
    public void unCollectedMovie(UUID userId, UUID movieId) {

    }

    @Override
    public List<MovieDTO> getCollectedMovies(UUID userId) {
        return List.of();
    }

    private User getUserById(UUID userId) {
        return userRepository.findByIdWithCollectedMovies(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Movie getMovieById(UUID movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));
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