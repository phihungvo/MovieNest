package carevn.luv2code.MovieNest.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Entity
@Table(name = "movie_detail")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieDetail {

    @Id
    @GeneratedValue
    UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id", referencedColumnName = "id")
    Movie movie;

    String overview;

//    @OneToMany(mappedBy = "movieDetail", cascade = CascadeType.ALL)
//    List<Actor> actors;
//    @OneToMany(mappedBy = "movieDetail", cascade = CascadeType.ALL)
//    List<Trailer> trailers;
}
