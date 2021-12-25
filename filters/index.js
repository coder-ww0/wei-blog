/**
 * 将字符串转为以k为单位的字符串
 */

export function hotNumber(val) {
	const num = parseInt(val);
	if (num < 1000) {
		return val;
	}
	// 把val转为字符串
	val = val + '';
	return val.substring(0, val.length - 3) + 'k'
}