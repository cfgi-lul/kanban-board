package Backend.Board;

import Backend.Board.controller.AuthController;
import Backend.Board.dto.AuthResponseDTO;
import Backend.Board.dto.UserDTO;
import Backend.Board.model.Role;
import Backend.Board.model.User;
import Backend.Board.repository.RoleRepository;
import Backend.Board.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUserWithOnlyUsernameAndPassword() {
        // Arrange
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("testuser");
        userDTO.setPassword("password123");
        // displayName is null

        Role userRole = new Role();
        userRole.setName("USER");
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        // Act
        ResponseEntity<AuthResponseDTO> response = authController.registerUser(userDTO);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getToken());
        assertNotNull(response.getBody().getUser());
        assertEquals("testuser", response.getBody().getUser().getUsername());

        // Verify that the user was saved with displayName set to username
        verify(userRepository).save(argThat(user -> 
            user.getUsername().equals("testuser") &&
            user.getDisplayName().equals("testuser") &&
            new BCryptPasswordEncoder().matches("password123", user.getPassword())
        ));
    }

    @Test
    void testRegisterUserWithDisplayName() {
        // Arrange
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("testuser");
        userDTO.setPassword("password123");
        userDTO.setDisplayName("Test User");

        Role userRole = new Role();
        userRole.setName("USER");
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        // Act
        ResponseEntity<AuthResponseDTO> response = authController.registerUser(userDTO);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getToken());
        assertNotNull(response.getBody().getUser());
        assertEquals("testuser", response.getBody().getUser().getUsername());

        // Verify that the user was saved with the provided displayName
        verify(userRepository).save(argThat(user -> 
            user.getUsername().equals("testuser") &&
            user.getDisplayName().equals("Test User") &&
            new BCryptPasswordEncoder().matches("password123", user.getPassword())
        ));
    }
} 