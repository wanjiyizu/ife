import Input from '../packages/input/input';
import MaskInput from '../packages/mask-input/mask-input';
import Page from '../packages/page/page';

const components = [
	Input,
	MaskInput,
	Page
];

const install = function (Vue) {
	if (install.installed) return;
	components.forEach(component => {
		Vue.component(component.name, component);
	});
};
if (typeof window !== 'undefined' && window.Vue) {
	install(window.VUe);
}
export default {
	install,
	...components
};
