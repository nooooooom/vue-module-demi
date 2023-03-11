const { writeFileSync, existsSync, mkdirSync } = require('node:fs')
const { join } = require('node:path')
const Vue = require('vue')
const LegacyVue = require('vue2')
const { DEFAULT_OUTPUT, LEADING_OUTPUT, LEGACY_OUTPUT } = require('./constants')

const DEPRECATED_WARNING = '/** @deprecated This is a new API for Vue3 */'

function syncFreshExports() {
  const outputs = [DEFAULT_OUTPUT, LEADING_OUTPUT, LEGACY_OUTPUT]
  for (const output of outputs) {
    if (!existsSync(output)) {
      mkdirSync(output)
    }
  }

  const defaultOutputs = [DEFAULT_OUTPUT, LEADING_OUTPUT]
  for (const output of defaultOutputs) {
    writeFileSync(join(output, 'index.js'), genCommonESM(false, true), 'utf-8')
    writeFileSync(
      join(output, 'index.cjs'),
      genCommonCommonJS(false, true),
      'utf-8'
    )
    writeFileSync(join(output, 'index.d.ts'), genCommonDTS(), 'utf-8')
  }

  const freshExports = {}
  Object.keys(Vue).forEach(name => {
    if (!(name in LegacyVue)) {
      freshExports[name] = undefined
    }
  })

  writeFileSync(
    join(LEGACY_OUTPUT, 'index.js'),
    genLegacyESM(freshExports),
    'utf-8'
  )
  writeFileSync(
    join(LEGACY_OUTPUT, 'index.cjs'),
    genLegacyCommonJS(freshExports),
    'utf-8'
  )
  writeFileSync(
    join(LEGACY_OUTPUT, 'index.d.ts'),
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

  return `${genCommonDTS()}\n${fresh}`
}

function genCommonESM(isVue2, isVue3) {
  return `var isVue2 = ${isVue2}
var isVue3 = ${isVue3}

export * from 'vue'
export { isVue2, isVue3 }`
}

function genCommonCommonJS(isVue2, isVue3) {
  return `var Vue = require('vue')

Object.keys(Vue).forEach(function (key) {
  exports[key] = Vue[key]
})

exports.isVue2 = ${isVue2}
exports.isVue3 = ${isVue3}`
}

function genCommonDTS() {
  return `export declare const isVue2: boolean
export declare const isVue3: boolean

export * from 'vue'`
}
