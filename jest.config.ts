import type { Config } from 'jest';

const config: Config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',

    roots: ['<rootDir>/src', '<rootDir>/test'],

    testRegex: '.*\\.spec\\.ts$',

    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^src/(.*)$': '<rootDir>/src/$1',
    },

    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
};

export default config;