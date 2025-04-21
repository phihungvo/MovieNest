package carevn.luv2code.MovieNest.entity;

import carevn.luv2code.MovieNest.enums.TrailerType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "trailer")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Trailer {
    @Id
    @GeneratedValue
    UUID id;

    String title;

    @Column(name = "trailer_key")
    String key;

    String site;

    @Enumerated(EnumType.STRING)
    @Column(name = "trailer_type")
    TrailerType trailerType;

    boolean official;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = true)
    @JsonBackReference
    Movie movie;

    @Column(name = "published_at")
    Date publishedAt;

}
