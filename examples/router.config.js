import Vue from 'vue';
import Router from 'vue-router';
import Index from './components/index';
import Button from './components/button';
import Page from './components/page';
import Input from './components/input';
import MaskInput from './components/mask-input';
import Select from './components/select';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Index',
			component: Index
		},
		{
			path: '/page',
			name: 'page',
			component: Page
		},
		{
			path: '/input',
			name: 'input',
			component: Input
		},
		{
			path: '/mask-input',
			name: 'mask-input',
			component: MaskInput
		},
		{
			path: '/button',
			name: 'button',
			component: Button
		},
		{
			path: '/select',
			name: 'select',
			component: Select
		}
	]
});
