<template>
	<div>
		<Button @click="clickHandle">primary</Button>
	</div>
</template>
<script>
export default {
	methods: {
		clickHandle (e) {
			console.log(e);
		}
	}
};
</script>
