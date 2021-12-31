// 1. 导入 vue和 vuex 
import Vue from 'vue';
import Vuex from 'vuex';

// 导入search.js
import search from './modules/search.js'
import user from './modules/user.js'
import video from './modules/video';
// 2. 安装vuex插件
Vue.use(Vuex);

// 3. 创建store实例
const store = new Vuex.Store({
	// 模块
	modules: {
		search,
		user,
		video
	}
})


export default store;