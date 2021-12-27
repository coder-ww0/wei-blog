
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

// 1.导入dayjs 
import dayjs from 'dayjs';
// 2. dayjs默认语言是英文，配置成中文
import 'dayjs/locale/zh-cn';
// 3. 引入 relativeTime 
import rTime from 'dayjs/plugin/relativeTime';

// 4. 加载中文语言包
dayjs.locale('zh-cn');

// 5.加载相对时间插件
dayjs.extend(rTime);

/**
 * 定义过滤器
 */
export function relativeTime(val) {
	return dayjs().to(dayjs(val));
}