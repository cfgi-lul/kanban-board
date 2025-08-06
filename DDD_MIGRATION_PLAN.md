# DDD Migration Plan

## 🎯 **Target DDD Structure**

```
src/main/java/com/kanban/
├── KanbanApplication.java                    # Main application class
├── board/                                   # Board Bounded Context
│   ├── application/                         # Application Services
│   │   ├── BoardApplicationService.java
│   │   ├── BoardRoleService.java
│   │   ├── BoardSecurityService.java
│   │   ├── BoardWebSocketService.java
│   │   ├── AnalyticsService.java
│   │   ├── SearchService.java
│   │   └── PerformanceService.java
│   ├── domain/                              # Domain Model
│   │   ├── model/
│   │   │   ├── Board.java
│   │   │   ├── BoardColumn.java
│   │   │   ├── BoardRoleType.java
│   │   │   └── UserBoardRole.java
│   │   ├── repository/
│   │   │   ├── BoardRepository.java
│   │   │   ├── ColumnRepository.java
│   │   │   └── UserBoardRoleRepository.java
│   │   └── service/
│   │       └── BoardDomainService.java
│   ├── infrastructure/                      # Infrastructure
│   │   └── persistence/
│   │       └── BoardJpaRepository.java
│   └── interfaces/                          # Interfaces
│       └── rest/
│           ├── BoardController.java
│           ├── ColumnController.java
│           ├── AnalyticsController.java
│           ├── SearchController.java
│           ├── PerformanceController.java
│           ├── BoardDTO.java
│           └── ColumnDTO.java
├── task/                                    # Task Bounded Context
│   ├── application/
│   │   └── TaskApplicationService.java
│   ├── domain/
│   │   ├── model/
│   │   │   ├── Task.java
│   │   │   ├── TaskStatus.java
│   │   │   └── TaskPriority.java
│   │   ├── repository/
│   │   │   └── TaskRepository.java
│   │   └── service/
│   │       └── TaskDomainService.java
│   ├── infrastructure/
│   │   └── persistence/
│   │       └── TaskJpaRepository.java
│   └── interfaces/
│       └── rest/
│           ├── TaskController.java
│           └── TaskDTO.java
├── user/                                    # User Bounded Context
│   ├── application/
│   │   ├── UserApplicationService.java
│   │   ├── AuthenticationService.java
│   │   └── CustomUserDetailsService.java
│   ├── domain/
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   └── Role.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── RoleRepository.java
│   │   └── service/
│   │       └── UserDomainService.java
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── UserJpaRepository.java
│   │   │   └── RoleJpaRepository.java
│   │   └── security/
│   │       └── JwtService.java
│   └── interfaces/
│       └── rest/
│           ├── UserController.java
│           ├── AuthController.java
│           ├── AvatarController.java
│           ├── UserDTO.java
│           ├── AuthResponseDTO.java
│           └── RoleDTO.java
└── shared/                                  # Shared Kernel
    ├── domain/
    │   ├── model/
    │   │   ├── Attachment.java
    │   │   ├── Label.java
    │   │   ├── Comment.java
    │   │   └── Notification.java
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
    │   │   ├── AttachmentRepository.java
    │   │   ├── LabelRepository.java
    │   │   ├── CommentRepository.java
    │   │   └── NotificationRepository.java
    │   └── service/
    │       └── NotificationService.java
    └── interfaces/
        ├── rest/
        │   ├── AttachmentController.java
        │   ├── LabelController.java
        │   ├── CommentController.java
        │   ├── NotificationController.java
        │   ├── AttachmentDTO.java
        │   ├── LabelDTO.java
        │   ├── CommentDTO.java
        │   └── NotificationDTO.java
        ├── response/
        │   ├── ErrorResponse.java
        │   └── PaginatedResponse.java
        └── handler/
            └── GlobalExceptionHandler.java
```

## 🔄 **Migration Steps**

### **Phase 1: Create New Structure**
```bash
# Create DDD package structure
mkdir -p src/main/java/com/kanban/{board,task,user,shared}/{application,domain,infrastructure,interfaces}
mkdir -p src/main/java/com/kanban/shared/{domain,infrastructure,interfaces}
mkdir -p src/main/java/com/kanban/{board,task,user}/domain/{model,repository,service}
mkdir -p src/main/java/com/kanban/shared/domain/{model,exception,validation}
mkdir -p src/main/java/com/kanban/shared/infrastructure/{config,security,health,persistence,service}
mkdir -p src/main/java/com/kanban/shared/interfaces/{rest,response,handler}
```

### **Phase 2: Move Files by Bounded Context**

