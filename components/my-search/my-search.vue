<template>
	<!--
		1. 具备输入框的样式
		2. 不可输入
		3. placeholder 内容可以在父组件中定义
	-->

	<view class="my-search-container">
		<uni-search-bar
			class="my-seach-bar"
			:radius="100"
			:bgColor="config.backgroundColor"
			:placeholder="placeholderText"
			:value="value"
			v-if="isShowInput"
			@confirm="onSearch"
			@focus="onFocus"
			@blur="onBlur"
			@clear="onClear"
			@cancel="onCancel"
			@input="onInput"
		>
			<view slot="clearIcon" style="color: #999999">X</view>
			<!-- <uni-icons slot="clearIcon" type="clear" color="#999999" /> -->
		</uni-search-bar>
		<!-- 搜索按钮 -->
		<view
			class="my-search-box"
			v-else
			:style="{
				height: config.height + 'px',
				backgroundColor: config.backgroundColor,
				border: config.border
			}"
		>
			<image class="icon" :src="config.icon" />
			<!-- placeholder -->
			<text class="placeholder" :style="{color:config.textColor}">{{ placeholderText }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'my-search',
	data() {
		return {};
	},
	props: {
		value: {
			// 输入的内容，不适用v-model进行双向绑定，会将父组件传过来的值进行对应的修改
			type: String
		},
		placeholderText: {
			type: String,
			default: '搜索'
		},
		// 配置对象
		config: {
			type: Object,
			default: () => ({
				height: 36,
				backgroundColor: '#ffffff',
				icon: '/static/images/search.png',
				textColor: '#454545',
				border: '1px solid #c9c9c9'
			})
		},
		// 是否显示输入框
		isShowInput: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		/**
		 * 点击搜索按钮触发
		 */
		onSearch() {
			console.log('onSearch');
			console.log(this.value);
			this.$emit('search', this.value);
		},
		/**
		 * 输入框失去焦点时触发
		 */
		onBlur(val) {
			// console.log('输入框失去焦点时触发')
			this.$emit('blur', this.value);
		},
		/**
		 * 点击输入框中清空按钮
		 */
		onClear() {
			this.$emit('clear', this.value);
		},
		onCancel() {
			this.$emit('cancel', this.value);
		},
		/**
		 * 输入框获取焦点触发
		 */
		onFocus() {
			this.$emit('focus', this.value);
		},
		/**
		 * value发生改变时触发
		 */
		onInput(val) {
			// console.log('input:' + val)
			this.$emit('input', val);
		}
	}
};
</script>

<style lang="scss" scoped>
.my-search-container {
	display: flex;
	align-items: center;
	.my-seach-bar {
		width: 100%;
	}
	.my-search-box {
		height: 36px;
		width: 100%;
		background-color: $uni-bg-color;
		border-radius: 15px;
		border: 1px solid $uni-border-color;
		display: flex;
		align-items: center;
		padding: 0 $uni-spacing-row-base;

		.icon {
			width: $uni-img-size-sm;
			height: $uni-img-size-sm;
		}

		.placeholder {
			font-size: $uni-font-size-sm;
			margin-left: $uni-spacing-row-sm;
			color: $uni-text-color-grey;
		}
	}
}
</style>
