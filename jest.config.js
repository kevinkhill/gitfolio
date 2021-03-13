module.exports = {
  preset: 'ts-jest',
  setupFiles: ["dotenv/config"],
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
