package carevn.luv2code.MovieNest.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

     float voteAverage;

     int voteCount;

     boolean popular;

     String movieType;

     String country;

     boolean inTheater;

     boolean adult;

     float popularity;

     List<UUID> genres; // Danh sách thể loại

     List<UUID> trailers;

     @JsonIgnore
     List<UUID> comments;

}
