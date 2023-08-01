<template>
	<view class="cancelafter-V">
		<div class="uForm">
			<u-form>
				<view class="caVerification" @click="scan()">
					扫码核销订单
				</view>

				<u-form-item label="订单号" label-width="130">
					<u-input v-model="scanData[0]" placeholder="扫码获取订单号或者点击这里填写" />
				</u-form-item>
				
				<u-form-item label="核销码" label-width="130">
					<u-input v-model="scanData[1]" placeholder="扫码获取核销码或者点击这里填写核销码" />
				</u-form-item>


				<div class="saveBtn" @click="cav">立即核销✅</div>
			</u-form>


		</div>
	</view>
</template>
<script>
	import permission from "@/js_sdk/wa-permission/permission.js"; //权限工具类
	import storage from "@/utils/storage.js";
	import * as API_CAV from "@/api/order";

	export default {
		data() {
			return {
				// orderSn: "",
				scanData: [],
				storage,
				isIos: "",
			};
		},

		methods: {
			
			
			getUserAddress() {
			  // 如果没有商品选择地址的话 则选择 默认地址
			  API_Address.getAddressDefault().then((res) => {
			    if (res.data.result) {
			      res.data.result.consigneeAddressPath =
			        res.data.result.consigneeAddressPath.split(",");
			      this.address = res.data.result;
			    }
			  });
			},
			
			
			cav() {
				API_CAV.caVerification(this.scanData[0],this.scanData[1]).then((res) => {
					console.log("核销返回：：：",res)
					console.log("核销返回：：：",res.data.success)
					if (res.data.success){
						uni.showToast({
							title: "订单核销完成!谢谢惠顾✅",
							duration: 2000,
							icon: "none"
							
						})
					}else {
						uni.showToast({
							title: "无法核销该订单，请稍后再试!❌",
							duration: 3000,
							icon: "none"
							
						})
					}
					
				})
				
			},

			/*********************************************************/
			scanCode() {
				const that = this;
				uni.scanCode({
					success: function(res) {
						console.log("scanscan::", res.result)
						const backendData = res.result;
						console.log("backendData::", backendData)
						that.scanData = backendData.split(',');
				
					},
				});
			},

			/**
			 * 提示获取权限
			 */
			tipsGetSettings() {
				uni.showModal({
					title: "提示",
					content: "您已经关闭相机权限,去设置",
					success: function(res) {
						if (res.confirm) {
							if (this.isIos) {
								plus.runtime.openURL("app-settings:");
							} else {
								permission.gotoAppPermissionSetting();
							}
						}
					},
				});
			},
			async scan() {
				// #ifdef APP-PLUS
				this.isIos = plus.os.name === "iOS";
				// 判断是否是Ios
				if (this.isIos) {
					const iosFirstCamera = uni.getStorageSync("iosFirstCamera"); //是不是第一次开启相机
					if (iosFirstCamera !== "false") {
						uni.setStorageSync("iosFirstCamera", "false"); //设为false就代表不是第一次开启相机
						this.scanCode();
					} else {
						if (permission.judgeIosPermission("camera")) {
							this.scanCode();
						} else {
							// 没有权限提醒是否去申请权限
							this.tipsGetSettings();
						}
					}
				} else {
					this.scanCode();
				}
				// #endif
				// #ifdef MP-WEIXIN
				this.scanCode();
				// #endif
			},
			/************************************************************/
		},
	};
</script>
<style scoped lang="scss">
	.saveBtn,
	.caVerification {
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		font-size: 30rpx;
		background: $aider-light-color;
		color: #fff;
		width: 70%;
		margin: 40rpx auto 0 auto;
		border-radius: 20rpx;
	}

	.caVerification {
		margin-top: 40rpx;
		background: #fff;

		color: $aider-light-color;
		border: 2rpx solid $aider-light-color;
	}



	.cancelafter-V {
		width: 100%;
		padding-top: 3%;

		/deep/ .u-form-item {
			font-size: 100%;
			font-weight: bolder;
			background-color: #fff;
			padding: 24rpx 30rpx;
		}

	}
</style>
