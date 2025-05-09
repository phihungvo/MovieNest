package carevn.luv2code.MovieNest.entity;

import carevn.luv2code.MovieNest.enums.Country;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
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

    int runtime;

    String director;

    @Enumerated(EnumType.STRING)
    @Column(name = "country")
    Country country;

    @ManyToMany(mappedBy = "collectedMovies",  fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Set<User> collectedByUsers = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genres_id")
    )
    List<Genres> genres;

    @OneToMany(mappedBy = "movie", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    List<Trailer> trailers;

    @OneToMany(mappedBy = "movie", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore
    @ToString.Exclude
    List<Comment> comments;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Banner> banners = new ArrayList<>();
}
