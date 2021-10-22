// https://mochajs.org/#command-line-usage
module.exports = {
    reporter: './test/support/junit-spec-reporter.js',
    reporterOptions: {
        mochaFile: './junit.xml'
    },
    allowUncaught: false,
    checkLeaks: true,
    color: true,
    recursive: true,
    "file": "test/setup",
    spec: [
        "test/unit/",
        "test/integration/"
    ],
    exit: true,
    "timeout": 10000,
    "full-trace": true

};
