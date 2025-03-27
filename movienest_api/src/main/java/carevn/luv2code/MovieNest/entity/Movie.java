package carevn.luv2code.MovieNest.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;
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

    float vote_average;

    int vote_count;

    @ManyToMany
    @JoinTable(
            name = "movie_genres",
            joinColumns =@JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genres_id")
    )
    List<Genres> genres; // Danh sách thể loại

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Trailer> trailers;
}
