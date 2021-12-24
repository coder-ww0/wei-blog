<template>
	<!-- 
		1. 可以在父组件中定制样式
		2. 可以在父组件中指定数据
		3. 可以在父组件中选中项
	-->
	<view class="tab-container">
		<view class="tab-box">
			<scroll-view id="_scroll" scroll-x class="scroll-view" scroll-with-animation>
				<view class="scroll-content">
					<view class="tab-item-box">
						<block v-for="(item, index) in tabData" :key="index">
							<view class="tab-item">{{ item.label || item}}</view>
						</block>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'my-tabs',
	data() {
		return {};
	},
	props: {
		// 可以在父组件中定制样式
		config: {
			type: Object,
			// default如果是复杂的数据类型,那么需要指定value为一个函数，通过返回值的形式执行默认值
			default: () => {
				return {};
			}
		},
		tabData: {
			type: Array,
			default: () => {
				return [];
			}
		},
		defaultIndex: {
			type: Number,
			default: 0
		}
	}
};
</script>

<style lang="scss"></style>
