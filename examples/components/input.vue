<template>
	<div>
		<Input v-model="value" :mask="[/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]" />
		mask: {{ value }}
		<br/>
		<Input v-model="value2" >
		<span slot="prefix">://</span>
		<span slot="suffix">1</span>
		<span slot="prepend">.com</span>
		<span slot="append">.cn</span>
		</Input>
		前后缀: {{ value2 }}
		<br/>
		<Input v-model="value3" type="number" :max="10" :min="1" :precision="2" />
		数字输入框: {{ value3 }}
	</div>
</template>
<script>
export default {
	data () {
		return {
			value: '',
			value2: '',
			value3: ''
		};
	}
};
</script>
