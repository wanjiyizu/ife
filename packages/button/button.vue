<template>
	<button
		:class="classes"
		:disabled="disabled"
		@click="clickHandle">
		<slot></slot>
	</button>
</template>
<script>
let prefixCls = 'ife-btn';
export default {
	name: 'Button',
	props: {
		disabled: Boolean
	},
	computed: {
		classes () {
			return [
				`${prefixCls}`
			];
		}
	},
	methods: {
		clickHandle (event) {
			this.$emit('click', event);
		}
	}
}
</script>

