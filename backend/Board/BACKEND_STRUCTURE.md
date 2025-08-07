# Backend DDD Architecture Structure

## Overview
This is a Spring Boot application for a Kanban Board system built using Domain-Driven Design (DDD) principles. The application is organized into bounded contexts with clear separation of concerns and domain boundaries.

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

## DDD Architecture Overview

The application follows Domain-Driven Design principles with the following bounded contexts:

1. **Board Context** - Board management, columns, roles, and board-specific operations
2. **Task Context** - Task management, status, priority, and task-specific operations
3. **User Context** - User management, authentication, and user-specific operations
4. **Shared Context** - Cross-cutting concerns, common utilities, and shared infrastructure

Each bounded context follows the DDD layered architecture:
- **Domain Layer** - Core business logic, entities, value objects, and domain services
- **Application Layer** - Application services, use cases, and orchestration
- **Infrastructure Layer** - External concerns, persistence, messaging, and external services
- **Interface Layer** - REST controllers, DTOs, and external API contracts

## Source Code Structure (`src/`)

### Main Application (`src/main/java/com/kanban/`)

```
src/main/java/com/kanban/
├── KanbanApplication.java           # Spring Boot main class
├── board/                          # Board Bounded Context
│   ├── domain/                     # Domain Layer
│   │   ├── model/                  # Domain entities and value objects
│   │   │   ├── Board.java          # Board entity
│   │   │   ├── BoardColumn.java    # Column entity
│   │   │   └── BoardRoleType.java  # Role type enum
│   │   ├── repository/             # Domain repositories (interfaces)
│   │   │   └── BoardRepository.java # Board repository interface
│   │   └── service/                # Domain services
│   ├── application/                # Application Layer
│   │   ├── AnalyticsService.java   # Board analytics
│   │   ├── BoardRoleService.java   # Role management
│   │   ├── BoardSecurityService.java # Security operations
│   │   ├── BoardWebSocketService.java # Real-time updates
│   │   ├── PerformanceService.java # Performance monitoring
│   │   └── SearchService.java      # Search functionality
│   ├── infrastructure/             # Infrastructure Layer
│   │   └── [persistence, external services]
│   └── interfaces/                 # Interface Layer
│       └── rest/                   # REST controllers
│           ├── BoardController.java # Board management API
│           ├── ColumnController.java # Column management API
│           └── [other controllers]
├── task/                           # Task Bounded Context
│   ├── domain/                     # Domain Layer
│   │   ├── model/                  # Task domain entities
│   │   │   ├── Task.java           # Task entity
│   │   │   ├── TaskStatus.java     # Task status enum
│   │   │   └── TaskPriority.java   # Task priority enum
│   │   ├── repository/             # Task repositories
│   │   └── service/                # Task domain services
│   ├── application/                # Application Layer
│   │   └── [task application services]
│   ├── infrastructure/             # Infrastructure Layer
│   └── interfaces/                 # Interface Layer
│       └── rest/                   # Task REST controllers
│           ├── TaskController.java  # Task management API
│           └── [other task controllers]
├── user/                           # User Bounded Context
│   ├── domain/                     # Domain Layer
│   │   ├── model/                  # User domain entities
│   │   │   ├── User.java           # User entity
│   │   │   └── Role.java           # Role entity
│   │   ├── repository/             # User repositories
│   │   └── service/                # User domain services
│   ├── application/                # Application Layer
│   │   └── CustomUserDetailsService.java # User authentication service
│   ├── infrastructure/             # Infrastructure Layer
│   └── interfaces/                 # Interface Layer
│       └── rest/                   # User REST controllers
│           ├── UserController.java  # User management API
│           ├── AuthController.java  # Authentication API
│           └── [other user controllers]
└── shared/                         # Shared Context (Cross-cutting concerns)
    ├── domain/                     # Shared domain elements
    │   ├── model/                  # Shared entities
    │   │   ├── Attachment.java     # File attachment entity
    │   │   ├── Comment.java        # Comment entity
    │   │   ├── Label.java          # Label entity
    │   │   ├── Notification.java   # Notification entity
    │   │   └── UserBoardRole.java  # User-board role mapping
    │   ├── exception/              # Shared exceptions
    │   │   ├── AuthenticationException.java
    │   │   ├── BusinessLogicException.java
    │   │   ├── DatabaseException.java
    │   │   ├── ValidationException.java
    │   │   ├── ResourceNotFoundException.java
    │   │   └── ExternalServiceException.java
    │   └── validation/             # Shared validation
    │       ├── UniqueUsername.java  # Username uniqueness annotation
    │       └── UniqueUsernameValidator.java # Username validator
    ├── application/                 # Shared application services
    ├── infrastructure/              # Shared infrastructure
    │   ├── config/                 # Configuration classes
    │   │   ├── SecurityConfig.java # Spring Security configuration
    │   │   ├── SwaggerConfig.java  # API documentation setup
    │   │   ├── CacheConfig.java    # Caching configuration
    │   │   ├── MetricsConfig.java  # Metrics and monitoring
    │   │   ├── LoggingConfig.java  # Logging configuration
    │   │   ├── WebSocketConfig.java # WebSocket setup
    │   │   ├── JwtUtil.java        # JWT utility functions
    │   │   ├── JwtRequestFilter.java # JWT authentication filter
    │   │   └── DataInitializer.java # Initial data setup
    │   ├── health/                 # Health check indicators
    │   │   └── DatabaseHealthIndicator.java # Database health monitoring
    │   ├── persistence/            # Persistence layer
    │   ├── security/               # Security components
    │   ├── service/                # Shared services
    │   ├── AttachmentMapper.java   # Attachment mapping
    │   ├── AttachmentRepository.java # Attachment data access
    │   ├── BoardMapper.java        # Board mapping
    │   ├── ColumnMapper.java       # Column mapping
    │   ├── CommentMapper.java      # Comment mapping
    │   ├── CommentRepository.java  # Comment data access
    │   ├── LabelMapper.java        # Label mapping
    │   ├── LabelRepository.java    # Label data access
    │   ├── NotificationMapper.java # Notification mapping
    │   ├── NotificationRepository.java # Notification data access
    │   ├── NotificationService.java # Notification management
    │   ├── RoleMapper.java         # Role mapping
    │   ├── TaskMapper.java         # Task mapping
    │   └── UserMapper.java         # User mapping
    └── interfaces/                 # Shared interfaces
        ├── handler/                # Exception handlers
        │   └── GlobalExceptionHandler.java # Global exception handling
        ├── response/               # Response models
        │   ├── ErrorResponse.java  # Error response format
        │   └── PaginatedResponse.java # Pagination response format
        └── rest/                   # Shared REST components
            ├── AttachmentController.java # File upload/download
            ├── CommentController.java # Comment operations
            ├── LabelController.java # Label management
            ├── NotificationController.java # Notification system
            ├── SearchController.java # Search functionality
            ├── AnalyticsController.java # Analytics & reporting
            ├── PerformanceController.java # Performance metrics
            └── AvatarController.java # User avatar management
```

