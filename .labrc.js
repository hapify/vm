module.exports = {
    coverage: true,
    'coverage-exclude': 'dist/tests',
    threshold: 95,
    sourcemaps: true,
    reporter: ['console', 'html', 'lcov', 'json'],
    output: ['stdout', 'coverage/coverage.html', 'coverage/lcov.info', 'coverage/data.json']
};
