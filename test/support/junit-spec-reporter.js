/* c8 ignore start */
const mocha = require('mocha')
const JUnit = require('mocha-junit-reporter')
const Spec = mocha.reporters.Spec
const Base = mocha.reporters.Base

function JunitSpecReporter (runner, options) {
  Base.call(this, runner, options)
  this._junitReporter = new JUnit(runner, options)
  this._specReporter = new Spec(runner, options)
  return this
}
JunitSpecReporter.prototype = Base.prototype

module.exports = JunitSpecReporter
/* c8 ignore stop */
