<template>
	<view>
		<my-login @onLoginSuccess="onLoginSuccess"></my-login>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			/**
			 * 子组件登录成功传过来的消息
			 */
			onLoginSuccess() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
