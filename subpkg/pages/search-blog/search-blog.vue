<template>
	<view class="search-blog-container">
		<!-- search模块 -->
		<view class="search-bar-box">
			<my-search
				:isShowInput="true"
				:placeholderText="defaultText"
				v-model="searchVal"
				:config="{
					backgroundColor: '#f1f0f3'
				}"
				@search="onSearchConfirm"
				@focus="onSearchFocus"
				@blur="onSearchBlur"
				@clear="onSearchClear"
				@cancel="onSearchCancel"
			></my-search>
		</view>
		<!-- 热搜列表 -->
		<view class="seach-hot-list-box card" v-if="showType === HOT_LIST"><seach-hot-list @onSearch="onSearchConfirm"></seach-hot-list></view>
		<!-- 搜索历史 -->
		<view class="search-history-box" v-else-if="showType === SEARCH_HISTORY"><search-history @onSearch="onSearchConfirm"></search-history></view>
		<!-- 搜索结果 -->
		<view class="search-result-list-box" v-else>
			<!-- 1.给mescroll-body的组件添加：ref="mescrollItem" mescrollItem是固定的不可变化的  -->
			<search-result-list ref="mescrollItem" :queryStr="searchVal"></search-result-list>
		</view>
	</view>
</template>

<script>
// 2. 引入mescroll-comp.js
import MescrollCompMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-comp.js';
import { getDefaultText } from '@/api/search.js';
import { mapMutations } from 'vuex';
// 热搜列表
const HOT_LIST = '0';
// 热搜历史
const SEARCH_HISTORY = '1';
// 热搜结果
const SEARCH_RESULT = '2';
export default {
	// 3. 注册 mixins
	mixins: [MescrollCompMixin],
	data() {
		return {
			// 输入框中的内容。从子组件传过来的值
			searchVal: '',
			// 输入框中的默认值
			defaultText: '输入框中的默认值',
			HOT_LIST,
			SEARCH_HISTORY,
			SEARCH_RESULT,
			// 默认情况下 || 点击了输入框的取消按钮，显示【热搜列表】
			// 当searchBar获取焦点的时 || 点击输入框清空按钮时，显示【搜索历史】
			// 当用户点击热搜列表篇item || 用户点击搜索历史item || 用户按下搜索键，显示【搜索结果】
			showType: HOT_LIST
		};
	},
	created() {
		this.loadDefaultText();
	},
	methods: {
		...mapMutations('search', ['addSearchData', 'removeAllSearchData']),
		onSearchConfirm(val) {
			// 用户未输入文本，直接搜索时，使用【推荐搜索文本】
			this.searchVal = val ? val : this.defaultText;
			// 保存历史搜索数据
			this.addSearchData(this.searchVal);
			if (this.searchVal) {
				this.showType = SEARCH_RESULT;
			}
		},
		/**
		 * 获取到焦点
		 */
		onSearchFocus(val) {
			this.showType = SEARCH_HISTORY;
		},
		onSearchBlur() {
			console.log('失去焦点');
			console.log(this.searchVal);
		},
		onSearchClear() {
			this.showType = SEARCH_HISTORY;
		},
		onSearchCancel() {
			this.showType = HOT_LIST;
		},
		/**
		 * 获取推荐搜索文本
		 */
		async loadDefaultText() {
			const { data: res } = await getDefaultText();
			this.defaultText = res.defaultText;
			console.log(this.defaultText);
		}
		// /**
		//  * 保存搜索历史数据
		//  */
		// saveSearchData() {
		// 	// 1.如果当前的搜索内容已存在,则原有的搜索内容需要被展示到搜索历史的头部，而不是新增一条搜索内容
		// 	// 2.如果当前的搜索内容不存在,则新的搜索内容会被展示在搜索历史的头部
		// 	const index = this.searchData.findIndex(item => item === this.searchVal);
		// 	if (index !== -1) {
		// 		this.searchData.splice(index, 1);
		// 	}
		// 	this.searchData.unshift(this.searchVal);
		// },
		// onRemoveAllSearchData() {
		// 	this.searchData = [];
		// },
		// onRemoveSearchData(index) {
		// 	this.searchData.splice(index, 1);
		// }
	}
};
</script>

<style lang="scss" scoped>
.search-blog-container {
	.search-bar-box {
		background-color: $uni-bg-color;
		padding: $uni-spacing-row-sm;
		position: sticky;
		top: 0px;
		z-index: 9;
	}
}
</style>
