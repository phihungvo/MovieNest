package carevn.luv2code.MovieNest.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class MovieDTO {

    private String title;

    private String overview;

    private Date releaseDate;

    private String poster_path;

    private String backdrop_path;

    private float vote_average;

    private int vote_count;

    private List<UUID> genre_ids; // Danh sách thể loại

}
