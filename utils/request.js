const BASE_URL = 'https://api.imooc-blog.lgdsunday.club/api';


function request({ url, data, method }) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			data,
			method,
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
			}
		})
	})
}

export default request;