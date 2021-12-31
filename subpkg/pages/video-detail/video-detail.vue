<template>
	<view class="video-detail-container">
		<view class="video-box">
			<video id="myVideo" class="video" :danmu-list="danmuList" :src="videoData.play_url" enable-danmu danmu-btn controls />
			<hot-video-info :data="videoData" />
		</view>
		<!-- 弹幕模块 -->
		<view class="danmu-box">
			<!-- 弹幕数据加载中 -->
			<uni-load-more status="loading" v-if="isLoadingComment"></uni-load-more>
			<!-- 无弹幕数据 -->
			<empty-data v-else-if="commentList.length === 0"></empty-data>
			<!-- 弹幕列表 -->
			<view class="comment-container" v-else>
				<view class="all-comment-title">全部弹幕</view>
				<view class="list">
					<!-- 使用danmuList会出现新加的弹幕无法正常实时显示 -->
					<block v-for="(item, index) in commentList" :key="index"><article-comment-item :data="item" /></block>
				</view>
			</view>
		</view>
		<!-- 底部功能区 -->
		<article-operate placeholder="发个弹幕,开心一下..." :articleData="videoData" @commentClick="onCommit" @changePraise="onChangePraise" @changeCollect="onChangeCollect" />
		<!-- 输入弹幕的popup -->
		<uni-popup ref="popup" type="bottom" @change="onCommitPopupChange">
			<article-comment-commit :articleId="videoData.id" @success="onSendDanmu" v-if="isShowCommit" />
		</uni-popup>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getVideoDanmuList } from '@/api/video.js';
import { getRandomColor } from 'utils';

export default {
	data() {
		return {
			// 弹幕数据源
			danmuList: [],
			// 评论数据源
			commentList: [],
			isShowCommit: false,
			videoContext: null,
			isLoadingComment: true
		};
	},
	created() {
		this.loadVideoDanmuList();
	},
	onReady() {
		this.videoContext = uni.createVideoContext('myVideo');
	},
	computed: {
		...mapState('video', ['videoData'])
	},
	methods: {
		...mapMutations('video', ['setVideoData']),
		/**
		 * 获取弹幕列表
		 */
		async loadVideoDanmuList() {
			const { data: res } = await getVideoDanmuList({
				videoId: this.videoData.id
			});
			// 定义随机颜色
			res.list.forEach(item => {
				item.color = getRandomColor();
			});
			// 实现对象的深拷贝
			this.danmuList = [...res.list];
			this.commentList = [...res.list];
			// console.log(this.danmuList);
			this.isLoadingComment = false;
		},
		/**
		 * 发送弹幕的点击事件
		 */
		onCommit() {
			console.log('点击事件');
			this.$refs.popup.open();
		},
		/**
		 * 发布弹幕的 popup 切换事件
		 */
		onCommitPopupChange(e) {
			// 修改对应的标记，当 popup 关闭时，为了动画平顺，进行延迟处理
			if (e.show) {
				this.isShowCommit = e.show;
			} else {
				setTimeout(() => {
					this.isShowCommit = e.show;
				}, 200);
			}
		},
		/**
		 * 发送弹幕成功之后的回调
		 */
		onSendDanmu(data) {
			// 使用sendDanmmu函数使弹幕的发送
			console.log(data.info);
			console.log(this.videoContext);
			this.videoContext.sendDanmu({
				text: data.info.content,
				color: getRandomColor()
			});
			// 添加弹幕到弹幕列表
			this.commentList.unshift(data.info);
			// 关闭popup
			this.$refs.popup.close();
			// 关闭popup标记
			this.isShowCommit = false;
			// 提示用户
			uni.showToast({
				title: '发表成功',
				icon: 'success'
			});
		},
		/**
		 * 点赞处理回调
		 */
		onChangePraise(isPraise) {
			this.setVideoData({ ...this.videoData, isPraise });
		},
		/**
		 * 收藏处理回调
		 */
		onChangeCollect(isCollect) {
			this.setVideoData({ ...this.videoData, isCollect });
		}
	}
};
</script>

<style lang="scss" scoped>
.video-detail-container {
	.video-box {
		background-color: $uni-bg-color;
		position: sticky;
		top: 0;
		z-index: 9;
		.video {
			width: 100%;
			height: 230px;
		}
	}
	.danmu-box {
		border-top: $uni-spacing-col-sm solid $uni-bg-color-grey;
		margin-bottom: 36px;
		.comment-container {
			padding: $uni-spacing-col-lg $uni-spacing-row-lg;
			.all-comment-title {
				font-size: $uni-font-size-lg;
				font-weight: bold;
			}
		}
	}
}
</style>
