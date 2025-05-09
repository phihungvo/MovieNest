package carevn.luv2code.MovieNest.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieDetailResponse {

    String title;

    String overview;

    Date releaseDate;

    String backdropPath;

    String country;

    float voteAverage;

    boolean isCollected;

    List<UUID> genres;

    List<UUID> comments;
}
