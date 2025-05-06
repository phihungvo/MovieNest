package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.UserDTO;
import carevn.luv2code.MovieNest.dto.requests.ApiResponse;
import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getByUsername")
    public ApiResponse<User> getByUsername(@RequestParam String username) {
        return ApiResponse.<User>builder()
                .code(200)
                .result(userService.findByUsername(username))
                .build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<UserDTO>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<UserDTO> users = userService.findAll(page, size);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/createUser")
    public ResponseEntity<String> createUser(@RequestBody UserDTO userDTO) {
        userService.save(userDTO);
        return ResponseEntity.ok().body("Create user successfully");
    }


}
