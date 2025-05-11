package carevn.luv2code.MovieNest.dto;


import java.util.Date;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CollectionDTO {

    UUID id;
    
    UUID userId;

    UUID movieId;

    String movieTitle;

    String posterPath;

    float voteAverage;

    Date collectedAt;
    
}
