<template>
	<view class="comment-limt-container" v-if="!isShowAllComment">
		<view class="comment-title">精简评论</view>
		<block v-for="(item, index) in commentList.slice(0, 2)" :key="index">
			<!-- item项组件 -->
			<article-comment-item :data="item.info"></article-comment-item>
		</block>
		<view class="show-more" @click="onMoreClick">查看更多</view>
	</view>
	<!-- 全部评论 -->
	<view class="comment-all-container" v-else>
		<mescroll-body
			ref="mescrollRef"
			@init="mescrollInit"
			@up="upCallback"
			:down="{
				use: false
			}"
			:up="{
				textNoMore: '-- 我也是有底线的！！ --'
			}"
		>
			<view class="comment-title">全部评论</view>
			<block v-for="(item, index) in commentList" :key="index">
				<!-- item项组件 -->
				<article-comment-item :data="item.info"></article-comment-item>
			</block>
		</mescroll-body>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { getArticleCommentList } from '../../api/article.js';
export default {
	name: 'article-comment-list',
	mixins: [MescrollMixin],
	props: {
		articleId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			// 当前的页数
			page: 1,
			// 每页的评论数
			pageSize: 5,
			// 评论数据
			commentList: [],
			// 是否展示全部评论
			isShowAllComment: false,
			// 评论是否是第一次加载
			isInit: true,
			// 组件的实例
			mescroll: null,
			// 评论总数
			commentListTotal: 0
		};
	},
	// beforeMount() {
	// 	this.loadCommentList();
	// 	console.log('测试相关代码')
	// 	console.log(this.articleId)
	// },
	methods: {
		async loadCommentList() {
			const { data: res } = await getArticleCommentList({
				articleId: this.articleId,
				page: this.page,
				size: this.pageSize
			});
			this.commentListTotal = res.count;
			if (this.page === 1) {
				this.commentList = res.list;
			} else {
				this.commentList = [...this.commentList, ...res.list];
			}
		},
		/**
		 * 点击查看更多
		 */
		onMoreClick() {
			this.isShowAllComment = true;
		},
		/**
		 * 评论滚动   mescrollInit
		 * 首次加载
		 */
		async mescrollInit() {
			await this.loadCommentList();
			this.isInit = false;
			// 结束上拉加载 && 下拉刷新
			this.getMescroll().endSuccess();
			// 判断数据是否加载完成
			this.getMescroll().endBySize(this.commentList.length, this.commentListTotal);
		},
		/**
		 * 上拉加载更多
		 */
		async upCallback() {
			if (this.isInit) {
				return;
			}
			this.page += 1;
			await this.loadCommentList();

			// 结束上拉加载 && 下拉刷新
			this.getMescroll().endSuccess();
			// 判断数据是否加载完成
			this.getMescroll().endBySize(this.commentList.length, this.commentListTotal);
		},
		/**
		 * 返回mescroll实例对象(默认情况下第一次进来的时候，不会出现mescroll实例，只有
		 * 点击了加载更多才会出现)
		 */
		getMescroll() {
			if (!this.mescroll) {
				this.mescroll = this.$refs.mescrollRef.mescroll;
			}
			return this.mescroll;
		}
	},
	watch: {
		articleId: {
			handler(val) {
				if (val) {
					this.loadCommentList();
				}
				console.log(this.articleId);
				immediate: true;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.comment-title {
	font-weight: bold;
	color: $uni-text-color-title;
	font-size: $uni-font-size-lg;
	margin: $uni-spacing-col-lg 0;
}
.comment-limt-container {
	.show-more {
		margin: $uni-spacing-col-lg;
		text-align: center;
		color: $uni-text-color-more;
		font-size: $uni-font-size-base;
	}
}
</style>
