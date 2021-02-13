module.exports = {
    setupFilesAfterEnv: ['./setUp_tearDown/jest.aftersetup.js'],
    testEnvironment: './setUp_tearDown/CustomEnvironment.js',
    testRunner:'jest-circus/runner',
    reporters: ['default', ['./node_modules/jest-html-reporter', {"includeFailureMsg": true}]]
    
  };