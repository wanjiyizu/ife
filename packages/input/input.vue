<template>
	<div :class="wrapClasses">
		<input :class="inputClasses" :placeholder="placeholder" />
	</div>
</template>
<script>
const prefixCls = 'ife-input';
export default {
	name: 'Input',
	props: {
		placeholder: {
			type: String,
			default: '请输入'
		}
	},
	computed: {
		wrapClasses () {
			return [
				`${prefixCls}-wrapper`
			];
		},
		inputClasses () {
			return [
				`${prefixCls}`
			];
		}
	}
}
</script>
