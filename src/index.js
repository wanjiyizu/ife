import Page from './components/page';
console.log('ddd');
const components = {
    Page
}
const ife = {
    ...components
}

const install = function(Vue, opts = {}) {
    if (install.installed) return;
    // locale.use(opts.locale);
    // locale.i18n(opts.i18n);

    Object.keys(ife).forEach(key => {
        Vue.component(key, ife[key]);
    });

    // Vue.prototype.$Loading = LoadingBar;
    // Vue.prototype.$Message = Message;
    // Vue.prototype.$Modal = Modal;
    // Vue.prototype.$Notice = Notice;
    // Vue.prototype.$Spin = Spin;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

const API = {
    // version: process.env.VERSION, // eslint-disable-line no-undef
    // locale: locale.use,
    // i18n: locale.i18n,
    install,
    // Circle,
    // Switch,
    ...components
};

// API.lang = (code) => {
//     const langObject = window['iview/locale'].default;
//     if (code === langObject.i.locale) locale.use(langObject);
//     else console.log(`The ${code} language pack is not loaded.`); // eslint-disable-line no-console
// };

module.exports.default = module.exports = API;   // eslint-disable-line no-undef