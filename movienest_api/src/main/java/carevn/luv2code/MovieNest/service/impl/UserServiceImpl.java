package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.entity.User;
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
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }

    @Override
    public void updateUser(UserDTO userDTO) {
        User user = new User();
        user = userMapper.toEntity(userDTO);
        userRepository.save(user);
    }

    @Override
    public Page<User> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> pageUsers = userRepository.findAll(pageable);
        return pageUsers;
    }


}
