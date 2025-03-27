package carevn.luv2code.MovieNest.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "movie")
public class Movie {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String overview;

    @Column(name = "release_date")
    private Date releaseDate;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "backdrop_path")
    private String backdropPath;

    private float vote_average;

    private int vote_count;

    @ManyToMany
    @JoinTable(
            name = "movie_genres",
            joinColumns =@JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genres_id")
    )
    private List<Genres> genres; // Danh sách thể loại

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Trailer> trailers;
}
