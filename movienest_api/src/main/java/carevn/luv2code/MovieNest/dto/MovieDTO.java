package carevn.luv2code.MovieNest.dto;

import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieDTO {

     String title;

     String overview;

     Date releaseDate;

     String poster_path;

     String backdrop_path;

     float vote_average;

     int vote_count;

     List<UUID> genre_ids; // Danh sách thể loại

}
