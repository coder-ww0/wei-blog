<template>
	<view class="comment-container" :style="{ bottom: bottom + 'px'}">
		<uni-easyinput v-model="value"
		 type="textarea" placeholder="说点什么..." :maxlength="50" :inputBorder="false"></uni-easyinput>
		<button class="commit" type="primary" :disabled="!value" size="mini" @click="onBtnClick">发送</button>
	</view>
</template>

<script>
	import { userArticleComment } from '@/api/user.js';
export default {
	name: 'article-comment-commit',
	props: {
		articleId: ''
	},
	data() {
		return {
			value: '',
			bottom:0
		};
	},
	created() {
		// 检测软键盘的变化(真机情况下)
		uni.onKeyboardHeightChange(({ height }) => {
			this.bottom = height;
		})
	},
	methods: {
		// 发送按钮的点击事件
		async onBtnClick() {
			uni.showLoading({
				title: '加载中'
			});
			// 调用接口
			const { data : res } = await userArticleComment({
				articleId: this.articleId,
				content: this.value
			});
			console.log(res)
			uni.showToast({
				title: '评论成功',
				icon: 'success',
				mask: true
			});
			// 关闭popup
			// 传递res数据用于进行消息的回显，便于进行最新评论数据的显示
			this.$emit('success', res)
		}
	}
};
</script>

<style lang="scss" scoped>
.comment-container {
	background-color: $uni-bg-color;
	text-align: right;
	padding: $uni-spacing-row-base;
	position: relative;
}
</style>
