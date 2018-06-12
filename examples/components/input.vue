<template>
	<div>
		<Input :mask="[/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]">
		<!-- <span slot="prefix">1</span>
		<span slot="suffix">1</span>
		<span slot="prepend">sd</span>
		<span slot="append">sd</span> -->
		</Input>
		<br/>
		<Input v-model="value" type="number" :max="10" :min="1" :precision="2" />
		{{ value }}
	</div>
</template>
<script>
export default {
	data () {
		return {
			value: ''
		};
	}
};
</script>
