
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  // coverageThreshold: {
  //   global: {
  //     functions: 80,
  //     lines: 80,
  //     statements: 80
  //   }
  // },
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.*\\.spec\\.js$/",
    "/.*\\.spec\\.js$/",
    '\\.error\\.ts$',
    '\\index\\.ts$',
    '/.*\\swagger\\.ts$',
    '<rootDir>/src/app/*',
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', 
    '!src/**/*.d.ts', 
  ],
};