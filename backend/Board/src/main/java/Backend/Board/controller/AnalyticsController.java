package Backend.Board.controller;

import Backend.Board.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Get board analytics
     */
    @GetMapping("/board/{boardId}")
    public ResponseEntity<AnalyticsService.BoardAnalytics> getBoardAnalytics(@PathVariable Long boardId) {
        try {
            AnalyticsService.BoardAnalytics analytics = analyticsService.getBoardAnalytics(boardId);
            return ResponseEntity.ok(analytics);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get user analytics
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<AnalyticsService.UserAnalytics> getUserAnalytics(@PathVariable Long userId) {
        try {
            AnalyticsService.UserAnalytics analytics = analyticsService.getUserAnalytics(userId);
            return ResponseEntity.ok(analytics);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get system-wide analytics
     */
    @GetMapping("/system")
    public ResponseEntity<AnalyticsService.SystemAnalytics> getSystemAnalytics() {
        AnalyticsService.SystemAnalytics analytics = analyticsService.getSystemAnalytics();
        return ResponseEntity.ok(analytics);
    }

    /**
     * Get productivity metrics for a board in a date range
     */
    @GetMapping("/productivity/{boardId}")
    public ResponseEntity<AnalyticsService.ProductivityMetrics> getProductivityMetrics(
            @PathVariable Long boardId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        try {
            AnalyticsService.ProductivityMetrics metrics = analyticsService.getProductivityMetrics(boardId, fromDate, toDate);
            return ResponseEntity.ok(metrics);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get current user's analytics
     */
    @GetMapping("/my-analytics")
    public ResponseEntity<AnalyticsService.UserAnalytics> getMyAnalytics(@AuthenticationPrincipal UserDetails userDetails) {
        // This would need to get the user ID from userDetails
        // For now, returning 404 as placeholder
        return ResponseEntity.notFound().build();
    }

    /**
     * Get productivity metrics for current user
     */
    @GetMapping("/my-productivity")
    public ResponseEntity<AnalyticsService.ProductivityMetrics> getMyProductivityMetrics(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        // This would need to get the user ID from userDetails
        // For now, returning 404 as placeholder
        return ResponseEntity.notFound().build();
    }
} 