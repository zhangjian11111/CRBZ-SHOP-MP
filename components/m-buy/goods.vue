<template>
	<div class="wrapper">
		<u-popup class="popup" v-model="buyMask" :height="setup.height" closeable :mode="setup.mode"
			:border-radius="setup.radius" @close="closeMask()">
			<!-- 商品 -->
			<view class="goods-box bottom">
				<view class="goods-header">
					<view class="goods-img">
						<u-image width="200rpx" border-radius="20" class="uimage" height="200rpx"
							:src="selectedSpecImg ? selectedSpecImg : goodsDetail.thumbnail"></u-image>
					</view>
					<view class="goods-skus">
						<!-- 有活动商品价格 -->
						<view class="goods-price"
							v-if="goodsDetail.promotionPrice && ((isGroup && buyType === 'PINTUAN') || !isGroup)">
							<span v-if="goodsDetail.promotionPrice && !pointDetail">
								￥
								<span class="goods-price-promotionShow goods-price-bigshow">{{
                  formatPrice(goodsDetail.promotionPrice)[0]
                }}</span>
								.{{ formatPrice(goodsDetail.promotionPrice)[1] }}
							</span>
							<span v-if="pointDetail.points">
								<span class="goods-price-promotionShow goods-price-bigshow">{{
                  pointDetail.points
                }}</span>
								积分
							</span>
							<div class="promotion-box">
								￥
								<span class="goods-price-bigshow">{{
                  formatPrice(goodsDetail.price)[0]
                }}</span>
								.{{ formatPrice(goodsDetail.price)[1] }}
							</div>
						</view>
						<!-- 正常商品的价格 -->
						<view v-else>

							<!-- 批发价格 -->
							<div class='price-row flex' v-if="wholesaleList.length">
								<div class='goods-price' v-for="(item,index) in wholesaleList" :key="index">
									<span>
										￥
										<span class="goods-price-bigshow">{{
									    formatPrice(item.price)[0]
									  }}</span>
										.{{ formatPrice(item.price)[1] }}
									</span>
									<span class='wholesale-item'>
										{{item.num}}{{goodsDetail.goodsUnit}}
									</span>
								</div>
							</div>
							<div class="goods-price" v-else>
								<span>
									￥
									<span class="goods-price-bigshow">{{
							    formatPrice(goodsDetail.price)[0]
							  }}</span>
									.{{ formatPrice(goodsDetail.price)[1] }}
								</span>
							</div>
						</view>
            <view class="goods-check-skus">
              已选❤️：
              <span class="goods-check-skus-name">
								-️{{ selectName }}-
								,️<span style="font-size: 18px;color: blue;">{{ num }} </span>份
							</span>
            </view>
            <view class="goods-check-skus">
              库存🚚：
              <span class="goods-check-skus-name">
								<span>🎯{{ goodsDetail.quantity }}🎯</span>
							</span>
            </view>
					</view>
				</view>
				<!-- 商品信息 -->
				<scroll-view class="goods-skus-box" :scroll-y="true">
					<!-- 规格 -->
					<view class="goods-skus-view" :key="specIndex" v-for="(spec, specIndex) in formatList">
						<view class="skus-view-list">
							<view class="view-class-title">{{ spec.name }}</view>

							<!-- 正常逻辑 循环出sku -->
							<view v-if="!parentOrder" :class="{ active: spec_val.value == currentSelceted[specIndex] }"
								class="skus-view-item" v-for="(spec_val, spec_index) in spec.values" :key="spec_index"
								@click="handleClickSpec(spec, specIndex, spec_val)">{{ spec_val.value }}
							</view>

							<!-- 拼团购买，仅筛选出当前拼团类型商品 -->
							<view v-if="parentOrder && spec_val.skuId == goodsDetail.id"
								:class="{ active: spec_val.value == currentSelceted[specIndex] }" class="skus-view-item"
								v-for="(spec_val, spec_index) in spec.values" :key="spec_index"
								@click="handleClickSpec(spec, specIndex, spec_val)">{{ spec_val.value }}
							</view>
						</view>
					</view>
					<!-- 数量 -->
					<view class="goods-skus-number flex flex-a-c flex-j-sb">
						<view class="view-class-title">数量</view>
            <u-number-box v-model="num" ></u-number-box>
					</view>
				</scroll-view>
				<!-- 按钮 -->
				<view class="btns">
					<view class="box-btn card" v-if="buyType != 'PINTUAN' && goodsDetail.goodsType != 'VIRTUAL_GOODS'"
						@click="addToCartOrBuy('cart')">加入购物车</view>
					<view class="box-btn buy" @click="addToCartOrBuy('buy')">立即购买</view>
				</view>
			</view>
		</u-popup>
	</div>
