<template>
	<view class="hot-container">
		<image class="logo" src="@/static/images/logo.png" mode="aspectFit" />
		<!-- 组件可以直接进行使用，无需进行注册 -->
		<view class="search-box">
			<my-search placeholderText="输入搜索框"></my-search>
			<my-tabs :tabData="tabData" :defaultIndex="currentIndex"></my-tabs>
		</view>
	</view>
</template>

<script>
	import { getHotTabs } from 'api/hot.js'
	
export default {
	data() {
		return {
			tabData: [],
			currentIndex: 0
		};
	},
	created() {
		this.loadHotTabs();
	},
	methods: {
		/**
		 * 获取 热搜文章类型
		 */
		async loadHotTabs() {
			const { data : res} = await getHotTabs();
			this.tabData = res.list;
		}
	}
};
</script>

<style lang="scss" scoped>
// scope表示当前文件的样式只在当前组件中生效
.hot-container {
	background-color: $uni-bg-color;
	.logo {
		width: 100%;
		height: 80px;
	}
	
	.search-box {
		padding: 0 16px;
		margin-bottom: $uni-spacing-col-base;
	}
}
</style>
