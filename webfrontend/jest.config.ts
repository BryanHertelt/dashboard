
import type {Config} from 'jest';
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
}, 
testPathIgnorePatterns: ['/node_modules/', '/.next/'],
coverageReporters: ['json', 'lcov', 'text', 'clover'],
 }; 

export default createJestConfig(config)