</template>
<script>
	import * as API_trade from "@/api/trade.js";
	import setup from "./popup";

	export default {
		data() {
			return {
				setup,
				num: 1,

				selectName: "", //选中商品的昵称
				selectSkuList: "", //选中商铺sku,
				selectedSpecImg: "", //选中的图片路径
				buyType: "", //用于存储促销，拼团等活动类型
				parentOrder: "", //父级拼团活动的数据 - 如果是团员则有数据
				formatList: [],
				currentSelceted: [],
				skuList: "",
				isClose: false, //是否可以点击遮罩关闭

			};
		},
		props: {
			wholesaleList:{
				type: null,
				default: false,
			},
			buyMask: {
				type: Boolean,
				default: false,
			},
			isGroup: {
				type: Boolean,
				default: false,
			},
			goodsDetail: {
				default: "",
				type: null,
			},
			selectedSku: {
				default: "",
				type: null,
			},
			goodsSpec: {
				default: "",
				type: null,
			},
			addr: {
				default: "",
				type: null,
			},
			pointDetail: {
				default: "",
				type: null,
			},
		},
		computed: {
			wholesalePrice(key){
				return this.wholesaleList.length ? this.wholesaleList.map(item=>{ return item.price }) :[]
			},
			wholesaleNum(key){
				return this.wholesaleList.length ? this.wholesaleList.map(item=>{ return item.num }) :[]
			}
		},
		watch: {
			num(val){
				if(val){
					if(val > this.goodsDetail.quantity){
						this.val = this.goodsDetail.quantity
					}
				}
			},
			buyType: {
				handler(val) {
					if (val) {
						this.buyType = val;
					}
				},
				immediate: true,
			},
			selectSkuList: {
				handler(val, oldval) {
					this.$emit("changed", val);
				},
				deep: true,
			},
		},

		methods: {
			// 格式化金钱  1999 --> [1999,00]
			formatPrice(val) {
				if (typeof val == "undefined") {
					return val;
				}
				return Number(val).toFixed(2).split(".");
			},

			closeMask() {
				this.$emit("closeBuy", false);
			},

			/**点击规格 */
			handleClickSpec(val, index, specValue) {
				this.currentSelceted[index] = specValue.value;
				let selectedSkuId = this.goodsSpec.find((i) => {
					let matched = true;
					let specValues = i.specValues.filter((j) => j.specName !== "images");
					for (let n = 0; n < specValues.length; n++) {
						if (specValues[n].specValue !== this.currentSelceted[n]) {
							matched = false;
							return;
						}
					}
					if (matched) {
						return i;
					}
				});
				if (selectedSkuId?.skuId) {
					this.$set(this.currentSelceted, index, specValue.value);
					this.selectSkuList = {
						spec: {
							specName: val.name,
							specValue: specValue.value,
						},
						data: this.goodsDetail,
					};
					this.selectName = specValue.value;

					this.$emit("handleClickSku", {
						skuId: selectedSkuId.skuId,
						goodsId: this.goodsDetail.goodsId,
					});
				} else {
					uni.showToast({
						title: "暂无该商品!",
						duration: 2000,
						icon: "none",
					});
				}
			},

			/**
			 * 直接购买
			 */
			buy(data) {
				API_trade.addToCart(data).then((res) => {
					if (res.data.success) {
						uni.navigateTo({
							url: `/pages/order/fillorder?way=${
              data.cartType
            }&addr=${""}&parentOrder=${encodeURIComponent(
              JSON.stringify(this.parentOrder)
            )}`,
						});
					}
				});
			},

			/**
			 * 添加到购物车或购买
			 */
			addToCartOrBuy(val) {
				if (!this.selectSkuList) {
					uni.showToast({
						title: "请选择规格商品",
						icon: "none",
					});
					return;
				}
				let data = {
					skuId: this.goodsDetail.id,
					num: this.num,
				};

				if (val == "cart") {
					API_trade.addToCart(data).then((res) => {
						if (res.data.code == 200) {
							uni.showToast({
								title: "商品已添加到购物车",
								icon: "none",
							});

							this.$emit("queryCart");
							this.closeMask();
						}
					});
				} else {
					// 判断是否拼团商品
					if (this.buyType) {
						data.cartType = "PINTUAN";
					} else if (this.goodsDetail.goodsType == "VIRTUAL_GOODS") {
						data.cartType = "VIRTUAL";
					} else {
						data.cartType = "BUY_NOW";
					}

					API_trade.addToCart(data).then((res) => {
						if (res.data.code == 200) {
							uni.navigateTo({
								url: `/pages/order/fillorder?way=${data.cartType}&addr=${
                this.addr.id || ""
              }&parentOrder=${encodeURIComponent(JSON.stringify(this.parentOrder))}`,
							});
						}
					});
				}
			},
			formatSku(list) {
				// 格式化数据
				let arr = [{}];

				if (!Array.isArray(list)) {
					return false
				}
				list.forEach((item, index) => {
					item.specValues.forEach((spec, specIndex) => {
						let name = spec.specName;
						let values = {
							value: spec.specValue,
							quantity: item.quantity,
							skuId: item.skuId,
						};
						if (name === "images") {
							return;
						}

						arr.forEach((arrItem, arrIndex) => {
							if (
								arrItem.name == name &&
								arrItem.values &&
								!arrItem.values.find((i) => {
									return i.value === values.value;
								})
							) {
								arrItem.values.push(values);
							}

							let keys = arr.map((key) => {
								return key.name;
							});
							if (!keys.includes(name)) {
								arr.push({
									name: name,
									values: [values],
								});
							}
						});
					});
				});

				arr.shift();
				this.formatList = arr;

				list.forEach((item) => {
					// 默认选中
					if (item.skuId === this.goodsDetail.id) {
						item.specValues
							.filter((i) => i.specName !== "images")
							.forEach((value, _index) => {
								this.currentSelceted[_index] = value.specValue;

								this.selectName = value.specValue;

								this.selectSkuList = {
									spec: value,
									data: this.goodsDetail,
								};
							});
					}
				});

				this.skuList = list;
				// console.log(" this.skuList", this.skuList)
			},
		},

		mounted() {
			this.formatSku(this.goodsSpec);
		},
	};
