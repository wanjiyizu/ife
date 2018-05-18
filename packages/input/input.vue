<template>
	<div :class="wrapClasses">
		<div :class="[prefixCls + '-group-addon']" v-if="prepend"><slot name="prepend"></slot></div>
		<div :class="affixWrapClasses" v-if="prefix || suffix">
			<div :class="prefixClasses" v-if="prefix">
				<slot name="prefix"></slot>
			</div>
			<input
				:class="inputClasses"
				:type="type"
				:placeholder="placeholder"
				@focus="focusHandle"
				@blur="blurHandle"
				@input="inputHanlde"
			/>
			<div :class="suffixClasses" v-if="suffix">
				<slot name="suffix"></slot>
			</div>
		</div>
		<input
			ref="input"
			v-else
			:class="inputClasses"
			:type="type"
			:value="currentValue"
			:placeholder="placeholder"
			@keydown="keydownHandle"
			@keypress="keypressHandle"
			@focus="focusHandle"
			@blur="blurHandle"
			@input="inputHanlde"
		/>
		<div :class="[prefixCls + '-group-addon']" v-if="append"><slot name="append"></slot></div>
	</div>
</template>
<script>
const prefixCls = 'ife-input';
export default {
	name: 'Input',
	props: {
		value: {
			type: [Number, String],
			default: ''
		},
		type: {
			type: String,
			default: 'text'
		},
		placeholder: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
			currentValue: this.value,
			prefixCls: prefixCls,
			focus: false,
			prepend: false,
			append: false,
			prefix: false,
			suffix: false,
			tests: [],
			timer: null,
			definitions: {
				'9': '[0-9]',
				'a': '[A-Za-z]',
				'*': '[A-Za-z0-9]'
			},
			buffer: [],
			defaultBuffer: '',
			delimiter: '_',
			mask: '99/99/99',
			firstNonMaskPos: null
		};
	},
	created () {
		this.initMask();
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
		}
	},
	methods: {
		initMask () {
			this.mask.split('').forEach(item => {
				if (this.definitions[item]) {
					this.tests.push(new RegExp(this.definitions[item]));
					if (this.firstNonMaskPos === null) {
						this.firstNonMaskPos = this.tests.length - 1;
					}
				} else {
					this.tests.push(null);
				}
			});
			this.buffer = this.mask.split('').map((item, i) => {
				return this.definitions[item] ? this.getPlaceholder(i) : item;
			});
			this.currentValue = this.defaultBuffer = this.buffer.join('');
		},
		checkValue () {
			let tests = this.tests;
			let value = this.currentValue;
			let i, pos, c;
			let mask = this.mask;
			let buffer = this.buffer;
			let lastMatch = -1;
			for (i = 0, pos = 0; i < mask.length; i++) {
				if (tests[i]) {
					while (pos++ < value.length) {
						c = value.charAt(pos - 1);
						if (tests[i].test(c)) {
							buffer[i] = c;
							lastMatch = i;
							break;
						}
					}
					if (pos > value.length) {
						break;
					}
				}
			}
			if (lastMatch + 1 < mask.length) {
				if (this.buffer.join('') === this.defaultBuffer) {
					console.log(this.defaultBuffer);
				} else {
					this.currentValue = this.buffer.join('');
				}
			}
			return i;
		},
		getPlaceholder (i) {
			if (i < this.delimiter.length) {
				return this.delimiter.charAt(i);
			} else {
				return this.delimiter.charAt(0);
			}
		},
		/**
		 * 寻求下一个光标位置
		 */
		seekNext (pos) {
			while (++pos < this.mask.length && !this.tests[pos]); // 跳过delimiter
			return pos;
		},
		seekPrev (pos) {
			while (--pos >= 0 && !this.tests[pos]); // 跳过delimiter
			return pos;
		},
		caret (begin, end) {
			if (this.$refs.input !== document.activeElement) {
				return;
			}
			if (typeof begin === 'number') {
				end = (typeof end === 'number') ? end : begin;
				this.$refs.input.setSelectionRange(begin, end);
			}
		},
		shiftL (begin, end) {
			if (begin < 0) {
				return;
			}
			let i, j;
			let len = this.mask.length;
			let buffer = this.buffer;
			for (i = begin, j = this.seekNext(end); i < len; i++) {
				if (this.tests[i]) {
					if (j < len && this.tests[i].test(buffer[i])) {
						buffer[i] = buffer[j];
						buffer[j] = this.getPlaceholder(j);
					} else {
						break;
					}
					j = this.seekNext(j);
				}
			}
			this.currentValue = buffer.join('');
			let b = Math.max(this.firstNonMaskPos, begin);
			this.caret(b);
			event.preventDefault();
		},
		clearBuffer (start, end) {
			let i;
			for (i = start; i < end && i < this.mask.length; i++) {
				if (this.tests[i]) {
					this.buffer[i] = this.getPlaceholder(i);
				}
			}
			console.log(this.buffer);
		},
		keydownHandle (event) {
			let key = event.keyCode;
			let begin = this.$refs.input.selectionStart;
			let	end = this.$refs.input.selectionEnd;
			if (key === 8 || key === 46) {
				if (begin - end === 0) {
					begin = key !== 46 ? this.seekPrev(begin) : (end = this.seekNext(begin - 1));
					end = key === 46 ? this.seekNext(end) : end;
				}
				this.clearBuffer(begin, end);
				this.shiftL(begin, end - 1);
			}
		},
		keypressHandle (event) {
			let key = event.keyCode;
			let pos = {
				begin: this.$refs.input.selectionStart,
				end: this.$refs.input.selectionEnd
			};
			let p = this.seekNext(pos.begin - 1);
			let c;
			let next;
			if (key < 32) {
				return;
			}
			if (key && key !== 13) {
				if (p < this.mask.length) {
					c = String.fromCharCode(key);
					if (this.tests[p].test(c)) {
						this.buffer[p] = c;
						this.currentValue = this.buffer.join('');
						if (this.$refs.input.value !== this.currentValue) {
							event.target.value = this.currentValue;
						}
						next = this.seekNext(p);
						setTimeout(() => {
							this.$refs.input.setSelectionRange(next, next);
						}, 1)
					}
				}
			}
		},
		inputHanlde (event) {
		},
		focusHandle (event) {
			this.focus = true;
			this.$emit('on-focus', event);
			let pos = this.checkValue();
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				if (pos === this.mask.length) {
					this.$refs.input.setSelectionRange(0, pos);
				} else {
					this.$refs.input.setSelectionRange(0, 0);
				}
			}, 1)
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
