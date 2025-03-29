package carevn.luv2code.MovieNest.dto;

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

     String posterPath;

     String backdropPath;

     float vote_average;

     int vote_count;

     List<UUID> genres; // Danh sách thể loại

     List<UUID> trailers;

}
