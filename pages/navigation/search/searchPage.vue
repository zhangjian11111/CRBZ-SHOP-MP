<template>
	<view class="content">
		<u-navbar :background="navObj" :is-back="false">
			<mSearch
				ref="mSearch"
				class="mSearch-input-box"
				@clickLeft="back"
				:mode="2"
				:placeholder="defaultKeyword"
				@search="doSearch(false)"
				@confirm="doSearch(false)"
				@SwitchType="doSearchSwitch()"
				v-model="keyword"
				:isFocusVal="!isShowSeachGoods"
			></mSearch>
		</u-navbar>

		<view class="search-keyword" v-if="!isShowSeachGoods">
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<block v-for="(row, index) in keywordList" :key="index">
					<view class="keyword-entry" hover-class="keyword-entry-tap">
						<view class="keyword-text" @tap.stop="doSearch(keywordList[index].words)"><rich-text :nodes="row.words"></rich-text></view>
					</view>
				</block>
			</scroll-view>
			<div class="keyword-box" v-show="!isShowKeywordList">
				<view class="keyword-block add1">
					<view class="keyword-list-header"><view class="u-tips">热门搜索</view></view>
					<view class="keyword keywordBox">
						<view class="wes" v-for="(keyword, index) in hotKeywordList" @tap="doSearch(keyword)" :key="index">{{ keyword }}</view>
					</view>
				</view>
				<view class="keyword-block" v-if="oldKeywordList.length > 0">
					<view class="keyword-list-header"><view class="u-tips">搜索历史</view></view>
					<div class="oldKeyList">
						<div class="oldKeyItem" v-if="keyword" v-for="(keyword, index) in oldKeywordList" :key="index" @click="doSearch(keyword)">
							<span>{{ keyword }}</span>
						</div>

						<div @click="showMore" v-if="oldKeywordIndex > loadIndex" class="oldKeyItem">展示更多</div>
					</div>
				</view>

				<div class="clear mp-iphonex-bottom" @tap="oldDelete">清空搜索历史</div>
			</div>
		</view>
		<!-- 搜索 -->
		<view class="goods-content" v-if="isShowSeachGoods">
			<view class="navbar">
				<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合排序</view>
				<view class="nav-item" :class="{ current: filterIndex === 3 }" @click="tabClick(3, 'buyCount')">
					<text>销量</text>
					<view class="p-box">
						<view class="index-nav-arrow">
							<image class="img" src="/static/index/arrow-up-1.png" v-if="params.sort === 'buyCount' && params.order === 'asc'" mode="aspectFit"></image>
							<image class="img" src="/static/index/arrow-up.png" v-else mode="aspectFit"></image>
						</view>
						<view class="index-nav-arrow">
							<image class="img" src="/static/index/arrow-down.png" v-if="params.sort === 'buyCount' && params.order === 'desc'" mode="aspectFit"></image>
							<image class="img" src="/static/index/arrow-down-1.png" v-else mode="aspectFit"></image>
						</view>
					</view>
				</view>
				<view class="nav-item" :class="{ current: filterIndex === 4 }" @click="tabClick(4, 'price')">
					<text>价格</text>
					<view class="p-box">
						<view class="index-nav-arrow">
							<image class="img" src="/static/index/arrow-up-1.png" v-if="params.sort === 'price' && params.order === 'asc'" mode="aspectFit"></image>
							<image class="img" src="/static/index/arrow-up.png" v-else mode="aspectFit"></image>
						</view>
						<view class="index-nav-arrow">
							<image class="img" src="/static/index/arrow-down.png" v-if="params.sort === 'price' && params.order === 'desc'" mode="aspectFit"></image>
							<image class="img" src="/static/index/arrow-down-1.png" v-else mode="aspectFit"></image>
						</view>
					</view>
				</view>
				<view class="nav-item" @click="sortGoods">筛选</view>
			</view>
			<!-- 一行一个商品展示 -->
			<div v-if="isSWitch">
				<scroll-view
					:style="{ height: goodsHeight }"
					enableBackToTop="true"
					lower-threshold="250"
					@scrolltolower="loadmore()"
					scroll-with-animation
					scroll-y
					class="scoll-page"
				>
					<goodsList :res="goodsList" type="oneColumns" :keyword="keyword" />
					<uni-load-more :status="loadingType" @loadmore="loadmore()"></uni-load-more>
				</scroll-view>
			</div>
			<!-- 一行两个商品展示 -->
			<div v-if="!isSWitch && !(goodsList == [] || goodsList == '' || goodsList == null)">
				<scroll-view
					:style="{ height: goodsHeight }"
					scroll-anchoring
					enableBackToTop="true"
					@scrolltolower="loadmore()"
					scroll-with-animation
					scroll-y
					lower-threshold="250"
					class="scoll-page"
				>
					<goodsList :res="goodsList" :keyword="keyword" />
					<uni-load-more :status="loadingType"></uni-load-more>
				</scroll-view>
			</div>
		</view>

		<u-popup border-radius="20" mode="right" width="90%" v-model="sortPopup">
			<view class="status_bar"></view>
			<view class="sort-box  ">
				<view class="sort-list">
					<view class="sort-item">
						<view class="sort-title">品牌</view>
						<view class="flex" v-if="sortData.brands">
							<view class="sort-brand-item" :key="brandsIndex" v-for="(brand, brandsIndex) in sortData.brands" @click="handleSort(brand, brandsIndex, 'brand')">
								<view
									class="sort-radius"
									:class="{
										'sort-active': brand.__selected
									}"
								>
									{{ brand.name }}
								</view>
							</view>
						</view>
						<!-- <u-empty v-else text="暂无品牌" mode="list"></u-empty> -->
					</view>
					<view class="sort-item">
						<view class="sort-title">全部分类</view>
						<view class="flex" style="flex-wrap: wrap;" v-if="sortData.categories">
							<view
								class="sort-brand-item"
								:key="categoriesIndex"
								v-for="(categoryId, categoriesIndex) in sortData.categories"
								@click="handleSort(categoryId, categoriesIndex, 'categoryId')"
							>
								<view
									class="sort-radius"
									:class="{
										'sort-active': categoryId.__selected
									}"
								>
									{{ categoryId.name }}
								</view>
							</view>
						</view>
						<!-- <u-empty v-else text="暂无分类" mode="list"></u-empty> -->
					</view>
				</view>
				<view class="sort-list">
					<view class="sort-item">
						<view class="sort-title">价格区间</view>
						<view style="display:flex;  margin-top:20rpx;    align-items: center;">
							<view class="sort-brand-item uinput">
								<view class="sort-radius"><u-input v-model="minPrice" type="number" placeholder="最低价" input-align="center" /></view>
							</view>
							<view>-</view>
							<view class="sort-brand-item uinput">
								<view class="sort-radius"><u-input v-model="maxPrice" type="number" placeholder="最高价" input-align="center" /></view>
							</view>
						</view>
					</view>
				</view>

				<view class="sort-list" v-if="sortData.paramOptions">
					<view class="sort-item" :key="paramIndex" v-for="(param, paramIndex) in sortData.paramOptions">
						<view class="sort-title">{{ param.key }}</view>
						<view class="flex" style="flex-warp:warp" v-if="param.values">
							<view class="sort-brand-item" :key="i" v-for="(value, i) in param.values" @click="handleSort(value, i, 'prop', param)">
								<view
									class="sort-radius"
									:class="{
										'sort-active': value.__selected
									}"
								>
									{{ value.title }}
								</view>
							</view>
						</view>
					</view>
				</view>

				<div class="null-view"></div>
				<view class="sort-btn mp-iphonex-bottom">
					<view class="sort-btn-repick" @click="repick">重置</view>
					<view class="sort-btn-confim" @click="sortConfim">确定</view>
				</view>
			</view>
		</u-popup>
		<div class="empty" v-if="empty">
			<view><image style="width: 320rpx; height: 240rpx" src="/static/nodata.png"></image></view>
			<view>
				<p>没有找到相关的商品信息</p>
				<p>请换一个关键词试试吧</p>
			</view>
		</div>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
