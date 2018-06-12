<template>
	<input :class="inputClasses" type="text" ref="input" @input="updateValue" />
</template>
<script>
import adjustCaretPosition from './adjustCaretPosition'
import conformToMask from './conformToMask'
const prefixCls = 'ife-input';
export default {
	name: 'MaskInput',
	props: {
		value: '',
		placeholderChar: {
			type: String,
			default: '_'
		},
		mask: {
			type: Array,
			required: true
		}
	},
	data () {
		return {
			inputElement: null,
			// placeholderChar: '_',
			previousPlaceholder: '',
			previousConformedValue: ''
			// mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
			// mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
		};
	},
	mounted () {
		this.initMask();
	},
	computed: {
		inputClasses () {
			return [
				`${prefixCls}`
			];
		}
	},
	methods: {
		initMask () {
			this.inputElement = this.$refs.input;
		},
		updateValue (event) {
			event.preventDefault();
			let rawValue = event.target.value;
			let inputElement = this.inputElement;
			if (typeof rawValue === 'undefined') {
				rawValue = inputElement.value;
			}
			if (rawValue === this.previousConformedValue) {
				return;
			}
			let placeholder = this.convertMaskToPlaceholder(this.mask, this.placeholderChar);
			let {selectionEnd: currentCaretPosition} = inputElement;
			let mask = this.mask;
			let placeholderChar = this.placeholderChar;
			let previousConformedValue = this.previousConformedValue;
			let conformedMaskConfig = {
				previousConformedValue,
				currentCaretPosition,
				placeholderChar,
				placeholder,
				keepCharPositions: true
			};
			let {conformedValue, realValue} = conformToMask(rawValue, mask, conformedMaskConfig);
			let previousPlaceholder = this.previousPlaceholder;
			let adjustedCaretPosition = adjustCaretPosition({
				previousConformedValue,
				currentCaretPosition,
				previousPlaceholder,
				placeholderChar,
				conformedValue,
				placeholder,
				rawValue
			});
			let inputValueShouldBeEmpty = conformedValue === placeholder && adjustedCaretPosition === 0;
			let inputElementValue = inputValueShouldBeEmpty ? '' : conformedValue;
			this.previousConformedValue = inputElementValue;
			this.previousPlaceholder = placeholder;
			inputElement.value = inputElementValue;
			this.$emit('input', realValue);
			this.safeSetSelection(inputElement, adjustedCaretPosition);
		},
		safeSetSelection (element, selectionPosition) {
			if (document.activeElement === element) {
				element.setSelectionRange(selectionPosition, selectionPosition, 'none');
			}
		},
		convertMaskToPlaceholder (mask, placeholderChar) {
			return mask.map(char => {
				return char instanceof RegExp ? placeholderChar : char;
			}).join('');
		}
	}
}
</script>

