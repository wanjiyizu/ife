<template>
	<div :class="wrapClasses">
		<div :class="[prefixCls + '-group-addon']" v-if="prepend"><slot name="prepend"></slot></div>
		<div :class="affixWrapClasses" v-if="prefix || suffix">
			<div :class="prefixClasses" v-if="prefix">
				<slot name="prefix"></slot>
			</div>
			<MaskInput
				v-if="mask"
				v-model="currentValue"
				@on-change="changeHandle"
				:mask="mask" />
			<input
				v-else
				ref="input"
				type="text"
                spellcheck="false"
				autocomplete="off"
				@blur="blurHandle"
				@focus="focusHandle"
				:value="currentValue"
				@input="inputHanlde"
				:class="inputClasses"
				:placeholder="placeholder"
				@keydown.stop="keydownHandle"
			/>
			<div :class="suffixClasses" v-if="suffix">
				<slot name="suffix"></slot>
			</div>
		</div>
		<MaskInput
			v-else-if="mask"
			v-model="currentValue"
			@on-change="changeHandle"
			:mask="mask" />
		<input
			v-else
			ref="input"
			type="text"
			spellcheck="false"
			autocomplete="off"
			@blur="blurHandle"
			@focus="focusHandle"
			@input="inputHanlde"
			:value="currentValue"
			:class="inputClasses"
			:placeholder="placeholder"
			@keydown.stop="keydownHandle"
		/>
		<div :class="[prefixCls + '-group-addon']" v-if="append"><slot name="append"></slot></div>
	</div>
</template>
<script>
import MaskInput from '../mask-input/mask-input.vue';
const prefixCls = 'ife-input';
export default {
	name: 'Input',
	components: {MaskInput},
	props: {
		value: {
			type: [Number, String],
			default: ''
		},
		type: {
			type: String,
			default: 'text'
		},
		max: {
			type: Number,
			default: Infinity
		},
		min: {
			type: Number,
			default: -Infinity
		},
		step: {
			type: Number,
			default: 1
		},
		precision: {
			type: Number
		},
		formatter: {
			type: Function
		},
		placeholder: {
			type: String,
			default: ''
		},
		placeholderChar: {
			type: String,
			default: '_'
		},
		mask: {
			type: Array
		}
	},
	data () {
		return {
			currentValue: this.value,
			prefixCls: prefixCls,
			inputType: this.type,
			focus: false,
			prepend: false,
			append: false,
			prefix: false,
			suffix: false
		};
	},
	mounted () {
		this.prefix = this.$slots.prefix !== undefined;
		this.suffix = this.$slots.suffix !== undefined;
		this.prepend = this.$slots.prepend !== undefined;
		this.append = this.$slots.append !== undefined;
	},
	computed: {
		wrapClasses () {
			return [
				`${prefixCls}-wrapper`,
				{
					[`${prefixCls}-group`]: this.prepend || this.append
				}
			];
		},
		affixWrapClasses () {
			return [
				`${prefixCls}-affix-wrapper`,
				{
					[`${prefixCls}-affix-wrapper-focus`]: (this.prefix || this.suffix) && this.focus,
				}
			]
		},
		inputClasses () {
			return [
				`${prefixCls}`
			];
		},
		prefixClasses () {
			return [
				`${prefixCls}-prefix`
			];
		},
		suffixClasses () {
			return [
				`${prefixCls}-suffix`
			];
		},
		formatterValue () {
			if (this.formatter) {
				return this.formatter(this.currentValue);
			} else {
				this.currentValue;
			}
		}
	},
	methods: {
		changeHandle (value) {
			this.$emit('input', value);
		},
		inputHanlde (event) {
			let value = event.target.value.trim();
			if (this.inputType === 'number') {
				let match = /^-?[1-9]*(\.\d*)?$|^-?0(\.\d*)?$/;
				if (value.length === 0) {
					this.currentValue = value;
					this.$emit('input', value);
					return;
				}
				if (match.test(value)) {
					if (Number(value) > this.max) {
						this.setNumber(this.max);
					} else if (Number(value) < this.min) {
						this.setNumber(this.min);
					} else {
						this.setNumber(value);
					}
					let arr = value.split('.');
					if (arr !== undefined && arr.length > 1) {
						if (arr[1].length > this.precision) {
							event.target.value = this.currentValue;
							this.$emit('input', this.currentValue);
						}
					}
				} else {
					event.target.value = this.currentValue;
				}
			} else {
				this.currentValue = value;
				this.$emit('input', this.currentValue);
			}
		},
		keydownHandle (event) {
			if (event.keyCode === 38 && this.inputType === 'number') {
				event.preventDefault();
				this.up(event);
			} else if (event.keyCode === 40 && this.inputType === 'number') {
				event.preventDefault();
				this.down(event);
			}
		},
		up (event) {
			let value = Number(event.target.value);
			if (isNaN(value)) {
				return;
			}
			this.changeStep('up', value);
		},
		down (event) {
			let value = Number(event.target.value);
			if (isNaN(value)) {
				return;
			}
			this.changeStep('down', value);
		},
		changeStep (type, value) {
			if (isNaN(value)) return;
			let val = Number(this.currentValue);
			if (type === 'up') {
				if (this.addNum(value, this.step) <= this.max) {
					val = this.addNum(value, this.step);
				}
			} else {
				if (this.addNum(value, -this.step) >= this.min) {
					val = this.addNum(value, -this.step);
				}
			}
			this.setNumber(val);
		},
		setNumber (val) {
			if (!isNaN(this.precision)) {
				val = Number(Number(val).toFixed(this.precision));
			}
			this.currentValue = val;
			this.$emit('input', val);
		},
		addNum (num1, num2) {
			let sq1, sq2, m;
			try {
				sq1 = num1.toString().split('.')[1].length; // 获取小数位数
			}
			catch (e) {
				sq1 = 0;
			}
			try {
				sq2 = num2.toString().split('.')[1].length;  // 获取小数位数
			}
			catch (e) {
				sq2 = 0;
			}
			m = Math.pow(10, Math.max(sq1, sq2)); // 0.2 + 0.222 = 0.42200000000000004 (0.2 * 1000 + 0.222 * 1000) / 1000 = 2.422
        	return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
		},
		focusHandle (event) {
			this.focus = true;
			this.$emit('on-focus', event);
		},
		blurHandle (event) {
			this.focus = false;
			this.$emit('on-blur', event);
		}
	}
}
</script>
<style lang="less">
</style>
