module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'routes/**/*.js',
        'middleware/**/*.js',
        'models/**/*.js',
    ],
    coverageReporters: ['text', 'html'],
    setupFiles: ['./test/setup.js']
}