package carevn.luv2code.MovieNest.mapper;

import carevn.luv2code.MovieNest.dto.CommentDTO;
import carevn.luv2code.MovieNest.entity.Comment;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Component
@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(source = "movie.id", target="movieId")
    @Mapping(source = "user.id", target="userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "parentComment.id", target = "parentId")
    @Mapping(target = "replies", ignore = true)
    CommentDTO toDto(Comment comment);

    @Mapping(target = "movie", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "parentComment", ignore = true)
    @Mapping(target = "childComments", ignore = true)
    Comment toComment(CommentDTO commentDTO);

    // Phương thức chính để ánh xạ danh sách Comment sang CommentDTO
    default List<CommentDTO> toDtoList(List<Comment> comments){
        if (comments == null) return null;

        // Chỉ lấy các comment gốc (không phải comment con)
        return comments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(comment -> toDtoWithReplies(comment))
                .collect(Collectors.toList());
    }

    // Phương thức đệ quy để ánh xạ comment và các comment con
    default CommentDTO toDtoWithReplies(Comment comment){
        if(comment == null) return null;

        CommentDTO dto = toDto(comment);

        // Ánh xạ các comment con
        if (comment.getChildComments() != null && !comment.getChildComments().isEmpty()) {
            dto.setReplies(comment.getChildComments().stream()
                    .map(this::toDtoWithReplies)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    List<Comment> toEntityList(List<CommentDTO> commentDTOs);

//    List<CommentDTO> toDtoList(List<Comment> comments);

    @AfterMapping
    default void linkMovieAndUser(CommentDTO dto, @MappingTarget Comment entity) {
        if (dto.getMovieId() != null) {
            Movie movie = new Movie();
            movie.setId(dto.getMovieId());
            entity.setMovie(movie);
        }

        if (dto.getUserId() != null) {
            User user = new User();
            user.setId(dto.getUserId());
            entity.setUser(user);
        }

        if (dto.getParentId() != null) {
            Comment parentComment = new Comment();
            parentComment.setId(dto.getParentId());
            entity.setParentComment(parentComment);
        }
    }


}
