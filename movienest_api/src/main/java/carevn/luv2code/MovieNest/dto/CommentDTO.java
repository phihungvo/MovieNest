package carevn.luv2code.MovieNest.dto;

import carevn.luv2code.MovieNest.enums.CommentStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentDTO {
    UUID id;

    @NotNull
    String content;

    int likeCount;

    int dislikeCount;

    Date createAt;

    Date updatedAt;

    UUID movieId;

    String movieName;

    UUID userId;

    String userName;

    boolean isEdited;

    boolean isHidden;

    @NotNull(message = "Trailer type is required")
    CommentStatus status;

    UUID parentId;

    List<CommentDTO> replies = new ArrayList<>();

}