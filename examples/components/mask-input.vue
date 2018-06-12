<template>
	<div>
		<MaskInput v-model="name" :mask="mask" />
		<button @click="getValue">11111</button>
	</div>
</template>
<script>
export default {
	data () {
		return {
			name: '',
			mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
		};
	},
	methods: {
		getValue () {
			console.log(this.name);
		}
	}
};
</script>