import { getGoodsList, getGoodsRelated } from '@/api/goods.js';
import goodsList from '@/components/m-goods-list/list.vue';
import { getHotKeywords } from '@/api/home.js';
import mSearch from '@/components/m-search-revision/m-search-revision.vue';
import storage from '@/utils/storage';
export default {
	data() {
		return {
			empty: false,
			scrollTop: 0,
			loadIndex: 10,
			oldKeywordIndex: 0,
			selectedWay: {
				brand: [],
				categoryId: [],
				prop: []
			},

			sortPopup: false, //筛选的开关
			navObj: {
				background: '#fff'
			},
			typeSortData: {
				type: '',
				index: ''
			},
			goodsHeight: '',
			defaultKeyword: '',
			keyword: '',
			oldKeywordList: [],
			hotKeywordList: [],
			keywordList: [],
			goodsList: [],

			cateMaskState: 0, //分类面板展开状态
			loadingType: 'more', //加载更多状态
			filterIndex: 0,
			cateId: 0, //已选三级分类id
			priceOrder: 0, //1 价格从低到高 2价格从高到低
			cateList: [],
			isShowSeachGoods: false,
			isShowKeywordList: false,
			sortData: '',
			isSWitch: false,

			params: {
				pageNumber: 1,
				pageSize: 10,
				// sort: 'grade_asc',

				keyword: ''
			},
			minPrice: '',
			maxPrice: '',
			sortParams: {
				pageNumber: 1,
				pageSize: 10,

				// price: "", //价格,示例值(10_30)
				// prop: "", //属性:参数名_参数值@参数名_参数值,示例值(屏幕类型_LED@屏幕尺寸_15英寸)
				// brandId:"", //品牌,可以多选 品牌Id@品牌Id@品牌Id
				categoryId: ''
			},

			routerVal: ''
		};
	},

	onPageScroll(e) {
		console.log(e);
		this.scrollTop = e.scrollTop;
	},
	onLoad(val) {
		this.init();
		//  this.initSortGoods();
		// 接收分类的数据

		this.routerVal = val;

		// 有值
		if (this.routerVal.category) {
			this.params.categoryId = this.routerVal.category;
			this.sortParams.categoryId = this.routerVal.category;
			this.isShowSeachGoods = true;
			this.$nextTick(() => {
				this.$refs.mSearch.isShowSeachGoods = true;
			});
		}
		if (this.routerVal.keyword) {
			this.params.keyword = this.routerVal.keyword;
			this.isShowSeachGoods = true;
		}
		if (this.routerVal.storeId) {
			this.params.storeId = this.routerVal.storeId;
			this.isShowSeachGoods = true;
		}
		if (this.routerVal.promotionType) {
			this.params.promotionType = this.routerVal.promotionType;
			this.isShowSeachGoods = true;
		}
		if (this.routerVal.promotionsId) {
			this.params.promotionsId = this.routerVal.promotionsId;
			this.isShowSeachGoods = true;
		}
		this.loadData();
	},
	components: {
		mSearch,
		goodsList
	},
	watch: {
		/**
		 * 将搜索的字和热词进行匹配,如果为热词则不改商品搜索关键字
		 */
		keyword(val) {
			if (val) {
				if (val) {
					this.defaultKeyword = val;
				}
			} else {
				this.defaultKeyword = '请输入搜索商品';
			}
		},
		sortPopup(val) {
			if (val) {
				this.selectedWay = { brand: [], categoryId: [], prop: [] };
			}
		}
	},

	onReachBottom() {
		this.params.pageNumber++;
		this.loadData();
	},

	mounted() {
		const { windowWidth, windowHeight } = uni.getSystemInfoSync();

		let topHeight = 0;
		let navHeight = 0;

		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数

				let top = uni.createSelectorQuery().select('.u-navbar');
				top.boundingClientRect(function(data) {
					if (data && data.height) {
						//data - 各种参数
						topHeight = data.height; // 获取元素宽度
					}
				}).exec();
				let nav = uni.createSelectorQuery().select('.navbar');
				nav.boundingClientRect(function(data) {
					if (data && data.height) {
						//data - 各种参数
						navHeight = data.height; // 获取元素宽度
					}
				}).exec();
			}
		});
		this.goodsHeight = windowHeight - navHeight - topHeight;
		// #ifdef APP-PLUS
		this.goodsHeight = this.goodsHeight - 100;
		// #endif
		this.goodsHeight += 'px';
	},

	methods: {
		// 数据去重一下 只显示一次 减免 劵 什么的
		getPromotion(item) {
			if (item.promotionMap) {
				let array = [];
				Object.keys(item.promotionMap).forEach(child => {
					if (!array.includes(child.split('-')[0])) {
						array.push(child.split('-')[0]);
					}
				});

				return array;
			}
		},
		// 展示更多数据
		showMore() {
			this.loadOldKeyword(this.oldKeywordIndex);
		},

		// 点击确定进行筛选
		sortConfim() {
			// 处理品牌（多选
			if (!this.params.brandId) {
				this.params.brandId = [];
			} else {
				this.params.brandId = [this.params.brandId];
			}

			// 如果选中品牌 赋值
			this.selectedWay['brand'].forEach(item => {
				if (item.__selected) {
					this.params.brandId.push(item.value);
				}
			});

			this.params.brandId = this.params.brandId.join('@') || '';

			// 处理分类 (单选)
			if (this.selectedWay['categoryId'][0]) {
				this.params.categoryId = this.selectedWay['categoryId'][0].value;
			}
			if (!this.params.prop) {
				this.params.prop = [];
			} else {
				this.params.prop = [this.params.prop];
			}

			this.selectedWay['prop'].forEach(item => {
				if (item.__selected) {
					this.params.prop.push(`${item.parent}_${item.title}`);
				}
			});
			this.params.prop = this.params.prop.join('@');
			// 处理价格
			if (this.minPrice || this.maxPrice) {
				this.params.price = `${this.minPrice}_${this.maxPrice}`;
			} else {
				this.params.price = 0;
			}

			this.goodsList = [];

			this.params.pageNumber = 1;
			this.sortParams = this.params;

			this.loadData();
			this.sortPopup = false;
		},

		// 重置
		repick() {
			this.sortParams = {
				pageNumber: 1,
				pageSize: 10,
				categoryId: this.routerVal.category || ''
			};
			this.sortPopup = false;
			this.initSortGoods();
			this.minPrice = '';
			this.maxPrice = '';
			this.params = {
				pageNumber: 1,
				pageSize: 10,
				categoryId: this.routerVal.category || ''
			};
			this.goodsList = [];
			this.loadData();
		},

		// 点击筛选的内容
		handleSort(val, index, type, parent) {
			if (type == 'prop') {
				val.parent = parent.key;
			}
			this.selectedWay[type].push(val);
			if (type == 'categoryId') {
				this.sortData.categories.forEach(item => {
					item.__selected = false;
				});
				val.__selected = true;
			} else {
				val.__selected ? (val.__selected = false) : (val.__selected = true);
			}
		},

		init() {
			// 加载搜索记录
			this.loadOldKeyword(this.loadIndex);
			// 加载热词
			this.loadHotKeyword();
		},
		blur() {
			uni.hideKeyboard();
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		// 跳转到商品详情
		navigateToDetailPage(item) {
			uni.navigateTo({
				url: `/pages/product/goods?id=${item.id}&goodsId=${item.goodsId}`
			});
		},
		// 跳转地址
		navigateToStoreDetailPage(item) {
			uni.navigateTo({
				url: `/pages/product/shopPage?id=${item.storeId}`
			});
		},
		loadmore() {
			this.params.pageNumber++;
			this.loadData();
		},
		initSortGoods() {
			getGoodsRelated(this.sortParams).then(res => {
				if (res.data.success) {
					for (let item of Object.keys(res.data.result)) {
						res.data.result[item].forEach(child => {
							child.__selected = false;

							// 循环出和品牌分类一样的数据格式
							if (child.values) {
								child.values = child.values.map(item => ({
									title: item,
									__selected: false
								}));
							}
						});
					}
					this.sortData = res.data.result;
				}
			});
		},

		// 筛选商品
		sortGoods() {
			this.sortPopup = true;
		},

		tabClick(index, type) {
			this.params.pageNumber = 1;
			this.params.pageSize = 10;
			// this.params.order = "desc";
			if (this.params.sort == type) {
				this.params.order == 'asc' ? (this.params.order = 'desc') : (this.params.order = 'asc');

				this.$set(this.params, 'sort', type);
			} else {
				this.params.order = 'desc';
				this.$set(this.params, 'sort', type);
			}

			if (index == 0) {
				this.params.sort = 'releaseTime';
				this.params.order = 'desc';
			}

			this.filterIndex = index;

			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});
			this.loadData('refresh', 1);
			uni.showLoading({
				title: '正在加载'
			});
		},
		//加载默认搜索关键字
		loadDefaultKeyword() {
			/**
			 * 定义默认搜索关键字会根据当前热门搜索来进行显示
			 * 如果当前热门搜索没有的话，则会显示默认关键字
			 */
			if (this.hotKeywordList.length != 0) {
				//
				this.defaultKeyword = this.hotKeywordList[0];
			} else {
				this.defaultKeyword = '请输入搜索商品';
			}
		},
		//加载历史搜索,自动读取本地Storage
		loadOldKeyword(index) {
			this.oldKeywordList = [];
			uni.getStorage({
				key: 'OldKeys',
				success: res => {
					var OldKeys = JSON.parse(res.data);
					this.oldKeywordIndex = OldKeys.length;
					for (let i = 0; i < index; i++) {
						this.oldKeywordList.push(OldKeys[i]);
					}
				}
			});
		},

		/**
		 * 加载热门搜索
		 * 1.5分钟之后更新缓存
		 * 2.如果有缓存热门关键字则去请求缓存
		 */
		async loadHotKeyword() {
			this.hotKeywordList = [];
			if (!storage.getHotWords().time || storage.getHotWords().time <= new Date().getTime() / 1000) {
				// 没有缓存或者第一次进入请求接口保存缓存
				let res = await getHotKeywords(10);
				let keywords = res.data.result;

				keywords.forEach(item => {
					this.hotKeywordList.push(item);
				});

				let hotData = {
					time: new Date().getTime() / 1000 + 30 * 5,
					keywords: keywords
				};
				storage.setHotWords(hotData);
			} else {
				let keywords = storage.getHotWords().keywords;

				keywords.forEach(item => {
					this.hotKeywordList.push(item);
				});
			}
			this.loadDefaultKeyword();
		},
		//加载商品 ，带下拉刷新和上滑加载
		async loadData(type, loading) {
			this.loadingType = 'loading';
			if (type == 'refresh') {
				this.goodsList = [];
			}
			//没有更多直接返回 #TODO
			let goodsList = await getGoodsList(this.params);
			if (goodsList.data.result.records.length < 10) {
				this.loadingType = 'noMore';
				this.empty = true;
			} else {
				this.empty = false;
			}
			this.goodsList.push(...goodsList.data.result.records);
			
			this.initSortGoods();
			 if (this.$store.state.isShowToast){ uni.hideLoading() };
		},

		//高亮关键字
		drawCorrelativeKeyword(keywords, keyword) {
			var len = keywords.length,
				keywordArr = [];
			for (var i = 0; i < len; i++) {
				var row = keywords[i];
				//定义高亮#9f9f9f
				var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + '</span>');
				html = '<div>' + html + '</div>';
				var tmpObj = {
					keyword: row[0],
					htmlStr: html
				};
				keywordArr.push(tmpObj);
			}
			return keywordArr;
		},
		//顶置关键字
		setKeyword(index) {
			this.keyword = this.keywordList[index].keyword;
		},
		//清除历史搜索
		oldDelete() {
			uni.showModal({
				content: '确定清除历史搜索记录？',
				success: res => {
					if (res.confirm) {
						this.oldKeywordList = [];
						uni.removeStorage({
							key: 'OldKeys'
						});
					}
				}
			});
		},

		// 样式修改布局
		doSearchSwitch() {
			this.isSWitch = !this.isSWitch;
			this.isShowSeachGoods = true;
			this.params.pageNumber = 1;
			this.params.pageSize = 10;
			this.loadData('refresh', 1);
		},

		/**
		 * 执行搜索
		 */
		doSearch(keyword) {
			uni.showLoading({
				title: '马上就好🤪'
			})
			//  用户自行搜索/热门搜索/搜索历史
			keyword = keyword === false ? this.keyword : keyword;

			if (!keyword) {
				/**
				 * 进行空搜索
				 * 第一次搜索如果没有关键词会将热门搜索中第一个热词进行判定
				 * 如果没有热词则会展示一个空词搜索
				 */
				keyword = (this.hotKeywordList.length && this.hotKeywordList[0]) || '';
			}
			this.defaultKeyword == '请输入搜索商品' ? (keyword = '') : '';
			
		
			keyword ? (this.keyword = keyword) : '';
			this.saveKeyword(keyword); //保存为历史
			this.isShowSeachGoods = true;
			this.$refs.mSearch.isShowSeachGoods = true;
			this.$refs.mSearch.inputVal = keyword;
			this.params.keyword = this.keyword;
			this.params.pageNumber = 1;
			this.$set(this.sortParams, 'keyword', keyword);
			this.loadData('refresh', 1);
		},
		//保存关键字到历史记录
		saveKeyword(keyword) {
			if (!keyword) return false;
			uni.getStorage({
				key: 'OldKeys',
				success: res => {
					uni.hideLoading();
					var OldKeys = JSON.parse(res.data);
					var findIndex = OldKeys.indexOf(keyword);
					if (findIndex == -1) {
						OldKeys.unshift(keyword);
					} else {
						OldKeys.splice(findIndex, 1);
						OldKeys.unshift(keyword);
					}
					//最多10个纪录
					OldKeys.length > 10 && OldKeys.pop();

					uni.setStorage({
						key: 'OldKeys',
						data: JSON.stringify(OldKeys)
					});
					this.oldKeywordList = OldKeys; //更新历史搜索
				},
				fail: e => {
					var OldKeys = [keyword];
					uni.setStorage({
						key: 'OldKeys',
						data: JSON.stringify(OldKeys)
					});
					this.oldKeywordList = OldKeys; //更新历史搜索
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import './search.scss';
</style>
