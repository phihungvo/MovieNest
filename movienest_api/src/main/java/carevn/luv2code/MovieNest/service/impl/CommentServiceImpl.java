package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.CommentDTO;
import carevn.luv2code.MovieNest.dto.requests.CommentUpdateRequest;
import carevn.luv2code.MovieNest.entity.Comment;
import carevn.luv2code.MovieNest.entity.CommentReaction;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.enums.CommentStatus;
import carevn.luv2code.MovieNest.enums.ReactionType;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.mapper.CommentMapper;
import carevn.luv2code.MovieNest.repository.CommentReactionRepository;
import carevn.luv2code.MovieNest.repository.CommentRepository;
import carevn.luv2code.MovieNest.repository.MovieRepository;
import carevn.luv2code.MovieNest.repository.UserRepository;
import carevn.luv2code.MovieNest.service.CommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

    private final CommentRepository commentRepository;

    private final CommentMapper commentMapper;

    private final MovieRepository movieRepository;

    private final UserRepository userRepository;

    private final CommentReactionRepository reactionRepository;;

    public CommentServiceImpl(CommentRepository commentRepository,
                              CommentMapper commentMapper,
                              MovieRepository movieRepository,
                              UserRepository userRepository,
                              CommentReactionRepository reactionRepository) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.reactionRepository = reactionRepository;
    }

    @Override
    @Transactional
    public CommentDTO createComment(CommentDTO commentDTO) {
        Comment comment = commentMapper.toComment(commentDTO);
        comment.setCreateAt(new Date());
        comment.setUpdatedAt(new Date());
        comment.setStatus(CommentStatus.PENDING);

        if (commentDTO.getMovieId() != null) {
            Movie movie = movieRepository.findById(commentDTO.getMovieId())
                    .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));
            comment.setMovie(movie);
        }

        if (commentDTO.getUserId() != null) {
            User user = userRepository.findById(commentDTO.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            comment.setUser(user);
        }

        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toDtoWithReplies(savedComment);
    }

    @Override
    @Transactional
    public CommentDTO updateComment(UUID commentId, CommentDTO commentDTO) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        existingComment.setContent(commentDTO.getContent());
        existingComment.setUpdatedAt(new Date());
        existingComment.setEdited(true);
        existingComment.setStatus(commentDTO.getStatus());

        Comment updatedComment = commentRepository.save(existingComment);
        return commentMapper.toDtoWithReplies(updatedComment);
    }

    @Override
    public CommentDTO updateCommentForUser(UUID id, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        if (request.getContent() != null) {
            comment.setContent(request.getContent());
            comment.setEdited(true);
        }
        comment.setUpdatedAt(new Date());

        return commentMapper.toDtoWithReplies(commentRepository.save(comment));
    }

    @Override
    @Transactional
    public void softDeleteComment(UUID commentId) {
        // Soft delete: Chỉ ẩn comment thay vì xóa
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        comment.setHidden(true);
        commentRepository.save(comment);
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        commentRepository.delete(comment);
    }

    @Override
    public CommentDTO getCommentById(UUID commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        return commentMapper.toDtoWithReplies(comment);
    }

    @Override
    public Page<CommentDTO> getAllComments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> pageComments = commentRepository.findAll(pageable);

        return pageComments.map(comment -> {
            CommentDTO dto = new CommentDTO();
            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setLikeCount(comment.getLikeCount());
            dto.setDislikeCount(comment.getDislikeCount());
            dto.setCreateAt(comment.getCreateAt());
            dto.setUpdatedAt(comment.getUpdatedAt());
            dto.setEdited(comment.isEdited());
            dto.setHidden(comment.isHidden());
            dto.setStatus(comment.getStatus());
            dto.setMovieName(comment.getMovie().getTitle());
            dto.setUserName(comment.getUser().getUserName());
            return dto;
        });
    }

    @Override
    public List<CommentDTO> getAllCommentsNotHidden() {
        List<Comment> comments = commentRepository.getRootCommentsNotHidden();
        return commentMapper.toDtoList(comments);
    }

    @Override
    public List<CommentDTO> getCommentByUserId(UUID userId) {
        userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND));
        List<Comment> comments = commentRepository.getCommentByUserId(userId);
        return commentMapper.toDtoList(comments);
    }

    @Override
    public Page<CommentDTO> getCommentByMovieId(UUID movieId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> rootComments = commentRepository.findByMovieIdAndParentCommentIsNull(movieId, pageable);

        // Chuyển đổi sang DTO và đảm bảo các reply được bao gồm
        return rootComments.map(rootComment -> {
            try {
                return commentMapper.toDtoWithReplies(rootComment);
            } catch (Exception e) {
                logger.error("Lỗi khi chuyển đổi Comment sang DTO: ", e);
                throw new RuntimeException("Lỗi khi chuyển đổi Comment sang DTO: " + e.getMessage(), e);
            }
        });
    }

    @Override
    @Transactional
    public CommentDTO replyToComment(UUID parentId, CommentDTO replyDTO) {
        // Fetch the parent comment
        Comment parentComment = commentRepository.findById(parentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        // Map the reply DTO to an entity
        Comment reply = commentMapper.toComment(replyDTO);
        reply.setCreateAt(new Date());
        reply.setUpdatedAt(new Date());
        reply.setParentComment(parentComment);
        reply.setMovie(parentComment.getMovie());
        reply.setStatus(CommentStatus.PENDING);

        // Set the user for the reply
        if (replyDTO.getUserId() != null) {
            User user = userRepository.findById(replyDTO.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            reply.setUser(user);
        }

        // Save the reply
        Comment savedReply = commentRepository.save(reply);

        // Map the saved reply back to a DTO
        CommentDTO resultDTO = commentMapper.toDtoWithReplies(savedReply);
        resultDTO.setParentId(parentId);

        return resultDTO;
    }

    @Override
    @Transactional
    public void reactToComment(UUID commentId, UUID userId, ReactionType reactionType) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Optional<CommentReaction> existingReaction = reactionRepository.findByCommentAndUser(comment, user);

        if (existingReaction.isPresent()) {
            CommentReaction current = existingReaction.get();

            if (current.getType() == reactionType) {
                // Nếu đã like/dislike rồi => hủy
                reactionRepository.delete(current);
                if (reactionType == ReactionType.LIKE) {
                    comment.setLikeCount(comment.getLikeCount() - 1);
                } else {
                    comment.setDislikeCount(comment.getDislikeCount() - 1);
                }
            } else {
                // Chuyển từ like sang dislike hoặc ngược lại
                if (current.getType() == ReactionType.LIKE) {
                    comment.setLikeCount(comment.getLikeCount() - 1);
                    comment.setDislikeCount(comment.getDislikeCount() + 1);
                } else {
                    comment.setLikeCount(comment.getLikeCount() + 1);
                    comment.setDislikeCount(comment.getDislikeCount() - 1);
                }
                current.setType(reactionType);
                reactionRepository.save(current);
            }
        } else {
            // Chưa có reaction nào
            CommentReaction newReaction = new CommentReaction(null, comment, user, reactionType);
            reactionRepository.save(newReaction);

            if (reactionType == ReactionType.LIKE) {
                comment.setLikeCount(comment.getLikeCount() + 1);
            } else {
                comment.setDislikeCount(comment.getDislikeCount() + 1);
            }
        }

        commentRepository.save(comment);
    }


}