package soqe.pensa.api.user;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByIdentifier(String identifier) {
        User user;
        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
        } else {
            user = userRepository.findByUsername(identifier)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
        }
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> searchUsers(
            String email, String username, String fullName, Boolean isActive, 
            String workspaceHandle, String projectHandle, Pageable pageable) {
        
        Specification<User> spec = Specification.where((Specification<User>) null);
        
        if (email != null) spec = spec.and(UserSpecification.withEmail(email));
        if (username != null) spec = spec.and(UserSpecification.withUsername(username));
        if (fullName != null) spec = spec.and(UserSpecification.withFullName(fullName));
        if (isActive != null) spec = spec.and(UserSpecification.isActive(isActive));
        if (workspaceHandle != null) spec = spec.and(UserSpecification.inWorkspace(workspaceHandle));
        if (projectHandle != null) spec = spec.and(UserSpecification.inProject(projectHandle));

        return userRepository.findAll(spec, pageable).map(UserResponse::fromEntity);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        User user = new User();
        user.setEmail(request.email());
        user.setUsername(request.username());
        user.setFullName(request.fullName());
        user.setAvatarUrl(request.avatarUrl());
        user.setActive(true);
        
        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (request.username() != null) {
            if (!request.username().equals(user.getUsername()) && userRepository.findByUsername(request.username()).isPresent()) {
                 throw new IllegalArgumentException("Username already exists");
            }
            user.setUsername(request.username());
        }
        if (request.fullName() != null) {
            user.setFullName(request.fullName());
        }
        if (request.avatarUrl() != null) {
            user.setAvatarUrl(request.avatarUrl());
        }
        
        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String identifier, UUID currentUserId) {
        User user;
        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
        } else {
            user = userRepository.findByUsername(identifier)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
        }
        
        user.markDeleted(currentUserId);
        
        // Obfuscate unique fields to release them for future reuse
        long timestamp = System.currentTimeMillis();
        user.setUsername(user.getUsername() + "_del_" + timestamp);
        user.setEmail(user.getEmail() + "_del_" + timestamp);
        
        userRepository.save(user);
    }
}
