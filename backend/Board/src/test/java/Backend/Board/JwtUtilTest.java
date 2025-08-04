package Backend.Board;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import Backend.Board.config.JwtUtil;

public class JwtUtilTest {

    @Test
    public void testGenerateAndValidateToken() {
        JwtUtil jwtUtil = new JwtUtil();
        UserDetails userDetails = User.withUsername("testuser").password("password").roles("USER").build();

        String token = jwtUtil.generateToken(userDetails);
        assertNotNull(token);

        boolean isValid = jwtUtil.validateToken(token, userDetails);
        assertTrue(isValid);
    }
}