### Test Code Structure (`src/test/java/com/kanban/`)

```
src/test/java/com/kanban/
├── BoardApplicationTests.java       # Main application tests
├── board/                          # Board context tests
│   ├── application/                # Application layer tests
│   │   ├── BoardRoleServiceTest.java # Role service tests
│   │   └── rest/                   # REST controller tests
│   ├── domain/                     # Domain layer tests
│   │   └── rest/                   # Domain tests
│   ├── infrastructure/             # Infrastructure layer tests
│   │   └── rest/                   # Infrastructure tests
│   └── interfaces/                 # Interface layer tests
│       └── rest/                   # REST interface tests
├── task/                           # Task context tests
│   ├── application/                # Task application tests
│   │   └── rest/                   # Task application tests
│   ├── domain/                     # Task domain tests
│   │   └── rest/                   # Task domain tests
│   ├── infrastructure/             # Task infrastructure tests
│   │   └── rest/                   # Task infrastructure tests
│   └── interfaces/                 # Task interface tests
│       └── rest/                   # Task REST tests
├── user/                           # User context tests
│   ├── application/                # User application tests
│   │   └── rest/                   # User application tests
│   ├── domain/                     # User domain tests
│   │   ├── model/                  # User model tests
│   │   │   ├── UserTest.java       # User entity tests
│   │   │   └── RoleTest.java       # Role entity tests
│   │   └── rest/                   # User domain tests
│   ├── infrastructure/             # User infrastructure tests
│   │   └── rest/                   # User infrastructure tests
│   └── interfaces/                 # User interface tests
│       └── rest/                   # User REST tests
└── shared/                         # Shared context tests
    ├── application/                # Shared application tests
    ├── domain/                     # Shared domain tests
    ├── infrastructure/             # Shared infrastructure tests
    │   ├── JwtUtilTest.java        # JWT utility tests
    │   ├── UserMapperTest.java     # User mapper tests
    │   └── rest/                   # Shared infrastructure tests
    └── interfaces/                 # Shared interface tests
        └── rest/                   # Shared REST tests
```

