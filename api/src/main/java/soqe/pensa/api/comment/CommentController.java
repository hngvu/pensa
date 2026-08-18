package soqe.pensa.api.comment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/items/{itemHandle}/comments")
    public List<CommentResponse> getCommentsByItem(@PathVariable String itemHandle) {
        return commentService.getCommentsByItem(itemHandle);
    }

    @PostMapping("/items/{itemHandle}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse createComment(
            @PathVariable String itemHandle,
            @Valid @RequestBody CreateCommentRequest request) {
        return commentService.createComment(itemHandle, request);
    }

    @PatchMapping("/comments/{id}")
    public CommentResponse updateComment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCommentRequest request) {
        return commentService.updateComment(id, request);
    }

    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable UUID id) {
        commentService.deleteComment(id);
    }
}