</script>
<style lang="scss" scoped>
	@import "./popup.scss";
	.price-row{
		text-align: center;

	}
	.buy {
		background-image: linear-gradient(135deg, #ffba0d, #ffc30d 69%, #ffcf0d);
		box-shadow: 0 2px 6px 0 rgba(255, 65, 66, 0.2);
	}

	.card {
		background-image: linear-gradient(135deg, #f2140c, #f2270c 70%, #f24d0c);
		box-shadow: 0 2px 6px 0 rgba(255, 65, 66, 0.2);
	}

	/deep/.u-icon-plus,
	.u-icon-minus,
	.u-icon-disabled {
		height: 30rpx !important;
		background: #fff !important;
	}

	.goods-skus-number {
		justify-content: space-between;
		display: flex;

		>.view-class-title{
			flex: 8;
		}
		>.view-class-input{
			flex:1
		}
	}

	/deep/ .uni-scroll-view {
		overflow: hidden !important;
	}

	.active {
		background: $price-light-color !important;
		border: 2rpx solid $price-color;
		font-weight: bold;
		color: $price-color !important;
		box-sizing: border-box;
	}

	.goods-skus-box {
		overflow-y: auto;
		height: 610rpx;
		// #ifdef MP-WEIXIN
		height: 570rpx;
		// #endif
		margin-bottom: 10rpx;
	}

	.goods-skus-view {
		overflow: hidden;

		.skus-view-list {
			>.skus-view-item {
				flex: 1;
				padding: 0 36rpx;

				overflow: hidden;
				height: 60rpx;
				line-height: 60rpx;
				float: left;
				text-align: center;
				margin-left: 24rpx;
				margin-bottom: 20rpx;
				font-size: 22rpx;
				color: #262626;
				background: #f2f2f2;
				border-radius: 30rpx;
			}
		}
	}
	.wholesale-item{
		color: #999 !important;
		font-size: 24rpx;
		margin:0 20rpx;
		display: flex;
		justify-content: center;
	}

	.goods-header {
		height: 200rpx;
		display: flex;
		align-items: center;
		margin-bottom: 36rpx;
	}

	.goods-box {
		padding: 50rpx 36rpx 0 36rpx;
	}

	.goods-skus {
		padding: 0 20rpx;
	}

	.goods-price {
		color: $price-color;
		line-height: 80rpx;
		margin-right: 20rpx;
		>* {
			color: $price-color;
			line-height: 80rpx;

		}
	}

	.promotion-box {
		line-height: 1;
		display: flex;
		align-items: center;
		text-decoration: line-through;
		color: #999;
		margin-left: 10rpx;

		/deep/ span {
			font-size: 30rpx;
		}
	}

	.promotion {
		font-size: 30rpx;
	}

	.goods-price-promotionShow {
		font-size: 48rpx;
	}

	.goods-check-skus {
		font-size: 24rpx;
		color: #999;

		>.goods-check-skus-name {
			margin-left: 4rpx;
		}

		>span {
			color: #333;
		}
	}
</style>
