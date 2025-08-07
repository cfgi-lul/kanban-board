# Complete Backend Folder Structure

## Overview
This document provides a complete view of the folder structure after the DDD (Domain-Driven Design) migration. The structure is organized by bounded contexts and follows DDD layered architecture principles.

## Root Directory Structure
```
backend/Board/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── kanban/
│   │   │           ├── KanbanApplication.java
│   │   │           ├── board/
│   │   │           ├── task/
│   │   │           ├── user/
│   │   │           └── shared/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── kanban/
│                   ├── BoardApplicationTests.java
│                   ├── board/
│                   ├── task/
│                   ├── user/
│                   └── shared/
├── target/
├── uploads/
│   └── avatars/
├── pom.xml
├── checkstyle.xml
├── spotbugs-exclude.xml
├── LINTING.md
├── BACKEND_STRUCTURE.md
├── FOLDER_STRUCTURE.md
├── Dockerfile
├── .dockerignore
├── mvnw
├── mvnw.cmd
└── .mvn/
```

## Detailed Source Code Structure

### Main Application (`src/main/java/com/kanban/`)

```
com/kanban/
├── KanbanApplication.java
├── board/                          # Board Bounded Context
│   ├── application/
│   │   ├── AnalyticsService.java
│   │   ├── BoardRoleService.java
│   │   ├── BoardSecurityService.java
│   │   ├── BoardWebSocketService.java
│   │   ├── PerformanceService.java
│   │   └── SearchService.java
│   ├── domain/
│   │   ├── model/
│   │   │   ├── Board.java
│   │   │   ├── BoardColumn.java
│   │   │   └── BoardRoleType.java
│   │   ├── repository/
│   │   │   └── BoardRepository.java
│   │   └── service/
│   ├── infrastructure/
│   └── interfaces/
│       └── rest/
│           ├── BoardController.java
│           └── ColumnController.java
├── task/                           # Task Bounded Context
│   ├── application/
│   ├── domain/
│   │   ├── model/
│   │   │   ├── Task.java
│   │   │   ├── TaskStatus.java
│   │   │   └── TaskPriority.java
│   │   ├── repository/
│   │   │   └── TaskRepository.java
│   │   └── service/
│   ├── infrastructure/
│   └── interfaces/
│       └── rest/
│           ├── TaskController.java
│           └── CommentController.java
├── user/                           # User Bounded Context
│   ├── application/
│   │   └── CustomUserDetailsService.java
│   ├── domain/
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   └── Role.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── RoleRepository.java
│   │   └── service/
│   ├── infrastructure/
│   └── interfaces/
│       └── rest/
│           ├── UserController.java
│           ├── AuthController.java
│           └── AvatarController.java
└── shared/                         # Shared Context
    ├── application/
    ├── domain/
    │   ├── model/
    │   │   ├── Attachment.java
    │   │   ├── Comment.java
    │   │   ├── Label.java
    │   │   ├── Notification.java
    │   │   └── UserBoardRole.java
    │   ├── exception/
    │   │   ├── AuthenticationException.java
    │   │   ├── BusinessLogicException.java
    │   │   ├── DatabaseException.java
    │   │   ├── ValidationException.java
    │   │   ├── ResourceNotFoundException.java
    │   │   └── ExternalServiceException.java
    │   └── validation/
    │       ├── UniqueUsername.java
    │       └── UniqueUsernameValidator.java
    ├── infrastructure/
    │   ├── config/
    │   │   ├── SecurityConfig.java
    │   │   ├── SwaggerConfig.java
    │   │   ├── CacheConfig.java
    │   │   ├── MetricsConfig.java
    │   │   ├── LoggingConfig.java
    │   │   ├── WebSocketConfig.java
    │   │   ├── JwtUtil.java
    │   │   ├── JwtRequestFilter.java
    │   │   └── DataInitializer.java
    │   ├── health/
    │   │   └── DatabaseHealthIndicator.java
    │   ├── persistence/
    │   ├── security/
    │   ├── service/
    │   ├── AttachmentMapper.java
    │   ├── AttachmentRepository.java
    │   ├── BoardMapper.java
    │   ├── ColumnMapper.java
    │   ├── CommentMapper.java
    │   ├── CommentRepository.java
    │   ├── LabelMapper.java
    │   ├── LabelRepository.java
    │   ├── NotificationMapper.java
    │   ├── NotificationRepository.java
    │   ├── NotificationService.java
    │   ├── RoleMapper.java
    │   ├── TaskMapper.java
    │   └── UserMapper.java
    └── interfaces/
        ├── handler/
        │   └── GlobalExceptionHandler.java
        ├── response/
        │   ├── ErrorResponse.java
        │   └── PaginatedResponse.java
        └── rest/
            ├── AttachmentController.java
            ├── CommentController.java
            ├── LabelController.java
            ├── NotificationController.java
            ├── SearchController.java
            ├── AnalyticsController.java
            ├── PerformanceController.java
            └── AvatarController.java
```

