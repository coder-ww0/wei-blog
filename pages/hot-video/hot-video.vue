<template>
	<view class="hot-video-container">
		<!-- 在页面中使用mescroll -->
		<!--  1. 导入mescroll-body  -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<block v-for="(item, index) in videoList" :key="index"><hot-video-item :data="item" @click="onItemClick"></hot-video-item></block>
		</mescroll-body>
	</view>
</template>

<script>
// 2. 导入 mixin
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { getHotVideoList } from '@/api/video.js';
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			page: 1,
			size: 10,
			// 数据源
			videoList: [],
			// 是否是首次加载
			isInit: true,
			// 实例
			mescroll: null
		};
	},
	// 3. 注册mixin
	mixins: [MescrollMixin],
	created() {
		// this.loadHotVideoList();
		uni.showModal({
			title: '提示',
			content: '因浏览器对视频解析问题，具体呈现效果可能会存在差异！'
		});
	},
	mounted() {
		this.mescroll = this.$refs.mescrollRef.mescroll;
	},
	methods: {
		...mapMutations('video', ['setVideoData']),
		/**
		 * 获取列表数据
		 */
		async loadHotVideoList() {
			const { data: res } = await getHotVideoList({
				page: this.page,
				size: this.size
			});
			// 判断是否是第一页的数据
			if (this.page === 1) {
				this.videoList = res.list;
			} else {
				this.videoList = [...this.videoList, ...res.list];
			}
		},
		/**
		 * 4. 实现对应的回调的方法
		 * List组件的首次加载
		 */
		async mescrollInit() {
			await this.loadHotVideoList();
			this.isInit = false;
			// 结束 上拉加载 && 下拉刷新
			this.mescroll.endSuccess();
		},
		/**
		 * 下拉刷新的回调
		 */
		async downCallback() {
			// 默认首次加载是会触发这个回调函数
			if (this.isInit) {
				return;
			}
			this.page = 1;
			await this.loadHotVideoList();
			// 结束 上拉加载 && 下拉刷新
			this.mescroll.endSuccess();
		},
		/**
		 * 上拉加载的回调
		 */
		async upCallback() {
			if (this.isInit) {
				return;
			}
			this.page += 1;
			await this.loadHotVideoList();
			// 结束 上拉加载 && 下拉刷新
			this.mescroll.endSuccess();
		},
		/**
		 * Item点击事件
		 */
		onItemClick(data) {
			// 保存当前点击的video的相关信息到vuex(当前video的信息量比较大，不适合通过url进行传递)
			// console.log(data)
			this.setVideoData(data);
			uni.navigateTo({
				url: '/subpkg/pages/video-detail/video-detail'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.hot-video-container {
	background-color: $uni-bg-color-grey;
}
</style>
