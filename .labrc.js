module.exports = {
    coverage: true,
    'coverage-exclude': 'dist/tests',
    threshold: 95,
    sourcemaps: true,
    reporter: ['console', 'lcov'],
    output: ['stdout', 'lcov.info']
};
