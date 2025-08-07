package com.kanban.user.interfaces.rest;

import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.user.domain.model.User;
import com.kanban.user.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AvatarController.class)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
class AvatarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setDisplayName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setAvatar("avatar.jpg");
        testUser.setEnabled(true);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        // Create UserDetails for authentication
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser")
                .password("password123")
                .authorities("USER")
                .build();

        // Set up authentication context
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(
                userDetails, 
                null, 
                Collections.singletonList(new SimpleGrantedAuthority("USER"))
            );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void testUploadAvatar_Success() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test-avatar.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_NoFile() throws Exception {
        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUploadAvatar_EmptyFile() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "empty.jpg",
            "image/jpeg",
            new byte[0]
        );

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUploadAvatar_UserNotFound() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test-avatar.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isNotFound());

        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void testUploadAvatar_LargeFile() throws Exception {
        // Arrange
        byte[] largeFileContent = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "large-avatar.jpg",
            "image/jpeg",
            largeFileContent
        );

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isPayloadTooLarge());
    }

    @Test
    void testUploadAvatar_PngFile() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test-avatar.png",
            "image/png",
            "test png content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_GifFile() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test-avatar.gif",
            "image/gif",
            "test gif content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_WebpFile() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test-avatar.webp",
            "image/webp",
            "test webp content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_FileWithSpecialCharacters() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test-avatar@#$%.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_MultipleFiles() throws Exception {
        // Arrange
        MockMultipartFile file1 = new MockMultipartFile(
            "file",
            "test-avatar1.jpg",
            "image/jpeg",
            "test image content 1".getBytes()
        );
        MockMultipartFile file2 = new MockMultipartFile(
            "file",
            "test-avatar2.jpg",
            "image/jpeg",
            "test image content 2".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file1)
                .file(file2))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_FileWithSpaces() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test avatar with spaces.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_FileWithoutExtension() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test-avatar",
            "image/jpeg",
            "test image content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_FileWithLongName() throws Exception {
        // Arrange
        String longFileName = "a".repeat(200) + ".jpg";
        MockMultipartFile file = new MockMultipartFile(
            "file",
            longFileName,
            "image/jpeg",
            "test image content".getBytes()
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUploadAvatar_InvalidFileType() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test-avatar.txt",
            "text/plain",
            "test text content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/avatar/upload")
                .file(file))
                .andExpect(status().isBadRequest());
    }
} 