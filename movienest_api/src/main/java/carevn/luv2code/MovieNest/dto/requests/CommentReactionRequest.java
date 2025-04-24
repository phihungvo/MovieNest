package carevn.luv2code.MovieNest.dto.requests;

import carevn.luv2code.MovieNest.enums.ReactionType;
import lombok.Data;

import java.util.UUID;

@Data
public class CommentReactionRequest {
    UUID userId;
    ReactionType reaction;
}
