package carevn.luv2code.MovieNest.dto;

import carevn.luv2code.MovieNest.enums.Role;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterRequest {

    private String username;

    private String first_name;

    private String last_name;

    private String email;

    private String password;

    private String address;

    private String phone_number;

    private Set<Role> roles;

}
