package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.CommentDTO;
import carevn.luv2code.MovieNest.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CommentService {

    CommentDTO createComment(CommentDTO comment);

    CommentDTO updateComment(UUID id, CommentDTO comment);

    void deleteComment(UUID id);

    CommentDTO getCommentById(UUID id);

    Page<Comment> getAllComments(int page, int size);

    List<CommentDTO> getAllCommentsNotHidden();

    List<CommentDTO> getCommentByUserId(UUID userId);

    List<CommentDTO> getCommentByMovieId(UUID movieId);

    CommentDTO replyToComment(UUID parentId, CommentDTO comment);

//    void softDeleteComment(UUID commentId);
}
