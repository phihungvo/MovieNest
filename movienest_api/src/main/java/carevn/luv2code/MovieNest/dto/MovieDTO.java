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

     Float voteAverage;

     Integer voteCount;

     Boolean popular;

//     String movieType;

     String country;

     Boolean inTheater;

     Boolean adult;

     Float popularity;

     List<UUID> genres; // Danh sách thể loại

     List<UUID> trailers;

     @JsonIgnore
     List<UUID> comments;

}
