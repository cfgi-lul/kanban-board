import '@types/jest';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalled(): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBe(value: any): R;
      toContain(value: any): R;
      toBeGreaterThan(value: number): R;
      toBeDefined(): R;
      toBeInstanceOf(constructor: any): R;
      not: Matchers<R>;
    }
  }
}

export {};
