import 'jest-preset-angular/setup-jest';

// Ensure Jest globals are available
declare global {
  const describe: typeof import('@jest/globals').describe;
  const it: typeof import('@jest/globals').it;
  const expect: typeof import('@jest/globals').expect;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterEach: typeof import('@jest/globals').afterEach;
  const jest: typeof import('@jest/globals').jest;
}

export {};
