module.exports = {
    testEnvironment: 'node',
    testTimeout: 15000,
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