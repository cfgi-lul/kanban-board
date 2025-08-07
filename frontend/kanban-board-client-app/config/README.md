# Configuration Files

This directory contains all configuration files for the Kanban Board Frontend project, organized by category.

## Directory Structure

```
config/
├── editor/           # Editor configuration
│   └── .editorconfig
├── typescript/       # TypeScript configuration
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   └── tsconfig.spec.json
├── eslint/          # ESLint configuration
│   ├── .eslintrc.json
│   └── eslint.config.js
├── prettier/        # Prettier configuration
│   ├── .prettierrc
│   └── .prettierignore
├── jest/            # Jest testing configuration
│   └── jest.config.js
├── openapi/         # OpenAPI generator configuration
│   └── openapitools.json
├── nginx/           # Nginx configuration
│   └── nginx.conf
└── README.md        # This file
```

## Usage

### EditorConfig
- **File**: `config/editor/.editorconfig`
- **Purpose**: Ensures consistent coding style across editors
- **Usage**: Most editors automatically read this file

### TypeScript
- **Files**: `config/typescript/tsconfig*.json`
- **Purpose**: TypeScript compiler configuration
- **Usage**: Referenced by Angular CLI and build tools

### ESLint
- **Files**: `config/eslint/.eslintrc.json`, `config/eslint/eslint.config.js`
- **Purpose**: Code linting and style enforcement
- **Usage**: `npm run lint`, `npm run lint:fix`

### Prettier
- **Files**: `config/prettier/.prettierrc`, `config/prettier/.prettierignore`
- **Purpose**: Code formatting
- **Usage**: `npm run format`, `npm run format:check`

### Jest
- **File**: `config/jest/jest.config.js`
- **Purpose**: Unit testing configuration
- **Usage**: `npm run test`

### OpenAPI
- **File**: `config/openapi/openapitools.json`
- **Purpose**: API client generation configuration
- **Usage**: `npm run generate-api`

### Nginx
- **File**: `config/nginx/nginx.conf`
- **Purpose**: Production server configuration
- **Usage**: Docker deployment

## Notes

- All configuration files have been moved from the project root to maintain a cleaner structure
- References in `angular.json`, `package.json`, and other files have been updated accordingly
- The `.gitignore` file remains in the project root as it's a standard location 