package carevn.luv2code.MovieNest.entity;

import carevn.luv2code.MovieNest.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue
    UUID id;

    @Column(nullable = false)
    String username;

    String first_name;

    String last_name;

    @Column(unique = true, nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    String address;

    String phone_number;

    String profile_picture;

    String bio;

    Date create_at;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    Set<Role> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Comment> comments;

    boolean enabled = true;

    boolean accountNonExpired = true;

    boolean credentialsNonExpired = true;

    boolean accountNonLocked = true;

}
