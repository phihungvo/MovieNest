package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.CommentDTO;
import carevn.luv2code.MovieNest.dto.requests.CommentUpdateRequest;
import carevn.luv2code.MovieNest.entity.Comment;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.enums.CommentStatus;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.mapper.CommentMapper;
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

    public CommentServiceImpl(CommentRepository commentRepository,
                              CommentMapper commentMapper,
                              MovieRepository movieRepository,
                              UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
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
        comment.setStatus(CommentStatus.PENDING);

        if (request.getIsHidden() != null) {
            comment.setHidden(request.getIsHidden());
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
        // Soft delete: Chỉ ẩn comment thay vì xóa
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
            dto.setCreateAt(comment.getCreateAt());
            dto.setUpdatedAt(comment.getUpdatedAt());
            dto.setEdited(comment.isEdited());
            dto.setHidden(comment.isHidden());
            dto.setStatus(comment.getStatus());
            dto.setMovieName(comment.getMovie().getTitle());
            dto.setUsername(comment.getUser().getUsername());
            return dto;
        });
    }

    @Override
    public List<CommentDTO> getAllCommentsNotHidden() {
        // Chỉ lấy các comment gốc không bị ẩn
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
    public List<CommentDTO> getCommentByMovieId(UUID movieId) {
        List<Comment> comments = commentRepository.getCommentsByMovieId(movieId);
        return commentMapper.toDtoList(comments);
    }

    @Override
    @Transactional
    public CommentDTO replyToComment(UUID parentId, CommentDTO replyDTO){
        Comment parentComment = commentRepository.findById(parentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        Comment reply = commentMapper.toComment(replyDTO);
        reply.setCreateAt(new Date());
        reply.setUpdatedAt(new Date());
        reply.setParentComment(parentComment);

        reply.setMovie(parentComment.getMovie());

        if (replyDTO.getUserId() != null) {
            User user = userRepository.findById(replyDTO.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            reply.setUser(user);
        }

        Comment savedReply = commentRepository.save(reply);

        return commentMapper.toDto(savedReply);
    }

//    @Override
//    public void softDeleteComment(UUID commentId) {
//        commentRepository.softDeleteComment(commentId);
//    }
}