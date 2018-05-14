import Vue from 'vue';
import Router from 'vue-router';
import Index from './components/index';
import Page from './components/page';

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
		}
	]
});
