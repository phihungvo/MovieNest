package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.CommentDTO;
import carevn.luv2code.MovieNest.dto.requests.CommentUpdateRequest;
import carevn.luv2code.MovieNest.entity.Comment;
import carevn.luv2code.MovieNest.enums.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CommentService {

    CommentDTO createComment(CommentDTO comment);

    CommentDTO updateComment(UUID id, CommentDTO comment);

    CommentDTO updateCommentForUser(UUID id, CommentUpdateRequest request);

    void softDeleteComment(UUID id);

    void deleteComment(UUID id);

    CommentDTO getCommentById(UUID id);

    Page<CommentDTO> getAllComments(int page, int size);

    List<CommentDTO> getAllCommentsNotHidden();

    List<CommentDTO> getCommentByUserId(UUID userId);

    Page<CommentDTO> getCommentByMovieId(UUID movieId, int page, int size);

    CommentDTO replyToComment(UUID parentId, CommentDTO comment);

    void reactToComment(UUID commentId, UUID userId, ReactionType reactionType);

//    void softDeleteComment(UUID commentId);
}