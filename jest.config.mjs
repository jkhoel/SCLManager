import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: "jest-environment-jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

// module.exports = {
//   globals: {
//     __DEV__: true
//   },
//   setupFilesAfterEnv: [
//     '<rootDir>/test/jest.setup.js'
//   ],
//   // noStackTrace: true,
//   // bail: true,
//   // cache: false,
//   // verbose: true,
//   // watch: true,
//   collectCoverage: true,
//   coverageDirectory: '<rootDir>/test/jest/coverage',
//   collectCoverageFrom: [
//     '<rootDir>/src/**/*.ts'
//   ],
//   coverageReporters: [
//     'json-summary',
//     'text',
//     'lcov'
//   ],
//   coverageThreshold: {
//     global: {
//       functions: 50,
//       lines: 50,
//       statements: 50
//     }
//   },
//   testMatch: [
//     '<rootDir>/test/__tests__/**/*.spec.ts'
//   ],
//   moduleFileExtensions: [
//     'ts',
//     'js',
//     'json'
//   ],
//   moduleNameMapper: {
//     '^~/(.*)$': '<rootDir>/$1',
//     '^src/(.*)$': '<rootDir>/src/$1',
//   },
//   transform: {
//     '.*\\.ts$': 'ts-jest',

//   },
//   transformIgnorePatterns: [
//   ]
// }
