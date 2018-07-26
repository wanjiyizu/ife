import Button from '../packages/button/button';
import Input from '../packages/input/input';
import MaskInput from '../packages/mask-input/mask-input';
import Page from '../packages/page/page';
import Select from '../packages/select/select';

const components = [
	Button,
	Input,
	MaskInput,
	Page,
	Select
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
