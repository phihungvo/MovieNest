package carevn.luv2code.MovieNest.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BannerDTO {

    UUID id;

    String title;

    String type;

    String imageUrl;

    UUID movieId;
}
