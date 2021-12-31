export default {
	// 独立的命名空间
	namespaced: true,
	// 通过state生命数据
	state: () => ({
		videoData: {}
	}),
	// 更改state数据的唯一方式是，提交mutations
	mutations: {
		/**
		 * 保存视频对象到vuex
		 */
		setVideoData(state, videoData) {
			state.videoData = videoData;
		}
	}
}
