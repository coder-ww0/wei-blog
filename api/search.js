import request from '../utils/request.js'

/**
 * 获取默认的搜索内容
 */

export function getDefaultText() {
	return request({
		url: '/search/default-text'
	})
}