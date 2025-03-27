package carevn.luv2code.MovieNest.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Entity
@Table(name = "genres")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Genres {

    @Id
    @GeneratedValue
    UUID id;

    @Column(unique = true, nullable = false)
    String name;
}
