package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.CommentDTO;
import carevn.luv2code.MovieNest.dto.requests.CommentReactionRequest;
import carevn.luv2code.MovieNest.dto.requests.CommentUpdateRequest;
import carevn.luv2code.MovieNest.entity.Comment;
import carevn.luv2code.MovieNest.service.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/notHidden")
    public ResponseEntity<List<CommentDTO>> getCommentsNotHidden() {
        List<CommentDTO> commentDTOs = commentService.getAllCommentsNotHidden();
        return new ResponseEntity<>(commentDTOs, HttpStatus.OK);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Page<CommentDTO>> getCommentsByMovieId(
            @PathVariable UUID movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<CommentDTO> comments = commentService.getCommentByMovieId(movieId, page, size);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable UUID id) {
        CommentDTO commentDTO = commentService.getCommentById(id);
        return new ResponseEntity<>(commentDTO, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO comment) {
        CommentDTO createdComment = commentService.createComment(comment);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @PostMapping("/{parentId}/reply")
    public ResponseEntity<CommentDTO> replyToComment(
            @PathVariable UUID parentId,
            @RequestBody CommentDTO replyDTO
    ) {
        // Call the service to handle the reply logic
        CommentDTO createdReply = commentService.replyToComment(parentId, replyDTO);
        return new ResponseEntity<>(createdReply, HttpStatus.CREATED);
    }

//    @PutMapping("/{commentId}")
//    public ResponseEntity<CommentDTO> updateComment(
//            @PathVariable UUID commentId,
//            @RequestBody CommentDTO commentDTO
//    ){
//        CommentDTO updatedComment = commentService.updateComment(commentId, commentDTO);
//        return new ResponseEntity<>(updatedComment, HttpStatus.OK);
//    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable UUID commentId,
                                                    @RequestBody CommentUpdateRequest commentUpdateRequest) {
        CommentDTO commentDTO = commentService.updateCommentForUser(commentId, commentUpdateRequest);
        return new ResponseEntity<>(commentDTO, HttpStatus.OK);
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateCommentForUser(@PathVariable UUID commentId,
                                                     @RequestBody CommentUpdateRequest updateRequest){
        CommentDTO updatedComment = commentService.updateCommentForUser(commentId, updateRequest);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable UUID commentId){
        commentService.deleteComment(commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<CommentDTO>> getAllComment(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ){
        Page<CommentDTO> comments = commentService.getAllComments(page, size);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping("/{commentId}/reaction")
    public ResponseEntity<?> reactToComment(@PathVariable UUID commentId,
                                            @RequestBody CommentReactionRequest request) {
        commentService.reactToComment(commentId, request.getUserId(), request.getReaction());
        return ResponseEntity.ok(Map.of("message", "Reaction updated successfully"));
    }


//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<CommentDTO>> getCommentByUserId(@PathVariable(name = "userId") UUID userId) {
//        List<CommentDTO> commentDTOS = commentService.getCommentByUserId(userId);
//        return new ResponseEntity<>(commentDTOS, HttpStatus.OK);
//    }
//
//    @GetMapping("/movie/{movieId}")
//    public ResponseEntity<List<CommentDTO>> getCommentByMovieId(@PathVariable(name="movieId") UUID movieId){
//        List<CommentDTO> commentDTOS = commentService.getCommentByMovieId(movieId);
//        return new ResponseEntity<>(commentDTOS, HttpStatus.OK);
//    }

//    @DeleteMapping("/movie/{commentId}")
//    public ResponseEntity<Void> deleteComment(@PathVariable UUID commentId) {
//        commentService.softDeleteComment(commentId);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

}