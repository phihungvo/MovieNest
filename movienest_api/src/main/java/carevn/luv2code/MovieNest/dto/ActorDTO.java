package carevn.luv2code.MovieNest.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ActorDTO {

    String name;

    String character; // Tên vai diễn

    String gender;

    String biography; // tiểu sử

    Date birthday;

    String placeOfBirth;

    private String profilePath;

//    private MovieDetail movieDetail;
}
