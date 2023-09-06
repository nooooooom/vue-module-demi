var Vue = require('vue')

Object.keys(Vue).forEach(function (key) {
  exports[key] = Vue[key]
})

exports.isVue2 = true
exports.isVue3 = false

exports.default = Vue.default

