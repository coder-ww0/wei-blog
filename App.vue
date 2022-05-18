<script>
	export default {
		onLaunch: function() {
			/**
			 * 条件编译
			 * 1. 以#ifdef %PLATFORM%开头，以#endif结尾: 仅在某平台存在
			 * 2.  以#ifndef %PLATFORM%开头，以#endif结尾: 除了某平台均存在
			 */
			/* #ifdef H5 */
			console.log('当前处于H5编译平台')
			/* #endif */
			/* #ifndef H5 */
			console.log('当前处于非H5编译平台')
			/* #endif */
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss';
	@import '@/uni.scss';
	/* #ifndef APP-NVUE */
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
