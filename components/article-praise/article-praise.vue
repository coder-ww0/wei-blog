<template>
	<view class="praise-box" @click="onClick">
		<image class="img" :src="getIsPraise"></image>
		<text class="txt">点赞</text>
	</view>
</template>

<script>
import { mapActions } from 'vuex';
import { userPraise } from '@/api/user.js';
export default {
	name: 'article-praise',
	props: {
		articleData: {
			type: Object,
			// required: true
		}
	},
	data() {
		return {};
	},
	computed: {
		getIsPraise() {
			return this.articleData && this.articleData.isPraise ? '/static/images/praise.png' : '/static/images/un-praise.png';
		}
	},
	methods: {
		...mapActions('user', ['isLogin']),
		async onClick() {
			// 进行登录的判定，登录之后才允许发布评论
			if (!(await this.isLogin())) {
				return;
			}
			// 展示加载框
			uni.showLoading({
				title: '加载中'
			});
			const res = await userPraise({
				articleId: this.articleData.articleId,
				isPraise: !this.articleData.isPraise
			});
			console.log('点赞事件')
			console.log(res)
			// 关闭加载
			uni.hideLoading();
			// 更新数据(向父组件发送数据)
			this.$emit('changePraise', !this.articleData.isPraise)
		}
	}
};
</script>

<style lang="scss" scoped>
.praise-box {
	display: flex;
	// 列模式
	flex-direction: column;
	// 水平方向上居中
	align-items: center;
	.img {
		width: $uni-img-size-base;
		height: $uni-img-size-base;
		color: $uni-text-color;
	}
	.txt {
		font-size: $uni-font-size-sm;
		color: $uni-text-color;
	}
}
</style>