## DDD Layer Responsibilities

### Domain Layer
- **Entities**: Core business objects with identity
- **Value Objects**: Immutable objects representing concepts
- **Domain Services**: Business logic that doesn't belong to entities
- **Repositories**: Interfaces for data access (implemented in infrastructure)

### Application Layer
- **Application Services**: Orchestrate domain objects to fulfill use cases
- **Use Cases**: Business operations and workflows
- **DTOs**: Data transfer objects for external communication

### Infrastructure Layer
- **Persistence**: Database access, repositories implementation
- **External Services**: Integration with external systems
- **Configuration**: Framework configuration
- **Security**: Authentication and authorization
- **Messaging**: Event publishing and handling

### Interface Layer
- **Controllers**: REST API endpoints
- **DTOs**: Request/response models
- **Exception Handlers**: Error handling
- **Validators**: Input validation

## Bounded Contexts Details

### Board Context
**Responsibility**: Board management, columns, roles, and board-specific operations
- **Domain**: Board entities, column management, role types
- **Application**: Analytics, search, performance monitoring, role management
- **Infrastructure**: Board persistence, external integrations
- **Interfaces**: Board and column REST APIs

### Task Context
**Responsibility**: Task management, status, priority, and task-specific operations
- **Domain**: Task entities, status management, priority handling
- **Application**: Task workflows, task-specific business logic
- **Infrastructure**: Task persistence, task-related external services
- **Interfaces**: Task REST APIs

### User Context
**Responsibility**: User management, authentication, and user-specific operations
- **Domain**: User entities, role management
- **Application**: Authentication services, user management
- **Infrastructure**: User persistence, authentication providers
- **Interfaces**: User and authentication REST APIs

### Shared Context
**Responsibility**: Cross-cutting concerns, common utilities, and shared infrastructure
- **Domain**: Shared entities (attachments, comments, labels, notifications)
- **Application**: Shared services (notifications, file management)
- **Infrastructure**: Security, configuration, health checks, mappers
- **Interfaces**: Shared REST APIs, exception handling, response models

## Key Features by Context

### Board Context Features
- 🔐 Board creation and management
- 📊 Board analytics and metrics
- 🔍 Board search functionality
- ⚡ Real-time board updates
- 🎭 Role-based access control
- 📈 Performance monitoring

### Task Context Features
- ✅ Task creation and management
- 📋 Task status workflows
- 🏷️ Task labeling and categorization
- 📅 Task scheduling and deadlines
- 🔄 Task transitions and history

### User Context Features
- 👤 User registration and profiles
- 🔐 Authentication and authorization
- 🎭 Role management
- 👥 User collaboration features
- 📧 User notifications

### Shared Context Features
- 📎 File attachment management
- 💬 Comment system
- 🏷️ Label management
- 🔔 Notification system
- 🔍 Global search
- 📊 Analytics and reporting
- 🎨 Avatar management

## Technology Stack

- **Framework**: Spring Boot 3.4.1
- **Architecture**: Domain-Driven Design (DDD)
- **Database**: H2 (development)
- **Security**: Spring Security + JWT
- **Documentation**: Swagger/OpenAPI
- **Real-time**: WebSocket
- **Build Tool**: Maven
- **Java Version**: 17
- **Code Quality**: Checkstyle, SpotBugs, PMD

## DDD Benefits

1. **Clear Boundaries**: Each bounded context has well-defined responsibilities
2. **Maintainability**: Changes in one context don't affect others
3. **Scalability**: Teams can work independently on different contexts
4. **Domain Focus**: Business logic is organized around domain concepts
5. **Testability**: Clear layers make testing easier and more focused

This DDD structure provides a solid foundation for a scalable, maintainable Kanban board application with clear separation of concerns and domain boundaries. 