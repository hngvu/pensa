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
        return itemService.updateItem(handle, request);
    }

    @DeleteMapping("/items/{handle}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable String handle) {
        itemService.deleteItem(handle);
    }
}