## Test Structure (`src/test/java/com/kanban/`)

```
com/kanban/
├── BoardApplicationTests.java
├── board/                          # Board Context Tests
│   ├── application/
│   │   ├── BoardRoleServiceTest.java
│   │   └── rest/
│   ├── domain/
│   │   └── rest/
│   ├── infrastructure/
│   │   └── rest/
│   └── interfaces/
│       └── rest/
├── task/                           # Task Context Tests
│   ├── application/
│   │   └── rest/
│   ├── domain/
│   │   └── rest/
│   ├── infrastructure/
│   │   └── rest/
│   └── interfaces/
│       └── rest/
├── user/                           # User Context Tests
│   ├── application/
│   │   └── rest/
│   ├── domain/
│   │   ├── model/
│   │   │   ├── UserTest.java
│   │   │   └── RoleTest.java
│   │   └── rest/
│   ├── infrastructure/
│   │   └── rest/
│   └── interfaces/
│       └── rest/
└── shared/                         # Shared Context Tests
    ├── application/
    ├── domain/
    ├── infrastructure/
    │   ├── JwtUtilTest.java
    │   ├── UserMapperTest.java
    │   └── rest/
    └── interfaces/
        └── rest/
```

## Resources Structure (`src/main/resources/`)

```
resources/
├── application.properties
└── [other configuration files]
```

## Build and Configuration Files

### Root Level Files
- `pom.xml` - Maven project configuration
- `checkstyle.xml` - Code style rules
- `spotbugs-exclude.xml` - Bug detection exclusions
- `LINTING.md` - Linting documentation
- `BACKEND_STRUCTURE.md` - Architecture documentation
- `FOLDER_STRUCTURE.md` - This file
- `Dockerfile` - Docker container configuration
- `.dockerignore` - Docker ignore patterns
- `mvnw` - Maven wrapper (Unix)
- `mvnw.cmd` - Maven wrapper (Windows)

### Directories
- `target/` - Compiled classes and build artifacts
- `uploads/` - File uploads directory
  - `avatars/` - User avatar images
- `.mvn/` - Maven wrapper configuration

## DDD Architecture Benefits

### Clear Separation of Concerns
- Each bounded context has its own domain, application, infrastructure, and interface layers
- Business logic is isolated within domain layers
- External concerns are handled in infrastructure layers

### Maintainability
- Changes in one bounded context don't affect others
- Clear boundaries make the codebase easier to understand and maintain
- Each context can evolve independently

### Scalability
- Teams can work on different bounded contexts simultaneously
- New features can be added to specific contexts without affecting others
- Infrastructure can be scaled per context if needed

### Testability
- Each layer can be tested independently
- Clear interfaces make mocking easier
- Domain logic is isolated from infrastructure concerns

## Migration Notes

The structure has been migrated from a traditional layered architecture to a DDD architecture with:

1. **Bounded Contexts**: Clear domain boundaries (board, task, user, shared)
2. **Layered Architecture**: Each context follows DDD layers (domain, application, infrastructure, interfaces)
3. **Domain Focus**: Business logic is organized around domain concepts
4. **Shared Context**: Cross-cutting concerns are centralized in the shared context

This structure provides a solid foundation for a scalable, maintainable Kanban board application that can grow with the business requirements. 