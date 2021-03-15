module.exports = {
  preset: 'ts-jest',
  setupFiles: ["dotenv/config"],
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
