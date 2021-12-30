<template>
	<page-meta root-font-size="52px">
		<view class="detail-container">
			<!-- 文章内容区域 -->
			<block v-if="articleData">
				<!-- 标题 -->
				<view class="title">{{ articleData.articleTitle }}</view>
				<view class="detail-info">
					<view class="detail-left">
						<view class="avatar-box">
							<!-- 头像 -->
							<image class="avatar" :src="articleData.avatar"></image>
						</view>
						<view class="author-box">
							<!-- 作者 -->
							<text class="author">{{ articleData.nickName }}</text>
							<!-- 发布时间 -->
							<text class="release-time">{{ articleData.date }}</text>
						</view>
					</view>
					<view class="detail-right">
						<!-- 关注按钮 -->
						<button class="follow" size="mini" @click="onFollowClick">关注</button>
					</view>
				</view>
				<!-- 文章内容 -->
				<!-- <rich-text :nodes="articleData.content"></rich-text> -->
				<!-- 必须为 mp-html 增加 markdown_views 的类名 -->
				<mp-html class="markdown_views" :content="addClassFromHTML(articleData.content)" scroll-table />
				<!-- 评论列表 -->
				<!-- <view class="comment-box"> -->
				<article-comment-list v-bind:articleId="articleId" ref="mescrollItem"></article-comment-list>
				<!-- </view> -->
			</block>
			<!-- 底部功能区 -->
			<article-operate></article-operate>
		</view>
	</page-meta>
</template>

<script>
import MescrollCompMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-comp.js';
// 导入组件
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html';
import { getArticleDetail } from '@/api/article.js';
import { mapActions } from 'vuex';

export default {
	// 注册组件
	components: {
		mpHtml
	},
	mixins: [MescrollCompMixin],
	data() {
		return {
			// 作者名(传参数必须)
			author: '',
			// 文章id(传参必须)
			articleId: '',
			// 文章详情数据
			articleData: []
		};
	},
	/**
	 * 页面的生命周期函数(created是组件中使用的)
	 * onLoad值加载一次，监听页面加载，其参数为上个页面传递的数据，参数类型为Object
	 */
	onLoad(options) {
		this.author = options.author;
		this.articleId = options.articleId;
		console.log(this.author);
		console.log(this.articleId);
		this.loadArticleDetail();
	},
	methods: {
		...mapActions('user', ['isLogin']),
		/**
		 * 获取文章详情数据
		 */
		async loadArticleDetail() {
			uni.showLoading({
				title: '加载中'
			});
			const { data: res } = await getArticleDetail({
				author: this.author,
				articleId: this.articleId
			});
			this.articleData = res.data;
			// console.log(this.articleData);
		},
		/**
		 * 为所有的 DOM 增加类名
		 */
		addClassFromHTML(info) {
			if (!info) {
				return;
			}
			return info
				.replace(/<p>/gi, '<p class="p-cls">')
				.replace(/<a>/gi, '<a class="a-cls">')
				.replace(/<h1>/gi, '<h1 class="h1-cls">')
				.replace(/<h2>/gi, '<h2 class="h2-cls">')
				.replace(/<h3>/gi, '<h3 class="h3-cls">')
				.replace(/<h4>/gi, '<h4 class="h4-cls">')
				.replace(/<h5>/gi, '<h5 class="h5-cls">')
				.replace(/<h6>/gi, '<h6 class="h6-cls">')
				.replace(/<ul>/gi, '<ul class="ul-cls">')
				.replace(/<li>/gi, '<li class="li-cls">')
				.replace(/<ol>/gi, '<ol class="ol-cls">')
				.replace(/<td>/gi, '<td class="td-cls">')
				.replace(/<th>/gi, '<th class="th-cls">')
				.replace(/<tr>/gi, '<tr class="tr-cls">')
				.replace(/<dl>/gi, '<dl class="dl-cls">')
				.replace(/<dd>/gi, '<dd class="dd-cls">')
				.replace(/<hr>/gi, '<hr class="hr-cls">')
				.replace(/<pre>/gi, '<pre class="pre-cls">')
				.replace(/<strong>/gi, '<strong class="strong-cls">')
				.replace(/<input>/gi, '<input class="input-cls">')
				.replace(/<table>/gi, '<table class="table-cls">')
				.replace(/<details>/gi, '<details class="details-cls">')
				.replace(/<code>/gi, '<code class="code-cls">')
				.replace(/<kbd>/gi, '<kbd class="kbd-cls">')
				.replace(/<summary>/gi, '<summary class="summary-cls">')
				.replace(/<blockquote>/gi, '<blockquote class="blockquote-cls">')
				.replace(/<img/gi, '<img class="img-cls"');
		},
		/**
		 * 关注按钮的点击事件
		 */
		async onFollowClick() {
			const isLogin = await this.isLogin();
			// 如果没有登录则不能进行下一步的操作(关注)
			if (!isLogin) {
				return;
			}
		}
	}
};
</script>

<style lang="scss">
@import '~@/styles/article-detail.scss';
.detail-container {
	padding: $uni-spacing-col-base $uni-spacing-row-base;
	padding-bottom: 68px;
	.title {
		font-size: $uni-font-size-title;
		color: $uni-text-color-title;
		font-weight: bold;
	}
	.detail-info {
		padding: $uni-spacing-col-base 0;
		display: flex;
		justify-content: space-between;

		.detail-left {
			display: flex;
			.author-box {
				margin-left: $uni-spacing-row-base;
				display: flex;
				flex-direction: column;
				.author {
					font-size: $uni-font-size-base;
					font-weight: bolder;
					color: $uni-color-title;
				}
				.release-time {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
				}
			}
		}

		.detail-right {
			display: flex;
			align-items: center;
		}
	}
}
</style>
