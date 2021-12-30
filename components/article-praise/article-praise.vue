<template>
	<view class="praise-box">
		<image class="img" src="/static/images/un-praise.png"></image>
		<text class="txt">点赞</text>
	</view>
</template>

<script>
export default {
	name: 'article-praise',
	data() {
		return {};
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
