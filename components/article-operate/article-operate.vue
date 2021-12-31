<template>
	<view class="operate-container">
		<!-- 输入框（首页的输入框） -->
		<view class="comment-box" @click="onCommentClick">
			<my-search
				placeholderText="评论一句,前排大call...."
				:config="{
					height: 28,
					backgroundColor: '#eeedf4',
					icon: '/static/images/input-icon.png',
					textColor: '#a6a5ab',
					border: 'none'
				}"
			></my-search>
		</view>
		<!-- 点赞 -->
		<view class="options-box">
			<article-praise 
			@changePraise="$emit('changePraise', $event)"
			:articleData="articleData"></article-praise>
			</view>
		<!-- 收藏 -->
		<view class="options-box"><article-collect
		:articleData="articleData" @changeCollect="$emit('changeCollect', $event)"
		></article-collect></view>
	</view>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	name: 'article-operate',
	props: {
		articleData: {
			type: Object,
			// required: true
		}
	},
	data() {
		return {};
	},
	methods: {
		...mapActions('user', ['isLogin']),
		/**
		 * 用户点击评论（需要进行是否登录判断）
		 */
		async onCommentClick() {
			const isLogin = await this.isLogin();
			if (!isLogin) {
				return;
			}
			this.$emit('commentClick');
		}
	}
};
</script>

<style lang="scss" scoped>
.operate-container {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: $uni-bg-color;
	padding: 4px 6px 20px 6px;
	border-top: 1px solid $uni-bg-color-grey;
	display: flex;
	// justify-content: space-around;
	// 居中对齐
	align-items: center;
	.comment-box {
		flex-grow: 2;
	}
	.options-box {
		flex-grow: 1;
	}
}
</style>
