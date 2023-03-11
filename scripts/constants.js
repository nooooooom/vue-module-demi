const { resolve } = require('node:path')

const LEGACY_OUTPUT = resolve(__dirname, '../lib/legacy')
const LEADING_OUTPUT = resolve(__dirname, '../lib/leading')
const DEFAULT_OUTPUT = resolve(__dirname, '../lib')

module.exports = {
  LEGACY_OUTPUT,
  LEADING_OUTPUT,
  DEFAULT_OUTPUT
}
