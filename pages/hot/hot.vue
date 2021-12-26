<template>
	<view class="hot-container">
		<image class="logo" src="@/static/images/logo.png" mode="aspectFit" />
		<!-- 组件可以直接进行使用，无需进行注册 -->
		<!--
		:config= "{
			textColor: '#00ff00',
			activeTextColor: '#ff00ff'
			}"
		-->
		<view class="search-box" @click="onToSearch">
			<my-search placeholderText="输入搜索框"></my-search>
		</view>
		<view class="tab-sticky">
			<my-tabs :tabData="tabData" :defaultIndex="currentIndex" @tabClick="onTabClick()"></my-tabs>
		</view>
		<!--
			1. 使用mock数据，构建List的基本结构
			2. 美化样式
			3. 根据tab 的切换，获取真实的数据
			4. 渲染真实的数据
			5. 让list具备左右切换的能力
				使用swiper进行改造
			6. 完成list与tabs联动的能力
		-->
		<!-- current 表示当前展示哪个swiperItem -->
		<swiper 
		@animationfinish="onSwiperEnd"
		@change="onSwiperChange"
		class="swiper" :current="currentIndex" :style="{height: currentSwiperHeight + 'px'}">
			<!-- swiperItem的数量，需要由tabData进行决定 -->
			<swiper-item class="swiper-item" v-for="(tabItem, tabIndex) in tabData" :key="tabIndex">
				<view>
					<!-- 加载动画 -->
					<uni-load-more status="loading" v-if="isLoading" />
					<block v-else>
						<hot-list-item 
						:class="'hot-list-item-' + tabIndex"
						v-for="(item, index) in listData[tabIndex]" :key="index" :data="item" :ranking="index + 1"></hot-list-item>
					</block>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
import { getHotTabs, getHotListFromTabType } from 'api/hot.js';

export default {
	data() {
		return {
			tabData: [],
			// 激活项
			currentIndex: 0,
			isLoading: true,
			// 以index为key，以对应的list为value
			listData: {},
			// 当前swiper的高度
			currentSwiperHeight: 0,
			// 缓存高度的计算结果,以index为key, 以对应的高度为value
			swiperHeightData: {},
			// 当前的滚动距离
			currentPageScrollTop: 0
		};
	},
	created() {
		this.loadHotTabs();
	},
	/**
	 * 监听页面的滚动
	 */
	onPageScroll(res) {
		this.currentPageScrollTop = res.scrollTop;
	},
	methods: {
		/**
		 * 获取 热搜文章类型
		 */
		async loadHotTabs() {
			const { data: res } = await getHotTabs();
			this.tabData = res.list;
			this.loadHostListFromTab();
		},
		/**
		 * 获取list列表
		 * 1. 没有获取到数据
		 * 		1.1 展示loading
		 * 		1.2 调用接口获取数据
		 * 		1.3 把数据保存到本地
		 * 		1.4 隐藏Loading
		 * 	2. 已经获取到数据（有了缓存之后）
		 * 		2.1 直接渲染数据就可以了
		 */
		async loadHostListFromTab() {
			if (!this.listData[this.currentIndex]) {
				this.isLoading = true;
				const id = this.tabData[this.currentIndex].id;
				const { data: res } = await getHotListFromTabType(id);
				// 把数据保存到本地
				this.listData[this.currentIndex] = res.list;
				this.isLoading = false;
				// 渲染完数据之后，计算高度
				// this.$nextTick()存在一定的兼容性问题
				setTimeout(async () => {
					// 获取到当前的swiper的高
					this.currentSwiperHeight = await this.getCurrentSwiperHeight()
					// 放入缓存
					this.swiperHeightData[this.currentIndex] = this.currentSwiperHeight
				}, 0)
			}
			// else {
			// 	// 有数据的情况
			// }
		},
		/**
		 * 获取子组件tabs的点击事件，取得激活项
		 */
		onTabClick(index) {
			this.currentIndex = index;
			this.loadHostListFromTab();
		},
		/**
		 * swiper 动画完成
		 */
		onSwiperEnd() {
			// 计算缓存是否存在，不存在再去获取数据
			if (!this.listData[this.currentIndex]) {
				this.loadHostListFromTab();
				return;
			}
			this.currentSwiperHeight = this.swiperHeightData[this.currentIndex];
		},
		/**
		 * 计算当前swiper高度
		 */
		getCurrentSwiperHeight() {
			// 1. 拿到所有的item -> 异步
			// 2. 拿到所有item的高度
			// 3. 把所有的高度累加
			return new Promise((resolve, reject) => {
				let sum = 0;
				// 拿到所有的 item -> 异步
				const query = uni.createSelectorQuery().in(this);
				query
				.selectAll(`.hot-list-item-${this.currentIndex}`)
				.boundingClientRect((res) => {
					res.forEach((item) => {
						sum += item.height;
					})
					resolve(sum);
				}).exec();
				
			})
		},
		onSwiperChange(e) {
			this.currentIndex = e.detail.current;
			// 控制列表的滚动位置
			if (this.currentPageScrollTop > 130) {
				uni.pageScrollTo({
					scrollTop: 130
				})
			}
		},
		/**
		 * 跳转到search-blog
		 */
		onToSearch() {
			console.log('点击事件')
			uni.navigateTo({
				url: '/subpkg/pages/search-blog/search-blog'
			})
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
	
	.tab-sticky {
		position: sticky;
		top: 0;
		// background-color: #fff;
		z-index: 999;
	}
	.swiper {
		height: 750rpx;
	}
}
</style>
