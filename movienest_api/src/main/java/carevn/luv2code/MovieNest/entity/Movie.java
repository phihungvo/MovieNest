package carevn.luv2code.MovieNest.entity;

import carevn.luv2code.MovieNest.enums.Country;
import carevn.luv2code.MovieNest.enums.MovieType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "movie")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Movie {

    @Id
    @GeneratedValue
    UUID id;

    @Column(nullable = false)
    String title;

    String overview;

    @Column(name = "release_date")
    Date releaseDate;

    @Column(name = "poster_path")
    String posterPath;

    @Column(name = "backdrop_path")
    String backdropPath;

    float voteAverage;

    int voteCount;

    boolean popular;

    boolean inTheater;

    boolean adult;

    float popularity;

//    @Enumerated(EnumType.STRING)
//    @Column(name = "movie_type")
//    MovieType movieType;

    @Enumerated(EnumType.STRING)
    @Column(name = "country")
    Country country;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genres_id")
    )
    List<Genres> genres;

    @OneToMany(mappedBy = "movie", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    List<Trailer> trailers;

    @OneToMany(mappedBy = "movie", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore
    List<Comment> comments;
}
