const BASE_URL = 'https://api.imooc-blog.lgdsunday.club/api';
// 从vuex中拿取对应的token
import store from '@/store';


function request({ url, data, method }) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			data,
			method,
			header: {
				Authorization: store.state.user.token
			},
			success: ( {data} ) => {
				if (data.success) {
					// 请求成功
					resolve(data);
				} else {
					// 请求失败
					// 给用户一个提示
					uni.showToast({
						title:data.message,
						icon: 'none',
						mask: true,
						duration: 3000
					});
					reject(data.message);
				}
			},
			fail: (error) => {
				reject(error)
			},
			// 请求之后的回调
			complete: () => {
				// 关闭加载(前面没有显示loading使用这个也不会产生影响)
				uni.hideLoading();
			}
		})
	})
}

export default request;