package carevn.luv2code.MovieNest.dto;

import carevn.luv2code.MovieNest.enums.TrailerType;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class TrailerDTO {

    private String title;

    private String key;

    private String site;

    private TrailerType trailerType;

    private boolean official;

    private UUID movieId;

    private Date publishedAt;
}
