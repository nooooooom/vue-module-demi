const { resolve } = require('node:path')

const LEGACY_DIR = resolve(__dirname, '../lib/legacy')
const LEADING_DIR = resolve(__dirname, '../lib/leading')
const MAIN_DIR = resolve(__dirname, '../lib')

module.exports = {
  LEGACY_DIR,
  LEADING_DIR,
  MAIN_DIR
}
