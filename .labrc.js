module.exports = {
    coverage: true,
    'coverage-exclude': 'dist/tests',
    threshold: 95,
    sourcemaps: true,
    reporter: ['console', 'html', 'lcov', 'json'],
    output: ['stdout', 'coverage-report/coverage.html', 'coverage-report/lcov.info', 'coverage-report/data.json']
};
