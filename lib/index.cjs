var Vue = require('vue')

Object.keys(Vue).forEach(function (key) {
  exports[key] = Vue[key]
})

exports.isVue2 = false
exports.isVue3 = true

exports.default = undefined