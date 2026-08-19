package soqe.pensa.api.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import soqe.pensa.api.common.CurrentUserProvider;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UUID userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @Valid @RequestBody UpdateUserRequest request) {
        UUID userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }

    @PostMapping("/sync")
    public ResponseEntity<UserResponse> syncUser(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody SyncUserRequest request) {
        return ResponseEntity.ok(userService.syncUser(jwt.getSubject(), request));
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String status,
            @RequestParam(name = "workspaceid", required = false) String workspaceHandle,
            @RequestParam(name = "projectid", required = false) String projectHandle,
            Pageable pageable) {
        
        Boolean isActive = null;
        if ("active".equalsIgnoreCase(status)) {
            isActive = true;
        } else if ("inactive".equalsIgnoreCase(status)) {
            isActive = false;
        }
        
        return ResponseEntity.ok(userService.searchUsers(email, username, fullName, isActive, workspaceHandle, projectHandle, pageable));
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<UserResponse> getUserByIdentifier(@PathVariable String identifier) {
        return ResponseEntity.ok(userService.getUserByIdentifier(identifier));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{identifier}")
    public ResponseEntity<Void> deleteUser(@PathVariable String identifier) {
        UUID currentUserId = currentUserProvider.getCurrentUserId();
        userService.deleteUser(identifier, currentUserId);
        return ResponseEntity.noContent().build();
    }
}
