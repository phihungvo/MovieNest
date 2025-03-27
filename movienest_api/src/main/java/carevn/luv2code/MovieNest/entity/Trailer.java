package carevn.luv2code.MovieNest.entity;

import carevn.luv2code.MovieNest.enums.TrailerType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "trailer")
public class Trailer {
    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    @Column(name = "trailer_key")
    private String key; // Store key of youtube link

    private String site;

    @Enumerated(EnumType.STRING)
    @Column(name = "trailer_type")
    private TrailerType trailerType;

    private boolean official;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    @JsonIgnore
    private Movie movie;

    @Column(name = "published_at")
    private Date publishedAt;

}
