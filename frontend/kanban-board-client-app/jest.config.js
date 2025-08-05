module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^ngx-markdown$': '<rootDir>/src/app/core/mocks/ngx-markdown.mock.ts',
  },
  testMatch: [
    '<rootDir>/src/**/?(*.)+(spec|test).ts'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)',
  ],
  moduleFileExtensions: ['ts', 'js', 'html'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  transform: {
    '^.+\\.(ts|js|html)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
    }],
  },
};
