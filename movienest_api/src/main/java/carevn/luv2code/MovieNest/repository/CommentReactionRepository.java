package carevn.luv2code.MovieNest.repository;

import carevn.luv2code.MovieNest.entity.Comment;
import carevn.luv2code.MovieNest.entity.CommentReaction;
import carevn.luv2code.MovieNest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CommentReactionRepository extends JpaRepository<CommentReaction, UUID> {
    Optional<CommentReaction> findByCommentAndUser(Comment comment, User user);
}


