# vue-module-demi [![npm version](https://badge.fury.io/js/vue-module-demi.svg)](http://badge.fury.io/js/vue-module-demi)

~~_Module '"vue"' has no exported member 'Fragment'_~~

When I was developing a library compatible with Vue2 & 3, I often encountered work that could not continue because the two packages did not export similar modules.

For example, I wanted to assert whether the current `VNode` type is `Fragment`. I Can't import `Fragment` from `Vue` for comparison because ESM doesn't allow destructuring imports that don't exist, and if I use `import * as Vue from 'vue'` and `Vue.Fragment`, it won't be tree-shaking friendly.

Overall, this library smooths out the inconsistency of Vue2 & 3 modules export. If a module doesn't exist, it will be exported as `undefined` in Vue2.
