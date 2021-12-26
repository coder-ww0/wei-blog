<template>
	<view class="search-history-container">
		<!-- title区域 -->
		<view class="search-history-title-box">
			<view class="search-history-title">搜索历史</view>
			<view v-if="!isShowClear"><uni-icons type="trash" @click="isShowClear = true"></uni-icons></view>
			<view v-else>
				<text class="txt" @click="onClearAll">全部删除</text>
				<text class="txt" @click="isShowClear = false">完成</text>
			</view>
		</view>
		<!-- 内容区域 -->
		<view class="search-history-box">
			<block v-for="(item, index) in searchData" :key="index">
				<view class="search-history-item" @click="onHistoryItemClick(item, index)">
					<text class="history-txt" line-clamp>{{ item }}</text>
					<uni-icons v-show="isShowClear" type="clear"></uni-icons>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	name: 'search-history',
	props: {
		searchData: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			isShowClear: false,
			// searchData: ['sunday', 'uniapp', 'vue', '前端']
		};
	},
	methods: {
		onClearAll() {
			uni.showModal({
				title: '提示',
				content: '删除搜索历史记录',
				showCancel: true,
				success :({ confirm, cancel}) => {
					if (confirm) {
						// 删除searchData
						this.$emit('removeAllSearchData');
						// 返回状态
						this.isShowClear = false;
					}
				}
			});
		},
		onHistoryItemClick(item, index) {
			console.log('单个删除事件生效')
			if (this.isShowClear) {
				// 删除指定的item
				this.$emit('removeSearchData', index)
			} else {
				this.$emit('onItemClick', item);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.search-history-container {
	padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	.search-history-title-box {
		display: flex;
		justify-content: space-between;

		.search-history-title {
			font-size: $uni-font-size-sm;
			color: $uni-text-color;
			padding: $uni-spacing-col-sm $uni-spacing-row-sm;
		}
		.txt {
			color: $uni-text-color-grey;
			font-size: $uni-font-size-sm;
			padding: $uni-spacing-col-sm $uni-spacing-row-sm;
		}
	}
	.search-history-box {
		margin-top: $uni-spacing-col-lg;
		.search-history-item {
			width: 50%;
			box-sizing: border-box;
			display: inline-block;
			padding: $uni-spacing-col-base $uni-spacing-row-base;
			position: relative;
			.history-txt {
				width: 85%;
				display: inline-block;
				color: $uni-text-color;
				font-size: $uni-font-size-base;
			}
		}
		.search-history-item:nth-child(odd):before {
			// 在每个偶数item项前面添加 |
			content: ' ';
			border-left: 1px solid #999;
			display: inline-block;
			height: 10px;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 0;
		}
	}
}
</style>
