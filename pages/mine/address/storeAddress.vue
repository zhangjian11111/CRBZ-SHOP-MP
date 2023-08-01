<template>
	<view class="address">

		<u-empty class="empty" v-if="storeAddrDistanceList.length == 0" text="暂无自提地址" mode="address"></u-empty>
		<view class="list" v-else>
			<view class="item c-content" v-for="(item, index) in storeAddrDistanceList" :key="index">
				<view class="basic" @click="selectAddressData(item,index)">
					<view>
						<span v-if="index === 0" class="highlight">离你最近</span>
					</view> 
					<text class="pickstorename">{{ item.get('addressName') }}</text>
					<!-- <text>{{ item.mobile }}</text> -->
					<view>
						<div class="storeregion">
							<span>{{ item.get('address') }}</span>
						</div>
					</view>
					<view>
						<div class="regiondistance"> 
							<span>距您约 {{ item.get('driveDistance') }}km > </span>
						</div>
					</view>
				</view>
			</view>
			<view style="height: 100px"></view>
		</view>
		<u-action-sheet :list="removeList" :tips="tips" v-model="showAction" @click="deleteAddressMessage">
		</u-action-sheet>
	</view>
</template>

<script>
	import * as API_Trade from "@/api/trade";
	import * as API_Store from "@/api/store.js";
	// import { amapPlugin } from '@/utils/tools';
	import {
		getCurrentLocation,
		getDriveDistanceList,
		getDriveAddressList
	} from '@/utils/commonlocation.js';

	export default {
		data() {
			return {
				// longitude: "", //当前位置纬度
				// latitude: "", //当前位置经度
				storeAddrDistanceList: [], //包含距离信息的地址信息
				storeAddressList: [], //地址列表
				driveDistanceList: [], //距离列表
				longlaList: [], //经纬度列表
				showAction: false, //是否显示下栏框
				removeList: [{
					text: "确定",
				}, ],
				tips: {
					text: "确定要删除该收货人信息吗？",
				},
				removeId: "", //删除的地址id
				routerVal: "",
				params: {
					pageNumber: 1,
					pageSize: 1000,
				},
			};
		},
		
		
		onPullDownRefresh() {
			this.storeAddressList = [];
			this.getAddressList();
			this.getDdList();
			uni.stopPullDownRefresh();
		},
		onLoad: function(val) {
			this.routerVal = val;
		},


		async onShow() {
			uni.showLoading({
				title: "正在寻找附近自提点🚤"
			})
			this.storeAddressList = [];
			await this.getAddressList();
			await this.getDdList();
			uni.hideLoading();
		},
		onHide() {},
		methods: {

			//获取用户位置到自提点的驾车距离数组
			async getDdList() {
				try {
					// 获取当前位置
					const location = await getCurrentLocation();
					console.log("当前位置：：：location",location)
					const {
						longitude,
						latitude
					} = location;

					// 获取用户位置到自提点的驾车距离列表
					// const driveDistanceList = await getDriveDistanceList(longitude, latitude, this.longlaList);
					// this.driveDistanceList = driveDistanceList;
					// console.log("用户位置到自提点的驾车距离列表:", driveDistanceList);
					
					
					// 获取排序后的地址列表-包含距离
					const addressDistanceList = await getDriveAddressList(longitude, latitude, this.storeAddressList);
					this.storeAddrDistanceList = addressDistanceList;
					console.log("排序后的地址列表:", this.storeAddrDistanceList);
					
					
				} catch (error) {
					console.error("发生错误:", error);
				}
			},


		async selectAddressData(val,index) {
			await API_Trade.setStoreAddressId(val.get('storeId'), this.routerVal.way);
			const storeDistance = val.get('driveDistance');

			uni.navigateTo({
			  url: `/pages/order/fillorder?way=${this.routerVal.way}&storeDistance=${ storeDistance }`
			});
			

		},
		//获取地址列表
		async getAddressList() {
			uni.showLoading();

			await API_Store.getStoreAddress(
				this.routerVal.storeId,
				this.params
			).then((res) => {
				this.storeAddressList = res.data.result.records;

				if (this.$store.state.isShowToast) {
					uni.hideLoading()
				};
				for (let i = 0; i < res.data.result.records.length; i++) {
					const longla = res.data.result.records[i].center.split(",").reverse();
					this.longlaList.push(longla);
				}
		
				console.log(res.data.result.records);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
	@import "./address.scss";
	
	.highlight {
	  font-weight: bold;
	  color: red;
	}

</style>
