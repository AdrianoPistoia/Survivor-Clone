// jest.config.js
module.exports = {
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/weapons/jest.setup.js'],
  moduleFileExtensions: ['js', 'json'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
