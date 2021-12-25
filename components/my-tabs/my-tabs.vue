<template>
	<!-- 
		1. 可以在父组件中定制样式
		2. 可以在父组件中指定数据 
		3. 可以在父组件中选中项
	-->
	<view class="tab-container">
		<view class="tab-box">
			<scroll-view id="_scroll" scroll-x class="scroll-view" scroll-with-animation :scroll-left="scrollLeft">
				<view class="scroll-content">
					<view class="tab-item-box">
						<block v-for="(item, index) in tabData" :key="index">
							<view
								:style="{
									color: activeIndex === index ? defaultConfig.activeTextColor : defaultConfig.textColor
								}"
								:id="'_tab_' + index"
								class="tab-item"
								:class="{ 'tab-item-active': activeIndex === index }"
								@click="onTabClick(index)"
							>
								{{ item.label || item }}
							</view>
						</block>
					</view>
					<view
						class="underLine"
						:style="{
							transform: 'translateX(' + slider.left + 'px)',
							width: defaultConfig.underLineWidth + 'px',
							height: defaultConfig.underLineHeight + 'px',
							backgroundColor: defaultConfig.underLineColor
						}"
					></view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'my-tabs',
	data() {
		return {
			// 内部维护的数据对象,为每个item单独未付一个slider的滑块对象
			tabList: [],
			// 当前激活项的index
			activeIndex: -1,
			// 滑块距离左侧的距离
			slider: {
				left: 0
			},
			// scrollView 的横向滚动条
			scrollLeft: 0,
			// 默认配置
			defaultConfig: {
				// 默认的字体颜色
				textColor: '#333333',
				// 高亮的字体颜色
				activeTextColor: '#f94d2a',
				// 下划线的宽度
				underLineWidth: 24,
				// 下划线的高度
				underLineHeight: 2,
				// 下划线的颜色
				underLineColor: '#f94d2a'
			}
		};
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
	},
	// 监听器
	watch: {
		// 监听config
		config: {
			handler(val) {
				this.defaultConfig = { ...this.defaultConfig, ...val };
			},
			immediate: true
		},
		// 监听激活项的变化
		defaultIndex: {
			// 最新值val
			handler(val) {
				this.activeIndex = val;
			},
			// 当前的handler回调会在侦听开始之后被立即调用
			immediate: true
		},
		// 监听tabData的变化
		tabData: {
			handler(val) {
				this.tabList = val;
				// tabList数据就已经和tabData同步了
				// 维护tabList中的每个item，为DOM渲染完成之后
				setTimeout(() => {
					this.updateTabWidth();
				}, 0);
			}
		}
	},
	methods: {
		/**
		 * 更新tab的宽度
		 */
		updateTabWidth() {
			let data = this.tabList;
			if (data.length === 0) {
				return false;
			}
			// uniapp中拿到渲染之后的dom
			const query = uni.createSelectorQuery().in(this);
			// 循环数据源
			data.forEach((item, index) => {
				// 获取dom
				query
					.select('#_tab_' + index)
					.boundingClientRect(res => {
						item._slider = {
							left: res.left + (res.width - this.defaultConfig.underLineWidth) / 2 - 15
						};
						// 运算完成之后，计算一次滑块的位置
						if (data.length - 1 === index) {
							this.tabToIndex();
						}
					})
					.exec();
			});
		},
		onTabClick(index) {
			this.activeIndex = index;
			this.tabToIndex();
			// 发送一个通知，通知表示激活项发生变化了
			this.$emit('tabClick', index);
		},
		/**
		 * 根据当前的activeIndex
		 */
		tabToIndex() {
			// 获取到当前的activeIndex
			const index = this.activeIndex;
			this.slider = {
				left: this.tabList[this.activeIndex]._slider.left
			};
			// 控制scrollerView进行横向的滚动
			this.scrollLeft = this.activeIndex * this.defaultConfig.underLineWidth;
		}
	}
};
</script>

<style lang="scss" scoped>
.tab-container {
	padding-top: 15px;
	font-size: $uni-font-size-base;
	height: 45px;
	line-height: 45px;
	background-color: $uni-bg-color;
	.tab-box {
		width: 100%;
		height: 45px;
		display: flex;
		position: relative;
		.scroll-view {
			white-space: nowrap;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			.scroll-content {
				width: 100%;
				height: 100%;
				position: relative;

				.tab-item-box {
					height: 100%;
					.tab-item {
						height: 100%;
						display: inline-block;
						text-align: center;
						padding: 0 15px;
						position: relative;
						text-align: center;
						color: $uni-text-color;
						&-active {
							color: $uni-text-color-hot;
							font-weight: bold;
						}
					}
				}
				.underLine {
					height: 2px;
					width: 24px;
					background-color: $uni-text-color-hot;
					border-radius: 3px;
					transition: 0.5s;
					position: absolute;
					bottom: 0;
				}
			}
		}
	}
}
</style>