#### **Board Context**
```bash
# Domain Models
mv src/main/java/Backend/Board/model/Board.java src/main/java/com/kanban/board/domain/model/
mv src/main/java/Backend/Board/model/BoardColumn.java src/main/java/com/kanban/board/domain/model/
mv src/main/java/Backend/Board/model/BoardRoleType.java src/main/java/com/kanban/board/domain/model/
mv src/main/java/Backend/Board/model/UserBoardRole.java src/main/java/com/kanban/board/domain/model/

# Repositories
mv src/main/java/Backend/Board/repository/BoardRepository.java src/main/java/com/kanban/board/domain/repository/
mv src/main/java/Backend/Board/repository/ColumnRepository.java src/main/java/com/kanban/board/domain/repository/
mv src/main/java/Backend/Board/repository/UserBoardRoleRepository.java src/main/java/com/kanban/board/domain/repository/

# Application Services
mv src/main/java/Backend/Board/service/BoardRoleService.java src/main/java/com/kanban/board/application/
mv src/main/java/Backend/Board/service/BoardSecurityService.java src/main/java/com/kanban/board/application/
mv src/main/java/Backend/Board/service/BoardWebSocketService.java src/main/java/com/kanban/board/application/
mv src/main/java/Backend/Board/service/AnalyticsService.java src/main/java/com/kanban/board/application/
mv src/main/java/Backend/Board/service/SearchService.java src/main/java/com/kanban/board/application/
mv src/main/java/Backend/Board/service/PerformanceService.java src/main/java/com/kanban/board/application/

# Interfaces
mv src/main/java/Backend/Board/controller/BoardController.java src/main/java/com/kanban/board/interfaces/rest/
mv src/main/java/Backend/Board/controller/ColumnController.java src/main/java/com/kanban/board/interfaces/rest/
mv src/main/java/Backend/Board/controller/AnalyticsController.java src/main/java/com/kanban/board/interfaces/rest/
mv src/main/java/Backend/Board/controller/SearchController.java src/main/java/com/kanban/board/interfaces/rest/
mv src/main/java/Backend/Board/controller/PerformanceController.java src/main/java/com/kanban/board/interfaces/rest/

# DTOs
mv src/main/java/Backend/Board/dto/BoardDTO.java src/main/java/com/kanban/board/interfaces/rest/
mv src/main/java/Backend/Board/dto/ColumnDTO.java src/main/java/com/kanban/board/interfaces/rest/
```

#### **Task Context**
```bash
# Domain Models
mv src/main/java/Backend/Board/model/Task.java src/main/java/com/kanban/task/domain/model/
mv src/main/java/Backend/Board/model/TaskStatus.java src/main/java/com/kanban/task/domain/model/
mv src/main/java/Backend/Board/model/TaskPriority.java src/main/java/com/kanban/task/domain/model/

# Repositories
mv src/main/java/Backend/Board/repository/TaskRepository.java src/main/java/com/kanban/task/domain/repository/

# Interfaces
mv src/main/java/Backend/Board/controller/TaskController.java src/main/java/com/kanban/task/interfaces/rest/

# DTOs
mv src/main/java/Backend/Board/dto/TaskDTO.java src/main/java/com/kanban/task/interfaces/rest/
```

#### **User Context**
```bash
# Domain Models
mv src/main/java/Backend/Board/model/User.java src/main/java/com/kanban/user/domain/model/
mv src/main/java/Backend/Board/model/Role.java src/main/java/com/kanban/user/domain/model/

# Repositories
mv src/main/java/Backend/Board/repository/UserRepository.java src/main/java/com/kanban/user/domain/repository/
mv src/main/java/Backend/Board/repository/RoleRepository.java src/main/java/com/kanban/user/domain/repository/

# Application Services
mv src/main/java/Backend/Board/service/CustomUserDetailsService.java src/main/java/com/kanban/user/application/

# Interfaces
mv src/main/java/Backend/Board/controller/UserController.java src/main/java/com/kanban/user/interfaces/rest/
mv src/main/java/Backend/Board/controller/AuthController.java src/main/java/com/kanban/user/interfaces/rest/
mv src/main/java/Backend/Board/controller/AvatarController.java src/main/java/com/kanban/user/interfaces/rest/

# DTOs
mv src/main/java/Backend/Board/dto/UserDTO.java src/main/java/com/kanban/user/interfaces/rest/
mv src/main/java/Backend/Board/dto/AuthResponseDTO.java src/main/java/com/kanban/user/interfaces/rest/
mv src/main/java/Backend/Board/dto/RoleDTO.java src/main/java/com/kanban/user/interfaces/rest/
```

