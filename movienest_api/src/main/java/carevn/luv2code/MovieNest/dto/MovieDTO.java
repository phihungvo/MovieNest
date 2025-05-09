package carevn.luv2code.MovieNest.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;
import java.util.Set;
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

     int runtime;

     String director;

     Set<UUID> collectedByUsersID;

     String country;

     Boolean inTheater;

     Boolean adult;

     Float popularity;

     List<UUID> genres;

     List<UUID> trailers;

     @JsonIgnore
     List<UUID> comments;

}
