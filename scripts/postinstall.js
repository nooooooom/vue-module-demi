const { readdirSync, copyFileSync } = require('node:fs')
const { join } = require('node:path')
const { LEADING_OUTPUT, LEGACY_OUTPUT, DEFAULT_OUTPUT } = require('./constants')

function guide() {
  let current = LEADING_OUTPUT

  try {
    const { version } = require('vue')
    if (+version.split('.')[0] !== 3) {
      current = LEGACY_OUTPUT
    }
    // live updates with the latest version of the leading exports in the current library
    require('./sync-fresh-exports')
  } catch (error) {}

  readdirSync(current).forEach(path => {
    copyFileSync(join(current, path), join(DEFAULT_OUTPUT, path))
  })
}

guide()
