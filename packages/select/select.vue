<template>
	<div :class="classes">
		<div :class="selectionCls">
			<SelectHead
				:placeholder="placeholder"
			/>
		</div>
		<div :class="dropdownCls">
			<ul :class="prefixCls + 'dropdown-list'">
				<slot></slot>
			</ul>
		</div>
	</div>
</template>
<script>
import SelectHead from './select-head';
const prefixCls = 'ife-select';
export default {
	name: 'Select',
	components: {
		SelectHead
	},
	props: {
		placeholder: {
			type: String,
			default: '请选择'
		}
	},
	computed: {
		classes () {
			return [
				`${prefixCls}`,
				{
					[`${prefixCls}-single`]: true
				}
			];
		},
		selectionCls () {
			return {
				[`${prefixCls}-selection`]: true
			};
		},
		dropdownCls () {
			return {
				[`${prefixCls}-dropdown`]: true
			};
		}
	}
};
</script>
