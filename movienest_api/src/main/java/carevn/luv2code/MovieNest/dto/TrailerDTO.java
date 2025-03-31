package carevn.luv2code.MovieNest.dto;

import carevn.luv2code.MovieNest.custom_anotation.ValidEnum;
import carevn.luv2code.MovieNest.enums.TrailerType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TrailerDTO {

     String title;

     String key;

     String site;

     @NotNull(message = "Trailer type is required")
     @ValidEnum(enumClass = TrailerType.class, message = "Invalid trailer type")
     TrailerType trailerType;

     boolean official;

     UUID movieId;

     Date publishedAt;
}
