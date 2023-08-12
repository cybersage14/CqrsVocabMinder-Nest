module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  testTimeout: 15000,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@src/(.*)$': '<rootDir>/../src/$1',
    '@test/(.*)$': '<rootDir>/$1',
    ormconfig: '<rootDir>/../ormconfig.ts',
  },
};
