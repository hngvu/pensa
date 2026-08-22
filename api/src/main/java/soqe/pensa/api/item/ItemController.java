package soqe.pensa.api.item;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping("/projects/{projectHandle}/items")
    public List<ItemResponse> getItemsByProject(@PathVariable String projectHandle) {
        return itemService.getItemsByProject(projectHandle);
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse createItem(@Valid @RequestBody CreateItemRequest request) {
        return itemService.createItem(request);
    }

    @GetMapping("/items/{handle}")
    public ItemResponse getItem(@PathVariable String handle) {
        return itemService.getItem(handle);
    }

    @PatchMapping("/items/{handle}")
    public ItemResponse updateItem(
            @PathVariable String handle,
            @Valid @RequestBody UpdateItemRequest request) {
        System.out.println("PATCH /items/" + handle + " -> " + request);
        try {
            return itemService.updateItem(handle, request);
        } catch (Exception e) {
            e.printStackTrace();
            Throwable cause = e.getCause();
            while (cause != null) {
                System.out.println("CAUSE: " + cause.getClass().getName() + ": " + cause.getMessage());
                if (cause instanceof jakarta.validation.ConstraintViolationException) {
                    var cve = (jakarta.validation.ConstraintViolationException) cause;
                    cve.getConstraintViolations().forEach(cv -> System.out.println("VIOLATION: " + cv.getPropertyPath() + " " + cv.getMessage()));
                }
                cause = cause.getCause();
            }
            throw e;
        }
    }

    @PostMapping("/items/{handle}/labels/{labelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void assignLabel(@PathVariable String handle, @PathVariable java.util.UUID labelId) {
        itemService.assignLabel(handle, labelId);
    }

    @DeleteMapping("/items/{handle}/labels/{labelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeLabel(@PathVariable String handle, @PathVariable java.util.UUID labelId) {
        itemService.removeLabel(handle, labelId);
    }

    @DeleteMapping("/items/{handle}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable String handle) {
        itemService.deleteItem(handle);
    }
}
