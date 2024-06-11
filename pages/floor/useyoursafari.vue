<template>
	<default-page v-if="type" :type="type" title="点击右上角三个点,选择在浏览器中打开" :isBtn="false" />
</template>

<script>
	import defaultPage from '@/components/default-page/default-page.vue';
	export default {
		components: {
			defaultPage
		},
		data() {
			return {
				type: undefined
			}
		},
		onLoad(options) {
			
		}
	}
</script>

<style>

</style>
