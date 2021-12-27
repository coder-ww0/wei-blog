const STORAGE_KEY = "search-list";

export default {
	// 独立的命名空间
	namespaced: true,
	// 通过state声明数据
	state: () => {
		return {
			// 搜索历史的数据 
			searchData: uni.getStorageSync(STORAGE_KEY) || []
		};
	},
	// 更改state中数据的唯一方式是：提交一个mutations
	mutations: {
		/**
		 * 把数据保存到本地
		 */
		saveToStorage(state) {
			uni.setStorage({
				key: STORAGE_KEY,
				data: state.searchData
			})
		},
		/**
		 * 添加数据
		 */
		addSearchData(state, val) {
			if (!val) {
				return;
			}
			const index = state.searchData.findIndex((item) => item === val);
			if (index !== -1) {
				state.searchData.splice(index,1);
			}
			state.searchData.unshift(val)
			// 在vuex的模块中。通过this.commit函数条用mutation
			// this.commit函数接受一个字符串为当前mutation的路径this.commit('模块名/mutation名')
			this.commit('search/saveToStorage')
		},
		/**
		 * 删除指定数据
		 */
		removeSearchData(state, index) {
			state.searchData.splice(index, 1);
			this.commit('search/saveToStorage')
		},
		/**
		 * 修改数据
		 */
		removeAllSearchData(state) {
			state.searchData = [];
			this.commit('search/saveToStorage')
		}
	}
} 