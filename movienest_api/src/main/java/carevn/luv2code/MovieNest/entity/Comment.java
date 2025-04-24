
package carevn.luv2code.MovieNest.entity;

import carevn.luv2code.MovieNest.enums.CommentStatus;
import carevn.luv2code.MovieNest.enums.TrailerType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comment")
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString(exclude = {"movie", "user", "parentComment", "childComments"})
public class Comment {

    @Id
    @GeneratedValue
    UUID id;

    String content;

    int likeCount;

    int dislikeCount;

    Date createAt;

    Date updatedAt;

    boolean isEdited;

    boolean isHidden;

    @Enumerated(EnumType.STRING)
            @Column(name = "status")
    CommentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    @JsonIgnore
    Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    User user;

    // Quan hệ parent-child giữa các comment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Comment> childComments = new ArrayList<>();
}
