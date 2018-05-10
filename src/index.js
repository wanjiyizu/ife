import Hello from '../packages/input/input'

const install = function (Vue) {
  if (install.installed) return
  Vue.component(Hello.name, Hello)
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.VUe)
}
export default {
  install,
  Hello
}