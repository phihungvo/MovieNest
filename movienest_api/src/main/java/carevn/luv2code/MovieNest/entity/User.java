package carevn.luv2code.MovieNest.entity;

import carevn.luv2code.MovieNest.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private UUID user_id;

    @Column(unique = true, nullable = false)
    private String username;

    private String first_name;

    private String last_name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String password;

    private String address;

    private String phone_number;

    private String profile_picture;

    private String bio;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles;

    private boolean enabled = true;

    private boolean accountNonExpired = true;

    private boolean credentialsNonExpired = true;

    private boolean accountNonLocked = true;

}
