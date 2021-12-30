import { login } from "@/api/user.js"
const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'user-info'

export default {
	namespaced: true,
	state: () => ({
		// 用户token(同步)
		token: uni.getStorageSync(TOKEN_KEY) || '',
		// 用户信息(同步)
		userInfo: uni.getStorageSync(USER_INFO_KEY) || {}
	}),
	mutations: {
		/**
		 * 保存token
		 */
		setToken(state, token) {
			state.token = token;
			this.commit('user/saveToToken')
		},
		/**
		 * 保存userInfo
		 */
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo;
			this.commit('user/saveToUserInfo')
		},
		/**
		 * 保存token到本地
		 */
		saveToToken(state) {
			uni.setStorage({
				key: TOKEN_KEY,
				data: state.token
			})
		},
		/**
		 * 保存userInfo到本地存储
		 */
		saveToUserInfo(state) {
			uni.setStorage({
				key: USER_INFO_KEY,
				data: state.userInfo
			})
		},
		/**
		 * 删除token
		 */
		removeToken(state) {
			state.token = '';
			this.commit('user/saveToToken');
		},
		/**
		 * 删除用户信息
		 */
		removeUserInfo(state) {
			state.userInfo = {};
			this.commit('user/saveToUserInfo');
		}
	},
	// actions中完成异步操作
	actions: {
		/**
		 * 完成登录 context vuex的实例
		 */
		async login(context, userProfile) {
			const userInfo = userProfile.userInfo;
			// 调用登录接口，网站的登录，非微信的
			const { data : res } = await login({
				signature: userProfile.signature,
				iv: userProfile.iv,
				nickName: userInfo.nickName,
				gender: userInfo.gender,
				city: userInfo.city,
				province: userInfo.province,
				avatarUrl: userInfo.avatarUrl
			});
			// 登录逻辑
			this.commit('user/setToken', res.token);
			this.commit('user/setUserInfo', userInfo);
		},
		/**
		 * 退出登录
		 */
		logout(context) {
			this.commit('user/removeToken');
			this.commit('user/removeUserInfo');
		},
		/**
		 * 进行登录的判定
		 */
		async isLogin(context) {
			if (context.state.token) {
				return true;
			}
			// 如果用户没有登录，则引导用户进行登录
			const [error, res] = await uni.showModal({
				title: '登录之后才可以进行后续操作',
				content: '立即跳转到登录页面？(登录后自动返回当前页面)'
			});
			// 对象的解构赋值
			const { cancel, confirm } = res;
			if (confirm) {
				uni.navigateTo({
					url: '/subpkg/pages/login-page/login-page'
				})
			}
			return false;
		}
	}
}