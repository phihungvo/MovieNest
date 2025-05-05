package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    @Query("SELECT c FROM Comment c WHERE c.isHidden = false AND c.parentComment IS NULL")
    List<Comment> getRootCommentsNotHidden();

    @Query("SELECT c FROM Comment c WHERE c.isHidden = false")
    List<Comment> getAllCommentsNotHidden();

    @Query("SELECT c FROM Comment c WHERE c.movie.id = :movieId AND c.isHidden = false AND c.parentComment IS NULL")
    List<Comment> getCommentsByMovieId(UUID movieId);

    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.childComments WHERE c.movie.id = :movieId AND c.parentComment IS NULL")
    Page<Comment> findTopLevelCommentsWithReplies(UUID movieId, Pageable pageable);

    List<Comment> getCommentByUserId(UUID userId);

    @Query("UPDATE Comment c SET c.isHidden = true WHERE c.id = :commentId")
    void softDeleteComment(UUID commentId);

    Page<Comment> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"user", "movie", "childComments"})
    Page<Comment> findByMovieId(UUID movieId, Pageable pageable);

    // Lấy tất cả các comment gốc (không có parent) theo movieId
    Page<Comment> findByMovieIdAndParentCommentIsNull(UUID movieId, Pageable pageable);

//    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.movie LEFT JOIN FETCH c.childComments WHERE c.movie.id = :movieId")
//    Page<Comment> findByMovieId(@Param("movieId") UUID movieId, Pageable pageable);

}