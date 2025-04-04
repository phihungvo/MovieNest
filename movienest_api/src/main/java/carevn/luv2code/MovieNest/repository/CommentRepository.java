package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    // Lấy tất cả comment gốc (không phải comment con) chưa bị ẩn
    @Query("SELECT c FROM Comment c WHERE c.isHidden = false AND c.parentComment IS NULL")
    List<Comment> getRootCommentsNotHidden();

    // Lấy tất cả comment (cả gốc và con) chưa bị ẩn
    @Query("SELECT c FROM Comment c WHERE c.isHidden = false")
    List<Comment> getAllCommentsNotHidden();

    @Query("SELECT c FROM Comment c WHERE c.movie.id = :movieId AND c.isHidden = false AND c.parentComment IS NULL")
    List<Comment> getCommentsByMovieId(UUID movieId);

    List<Comment> getCommentByUserId(UUID userId);

    @Query("UPDATE Comment c SET c.isHidden = true WHERE c.id = :commentId")
    void softDeleteComment(UUID commentId);

    Page<Comment> findAll(Pageable pageable);
}
