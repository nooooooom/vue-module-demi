const { writeFileSync, existsSync, mkdirSync } = require('node:fs')
const { join } = require('node:path')
const Vue = require('vue')
const LegacyVue = require('vue2')
const { MAIN_DIR, LEGACY_DIR, LEADING_DIR } = require('./constants')

const DEPRECATED_WARNING = '/** @deprecated This is a new API for Vue3 */'

function syncFreshExports() {
  // make sure that the export folder exists
  const dirs = [MAIN_DIR, LEGACY_DIR, LEADING_DIR]
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir)
    }
  }

  const defaultDirs = [MAIN_DIR, LEADING_DIR]
  for (const dir of defaultDirs) {
    writeFileSync(join(dir, 'index.js'), genCommonESM(false, true), 'utf-8')
    writeFileSync(
      join(dir, 'index.cjs'),
      genCommonCommonJS(false, true),
      'utf-8'
    )
    writeFileSync(join(dir, 'index.d.ts'), genCommonDTS(false, true), 'utf-8')
  }

  const freshExports = {}
  Object.keys(Vue).forEach(name => {
    if (!(name in LegacyVue)) {
      freshExports[name] = undefined
    }
  })

  writeFileSync(
    join(LEGACY_DIR, 'index.js'),
    genLegacyESM(freshExports),
    'utf-8'
  )
  writeFileSync(
    join(LEGACY_DIR, 'index.cjs'),
    genLegacyCommonJS(freshExports),
    'utf-8'
  )
  writeFileSync(
    join(LEGACY_DIR, 'index.d.ts'),
    genLegacyDTS(freshExports),
    'utf-8'
  )
}

syncFreshExports()

function genLegacyESM(modules) {
  const fresh = Object.entries(modules).reduce((content, [name, value]) => {
    return content + `export var ${name} = ${value}\n`
  }, '')

  return `${genCommonESM(true, false)}\n${fresh}`
}

function genLegacyCommonJS(modules) {
  const fresh = Object.entries(modules).reduce((content, [name, value]) => {
    return content + `exports.${name} = ${value}\n`
  }, '')

  return `${genCommonCommonJS(true, false)}\n${fresh}`
}

function genLegacyDTS(modules) {
  const fresh = Object.entries(modules).reduce((content, [name, value]) => {
    return (
      content +
      `${DEPRECATED_WARNING}\nexport declare const ${name}: typeof ${value}\n`
    )
  }, '')

  return `${genCommonDTS(true, false)}\n${fresh}`
}

function genCommonESM(isVue2, isVue3) {
  return `var isVue2 = ${isVue2}
var isVue3 = ${isVue3}

export * from 'vue'
export { isVue2, isVue3 }
${isVue2 ? `\nexport { default as Vue } from 'vue'` : ''}
${isVue3 ? 'export default undefined' : ''}`
}

function genCommonCommonJS(isVue2, isVue3) {
  return `var Vue = require('vue')

Object.keys(Vue).forEach(function (key) {
  exports[key] = Vue[key]
})

exports.isVue2 = ${isVue2}
exports.isVue3 = ${isVue3}
${isVue2 ? `\nexports.default = Vue.default` : ''}
${isVue3 ? 'exports.default = undefined' : ''}`
}

function genCommonDTS(isVue2, isVue3) {
  return `export declare const isVue2: boolean
export declare const isVue3: boolean

export * from 'vue'
${isVue2 ? `\nexport type { default as Vue } from 'vue'` : ''}
${isVue3 ? 'export default undefined' : ''}`
}