#### **Shared Kernel**
```bash
# Domain Models
mv src/main/java/Backend/Board/model/Attachment.java src/main/java/com/kanban/shared/domain/model/
mv src/main/java/Backend/Board/model/Label.java src/main/java/com/kanban/shared/domain/model/
mv src/main/java/Backend/Board/model/Comment.java src/main/java/com/kanban/shared/domain/model/
mv src/main/java/Backend/Board/model/Notification.java src/main/java/com/kanban/shared/domain/model/

# Exceptions
mv src/main/java/Backend/Board/exception/* src/main/java/com/kanban/shared/domain/exception/

# Validation
mv src/main/java/Backend/Board/validation/* src/main/java/com/kanban/shared/domain/validation/

# Infrastructure
mv src/main/java/Backend/Board/config/* src/main/java/com/kanban/shared/infrastructure/config/
mv src/main/java/Backend/Board/health/* src/main/java/com/kanban/shared/infrastructure/health/
mv src/main/java/Backend/Board/mappers/* src/main/java/com/kanban/shared/infrastructure/

# Repositories
mv src/main/java/Backend/Board/repository/AttachmentRepository.java src/main/java/com/kanban/shared/infrastructure/persistence/
mv src/main/java/Backend/Board/repository/LabelRepository.java src/main/java/com/kanban/shared/infrastructure/persistence/
mv src/main/java/Backend/Board/repository/CommentRepository.java src/main/java/com/kanban/shared/infrastructure/persistence/
mv src/main/java/Backend/Board/repository/NotificationRepository.java src/main/java/com/kanban/shared/infrastructure/persistence/

# Services
mv src/main/java/Backend/Board/service/NotificationService.java src/main/java/com/kanban/shared/infrastructure/service/

# Interfaces
mv src/main/java/Backend/Board/controller/AttachmentController.java src/main/java/com/kanban/shared/interfaces/rest/
mv src/main/java/Backend/Board/controller/LabelController.java src/main/java/com/kanban/shared/interfaces/rest/
mv src/main/java/Backend/Board/controller/CommentController.java src/main/java/com/kanban/shared/interfaces/rest/
mv src/main/java/Backend/Board/controller/NotificationController.java src/main/java/com/kanban/shared/interfaces/rest/

# DTOs
mv src/main/java/Backend/Board/dto/AttachmentDTO.java src/main/java/com/kanban/shared/interfaces/rest/
mv src/main/java/Backend/Board/dto/LabelDTO.java src/main/java/com/kanban/shared/interfaces/rest/
mv src/main/java/Backend/Board/dto/CommentDTO.java src/main/java/com/kanban/shared/interfaces/rest/
mv src/main/java/Backend/Board/dto/NotificationDTO.java src/main/java/com/kanban/shared/interfaces/rest/

# Response & Handler
mv src/main/java/Backend/Board/response/* src/main/java/com/kanban/shared/interfaces/response/
mv src/main/java/Backend/Board/handler/* src/main/java/com/kanban/shared/interfaces/handler/
```

### **Phase 3: Update Package Declarations**

All Java files need their package declarations updated to match the new structure:

#### **Board Context**
```java
// Old: package Backend.Board.model;
// New: package com.kanban.board.domain.model;

// Old: package Backend.Board.service;
// New: package com.kanban.board.application;

// Old: package Backend.Board.controller;
// New: package com.kanban.board.interfaces.rest;
```

#### **Task Context**
```java
// Old: package Backend.Board.model;
// New: package com.kanban.task.domain.model;

// Old: package Backend.Board.controller;
// New: package com.kanban.task.interfaces.rest;
```

#### **User Context**
```java
// Old: package Backend.Board.model;
// New: package com.kanban.user.domain.model;

// Old: package Backend.Board.service;
// New: package com.kanban.user.application;

// Old: package Backend.Board.controller;
// New: package com.kanban.user.interfaces.rest;
```

#### **Shared Kernel**
```java
// Old: package Backend.Board.exception;
// New: package com.kanban.shared.domain.exception;

// Old: package Backend.Board.config;
// New: package com.kanban.shared.infrastructure.config;

// Old: package Backend.Board.controller;
// New: package com.kanban.shared.interfaces.rest;
```

### **Phase 4: Update Import Statements**

All import statements need to be updated to reference the new package structure.

### **Phase 5: Update Main Application Class**

```java
// Old: @SpringBootApplication(scanBasePackages = "Backend.Board")
// New: @SpringBootApplication(scanBasePackages = "com.kanban")
```

### **Phase 6: Test Build**

```bash
mvn clean compile
```

## 🎯 **Benefits of This Structure**

### **1. Clear Bounded Contexts**
- **Board Context**: All board-related functionality
- **Task Context**: All task-related functionality  
- **User Context**: All user and authentication functionality
- **Shared Kernel**: Common functionality used across contexts

### **2. DDD Layers**
- **Domain**: Core business logic and entities
- **Application**: Use cases and application services
- **Infrastructure**: External concerns (DB, external APIs)
- **Interfaces**: Controllers, DTOs, and external interfaces

### **3. Professional Naming**
- **com.kanban**: Standard Java package naming
- **Clear separation**: Each context has its own domain
- **Scalable**: Easy to add new bounded contexts

### **4. Maintainable**
- **Single Responsibility**: Each package has a clear purpose
- **Low Coupling**: Contexts are independent
- **High Cohesion**: Related functionality is grouped together

This structure follows DDD best practices and will make your application more maintainable and scalable! 