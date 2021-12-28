<template>
	<view class="search-result-list-container">
		<!--
		 1. 通过mescroll-body包裹列表，指定ref为scrollRef，监听@init @down @up事件
		-->
		<empty-data v-if="isEmpty"></empty-data>
		<mescroll-body v-else ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!-- 循环渲染列表数据 -->
			<block v-for="(item, index) in resultList" :key="index">
				<view class="search-result-item-box" @click="onItemClick(item)">
					<!-- 内容区 - 样式 1 -->
					<search-result-item-theme1 v-if="!item.pic_list || item.pic_list.length === 0" :data="item" />

					<!-- 内容区 - 样式 2 -->
					<search-result-item-theme2 v-else-if="item.pic_list.length === 1" :data="item" />

					<!-- 内容区 - 样式 3 -->
					<search-result-item-theme3 v-else :data="item" />
				</view>
			</block>
		</mescroll-body>
	</view>
</template>
<script>
// 2. 导入对应的mixins
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { getSearchResult } from 'api/search';
export default {
	name: 'search-result-list',
	// 3. 注册mixins
	mixins: [MescrollMixin],
	props: {
		// 搜索关键字
		queryStr: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			// 数据源
			resultList: [],
			// 页数
			page: 1,
			// 判断是否是初次加载
			// 当页面初次渲染是，不光会回调init方法，还会回调down和up方法，为了避免在首次通过down和up获取数据
			isInit: true,
			// mescroll实例
			mescroll: null,
			// 是否显示空数据组件
			isEmpty: false
		};
	},
	// created() {
	// 	this.loadSearchResult();
	// },
	// 页面渲染完成之后回调，想要获取组件实例，需要在该回调中进行
	mounted() {
		this.mescroll = this.$refs.mescrollRef.mescroll;
	},
	methods: {
		/**
		 * 获取搜索数据
		 */
		async loadSearchResult() {
			const { data: res } = await getSearchResult({
				q: this.queryStr,
				p: this.page
			});

			console.log(this.resultList);
			// 高亮字段：在title字段下。搜索关键字都通过em标签进行了标记,所以所谓的搜索关键字高亮就是对em标签添加高亮样式
			res.list.forEach(item => {
				item.title = item.title.replace(/<em>/g, "<em style='color:#f94d2a; margin:0 2px'>");
				item.description = item.description.replace(/<em>/g, "<em style='color:#f94d2a; margin:0 2px'>");
			});

			// 使用下拉刷新，上垃加载的赋值策略
			if (this.page === 1) {
				this.resultList = res.list;
			} else {
				this.resultList = [...this.resultList, ...res.list];
			}
			
			// 测试代码，显示空组件
			// this.resultList = []
			if (this.resultList.length === 0) {
				this.isEmpty = true;
			}
		},
		/**
		 * 首次加载的回调
		 */
		async mescrollInit() {
			await this.loadSearchResult();
			// 不加async 就不会等到加载完毕就置为false了。逻辑下不合理
			this.isInit = false;
			// 首次加载完成。关闭上拉加载更多的动画
			this.mescroll.endSuccess();
		},
		async downCallback() {
			if (this.isInit) {
				return;
			}
			this.page = 1;
			await this.loadSearchResult();
			this.mescroll.endSuccess();
		},
		async upCallback() {
			if (this.isInit) {
				return;
			}
			this.page += 1;
			await this.loadSearchResult();
			this.mescroll.endSuccess();
		},
		/**
		 * 搜索结果列表的点击事件
		 */
		onItemClick(item) {
			uni.navigateTo({
				url: `/subpkg/pages/blog_detail/blog_detail?author=${item.author}&articleId=${item.id}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.search-result-list-container {
	padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	.search-result-item-box {
		margin-bottom: $uni-spacing-col-big;
	}
}
</style>
