package carevn.luv2code.MovieNest.dto.requests;

import carevn.luv2code.MovieNest.enums.CommentStatus;
import lombok.Data;

@Data
public class CommentUpdateRequest {
    private String content;
}
