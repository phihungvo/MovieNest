package carevn.luv2code.MovieNest.dto;

import carevn.luv2code.MovieNest.entity.Comment;
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
public class CommentDTO {

    @NotNull
    String content;

    Date createAt;

    UUID movieId;

    UUID userId;

    String username;

    boolean isEdited;

    boolean isHidden;

    UUID parentId;

    List<CommentDTO> replies = new ArrayList<>();

}