package carevn.luv2code.MovieNest.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.UUID;

@Data
@Entity
@Table(name = "actor")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Actor {

    @Id
    @GeneratedValue
    UUID id;

    String name;

    @Column(name = "character_name")
    String character; // Tên vai diễn

    String gender;

    String biography; // tiểu sử

    Date birthday;

    String placeOfBirth;

    @Column(name = "profile_path")
    private String profilePath;
//
//    @ManyToOne
//    @JoinColumn(name = "movie_detail_id")
//    private MovieDetail movieDetail;

}
