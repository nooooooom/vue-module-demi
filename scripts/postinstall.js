const { readdirSync, copyFileSync } = require('node:fs')
const { join } = require('node:path')
const { LEGACY_DIR, LEADING_DIR, MAIN_DIR } = require('./constants')

function guide() {
  let current = LEADING_DIR

  try {
    const { version } = require('vue')
    if (+version.split('.')[0] !== 3) {
      current = LEGACY_DIR
    }
    // live updates with the latest version of the leading exports in the current library
    require('./sync-fresh-exports')
  } catch (error) {}

  readdirSync(current).forEach(path => {
    copyFileSync(join(current, path), join(MAIN_DIR, path))
  })
}

guide()
