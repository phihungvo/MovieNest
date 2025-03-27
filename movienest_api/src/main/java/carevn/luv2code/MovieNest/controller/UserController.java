package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.service.UserService;
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
    public ResponseEntity<User> getByUsername(@RequestParam String username) {
        return ResponseEntity.ok().body(userService.findByUsername(username));
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok().body(userService.findAll());
    }

    @PostMapping("/createUser")
    public ResponseEntity<Void> createUser(@RequestBody User user) {
        userService.save(user);
        return ResponseEntity.ok().body(null);
    }


}
