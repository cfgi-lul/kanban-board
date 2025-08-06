# Backend Folder Structure

## Overview
This is a Spring Boot application for a Kanban Board system with comprehensive features including authentication, real-time updates, analytics, and file management.

## Root Structure
```
backend/
├── Board/                          # Main Spring Boot application
│   ├── src/                        # Source code
│   ├── target/                     # Compiled classes and build artifacts
│   ├── uploads/                    # File uploads (avatars, attachments)
│   ├── pom.xml                     # Maven configuration
│   ├── checkstyle.xml              # Code style configuration
│   ├── spotbugs-exclude.xml        # Bug detection exclusions
│   ├── LINTING.md                  # Linting documentation
│   ├── Dockerfile                  # Container configuration
│   ├── mvnw                        # Maven wrapper (Unix)
│   └── mvnw.cmd                    # Maven wrapper (Windows)
```

## Source Code Structure (`src/`)

### Main Application (`src/main/`)
```
src/main/
├── java/Backend/Board/             # Main Java package
│   ├── BoardApplication.java        # Spring Boot main class
│   ├── controller/                  # REST API controllers
│   ├── service/                    # Business logic services
│   ├── model/                      # JPA entities
│   ├── repository/                  # Data access layer
│   ├── dto/                        # Data Transfer Objects
│   ├── mappers/                    # Object mappers
│   ├── config/                     # Configuration classes
│   ├── exception/                  # Custom exceptions
│   ├── handler/                    # Exception handlers
│   ├── validation/                 # Custom validators
│   ├── response/                   # Response models
│   └── health/                     # Health check indicators
└── resources/
    └── application.properties      # Application configuration
```

### Test Code (`src/test/`)
```
src/test/java/Backend/Board/
├── BoardApplicationTests.java       # Main application tests
├── AuthControllerTest.java         # Authentication tests
├── BoardControllerTest.java        # Board management tests
├── BoardRoleServiceTest.java       # Role service tests
├── UserMapperTest.java             # Mapper tests
├── TaskDTOTest.java               # DTO tests
├── JwtUtilTest.java               # JWT utility tests
└── exception/                      # Exception handling tests
```

## Detailed Package Structure

### Controllers (`controller/`)
REST API endpoints for different features:
- **AuthController.java** - Authentication & authorization
- **BoardController.java** - Board management operations
- **TaskController.java** - Task CRUD operations
- **ColumnController.java** - Column management
- **UserController.java** - User management
- **CommentController.java** - Comment operations
- **LabelController.java** - Label management
- **AttachmentController.java** - File upload/download
- **NotificationController.java** - Notification system
- **AnalyticsController.java** - Analytics & reporting
- **SearchController.java** - Search functionality
- **PerformanceController.java** - Performance metrics
- **AvatarController.java** - User avatar management

### Services (`service/`)
Business logic implementation:
- **AnalyticsService.java** - Analytics calculations
- **NotificationService.java** - Notification management
- **BoardWebSocketService.java** - Real-time updates
- **SearchService.java** - Search functionality
- **PerformanceService.java** - Performance monitoring
- **BoardRoleService.java** - Role management
- **BoardSecurityService.java** - Security operations
- **CustomUserDetailsService.java** - User authentication

### Models (`model/`)
JPA entities representing database tables:
- **User.java** - User entity
- **Board.java** - Board entity
- **Task.java** - Task entity
- **BoardColumn.java** - Column entity
- **Comment.java** - Comment entity
- **Label.java** - Label entity
- **Attachment.java** - File attachment entity
- **Notification.java** - Notification entity
- **Role.java** - Role entity
- **UserBoardRole.java** - User-board role mapping
- **TaskStatus.java** - Task status enum
- **TaskPriority.java** - Task priority enum
- **BoardRoleType.java** - Board role types enum

### Repositories (`repository/`)
Data access layer using Spring Data JPA:
- **UserRepository.java** - User data access
- **BoardRepository.java** - Board data access
- **TaskRepository.java** - Task data access
- **ColumnRepository.java** - Column data access
- **CommentRepository.java** - Comment data access
- **LabelRepository.java** - Label data access
- **AttachmentRepository.java** - Attachment data access
- **NotificationRepository.java** - Notification data access
- **RoleRepository.java** - Role data access
- **UserBoardRoleRepository.java** - User-board role data access

### Configuration (`config/`)
Application configuration classes:
- **SecurityConfig.java** - Spring Security configuration
- **SwaggerConfig.java** - API documentation setup
- **CacheConfig.java** - Caching configuration
- **MetricsConfig.java** - Metrics and monitoring
- **LoggingConfig.java** - Logging configuration
- **WebSocketConfig.java** - WebSocket setup
- **JwtUtil.java** - JWT utility functions
- **JwtRequestFilter.java** - JWT authentication filter
- **DataInitializer.java** - Initial data setup

### DTOs (`dto/`)
Data Transfer Objects for API communication:
- Request/response models for all entities
- Validation annotations
- API documentation annotations

### Mappers (`mappers/`)
Object mapping between entities and DTOs:
- Entity to DTO conversion
- DTO to entity conversion
- Custom mapping logic

### Exceptions (`exception/`)
Custom exception classes:
- **AuthenticationException.java** - Auth-related errors
- **BusinessLogicException.java** - Business rule violations
- **DatabaseException.java** - Database errors
- **ValidationException.java** - Validation errors
- **ResourceNotFoundException.java** - Resource not found
- **ExternalServiceException.java** - External service errors

### Validation (`validation/`)
Custom validation logic:
- **UniqueUsername.java** - Username uniqueness annotation
- **UniqueUsernameValidator.java** - Username validation

### Response (`response/`)
Standardized response models:
- **ErrorResponse.java** - Error response format
- **PaginatedResponse.java** - Pagination response format

### Health (`health/`)
Health check indicators:
- **DatabaseHealthIndicator.java** - Database health monitoring

## Build & Deployment Files

### Maven Configuration
- **pom.xml** - Dependencies, plugins, and build configuration
- **mvnw/mvnw.cmd** - Maven wrapper scripts

### Code Quality
- **checkstyle.xml** - Code style rules
- **spotbugs-exclude.xml** - Bug detection exclusions
- **LINTING.md** - Linting documentation

### Containerization
- **Dockerfile** - Docker container configuration
- **.dockerignore** - Docker ignore patterns

### Configuration
- **application.properties** - Application settings
- **.gitignore** - Git ignore patterns

## Key Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control
- Spring Security integration

### 📊 Analytics & Monitoring
- Performance metrics
- User analytics
- System health monitoring

### 🔄 Real-time Updates
- WebSocket support
- Live board updates
- Notification system

### 📁 File Management
- Avatar uploads
- Task attachments
- File storage

### 🔍 Search & Filtering
- Advanced search functionality
- Task filtering
- User search

### 📈 Reporting
- Analytics dashboard
- Performance reports
- User activity tracking

## Technology Stack

- **Framework**: Spring Boot 3.4.1
- **Database**: H2 (development)
- **Security**: Spring Security + JWT
- **Documentation**: Swagger/OpenAPI
- **Real-time**: WebSocket
- **Build Tool**: Maven
- **Java Version**: 17
- **Code Quality**: Checkstyle, SpotBugs, PMD

This structure follows Spring Boot best practices with clear separation of concerns and comprehensive feature coverage for a modern Kanban board application. 