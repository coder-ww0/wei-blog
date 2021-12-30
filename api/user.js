import request from '../utils/request.js';

/**
 * 用户登录
 */
export function login(data) {
	return request({
		url: '/sys/login',
		method: 'POST',
		data
	})
}