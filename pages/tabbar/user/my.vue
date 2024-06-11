<template>
  <view class="user">
    <!-- 个人信息 -->
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view class="header"  @click="userDetail">
      <view class="head-1">
        <image :src="userInfo.face || userImage"></image>
      </view>
      <view class="head-2" v-if="userInfo.id">
        <view class="user-name">{{ userInfo.nickName }}</view>
      </view>
      <view class="head-2" v-else>
        <view class="user-name">登录/注册</view>
      </view>
      <u-icon style="display: flex;align-items: flex-start;" name="arrow-right"></u-icon>
    </view>
    <!-- 积分，优惠券，关注， -->
    <div class="pointBox box">
      <u-row text-align="center" gutter="16" class="point">
        <!-- <u-col text-align="center" span="4" @click="navigateTo('/pages/mine/deposit/operation')">
          <view>预存款</view>
          <view class="money">{{ walletNum | unitPrice }}</view>
        </u-col> -->

        <u-col text-align="center" span="4" @click="navigateTo('/pages/cart/coupon/myCoupon')">
          <view>优惠券</view>
          <view>{{ couponNum || 0 }}</view>
        </u-col>

		<u-col text-align="center" span="4" @click="navigateTo('/pages/mine/deposit/operation')">
		  <view></view>
		  <view class="money"></view>
		</u-col>

        <u-col text-align="center" span="4" @click="navigateTo('/pages/mine/myTracks')">
          <view>足迹</view>
          <view>{{ footNum || 0 }}</view>
        </u-col>
      </u-row>
      <!-- 我的订单，代付款 -->
      <view class="order">
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=1')">
          <div class="bag bag2">
            <u-icon name="bag-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>待付款</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=3')">
          <div class="bag bag3">
            <u-icon name="car-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>待收货</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/evaluate/myEvaluate')">
          <div class="bag bag4">
            <u-icon name="star-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>待评价</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/afterSales/afterSales')">
          <div class="bag bag5">
            <u-icon name="server-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>售后</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=0')">
          <div class="bag bag1">
            <u-icon name="order" size="35" color="#fff"></u-icon>
          </div>
          <view>我的订单</view>
        </view>

      </view>

	  <!-- <view class="order" v-if="userInfo.mobile === '18186854165' || userInfo.mobile === '18393706596' || userInfo.mobile === '18943013950' " >
		  <view class="order-item" @click="navigateTo('/pages/order/cancelafterverification/ca-verification')">
		    <div class="bag bag6">
		      <u-icon name="scan" size="35" color="#fff"></u-icon>
		    </div>
		    <view>订单核销</view>
		  </view>

		  <view class="order-item" @click="navigateTo('/pages/order/allOrder?status=0')">
		    <div class="bag bag6">
		      <u-icon name="account" size="35" color="#fff"></u-icon>
		    </div>
		    <view>订单复查</view>
		  </view>
	  </view> -->

	  <view class="order" v-if="userInfo.haveStore" >
	  		  <view class="order-item" @click="navigateTo('/pages/order/cancelafterverification/ca-verification')">
	  		    <div class="bag bag6">
	  		      <u-icon name="scan" size="35" color="#fff"></u-icon>
	  		    </div>
	  		    <view>订单核销</view>
	  		  </view>

	  		  <view class="order-item" @click="navigateTo('/pages/order/allOrder?status=0')">
	  		    <div class="bag bag6">
	  		      <u-icon name="account" size="35" color="#fff"></u-icon>
	  		    </div>
	  		    <view>订单复查</view>
	  		  </view>
	  </view>


    </div>
    <!-- 常用工具 -->

    <tool />

  </view>
</template>
<script>
import tool from "@/pages/tabbar/user/utils/tool.vue";
import { getCouponsNum, getFootprintNum } from "@/api/members.js";
import { getUserWallet } from "@/api/members";
import configs from '@/config/config'
export default {
  components: {
    tool,
  },
  data() {
    return {
      configs,
      userImage:configs.defaultUserPhoto,
      coverTransform: "translateY(0px)",
      coverTransition: "0s",
      moving: false,
      userInfo: {},
      couponNum: "",
      footNum: "",
      walletNum: "",
    };
  },
  onLoad() { },
  onShow() {
    this.userInfo = this.$options.filters.isLogin() || {};
	console.log("userinfo:::",this.userInfo)
    if (this.$options.filters.isLogin("auth")) {
      this.getUserOrderNum();
    } else {
      this.walletNum = 0;
      this.couponNum = 0;
      this.footNum = 0;
    }
  },
  onPullDownRefresh() {
    this.getUserOrderNum();
    this.userInfo = this.$options.filters.isLogin();
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.navigateTo("/pages/mine/set/setUp");
    }
  },
  // #endif

  mounted() { },
  methods: {
    /**
     * 统一跳转接口,拦截未登录路由
     * navigator标签现在默认没有转场动画，所以用view
     */
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },
    userDetail() {
      this.userInfo.id
        ? this.navigateTo("/pages/mine/set/personMsg")
        : this.$options.filters.navigateToLogin();;
    },

    async getUserOrderNum() {
      uni.stopPullDownRefresh();

      Promise.all([
        getCouponsNum(), //优惠券
        getFootprintNum(), //浏览数量
        getUserWallet(), //预存款
      ]).then((res) => {
        this.couponNum = res[0].data.result;
        this.footNum = res[1].data.result;
        this.walletNum = res[2].data.result.memberWallet;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
html,
body {
  overflow: auto;
}

.money {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.user {
  .header {
    max-width: 100%;
    padding: calc(50rpx + var(--status-bar-height)) 30rpx 0 6%;
    height: calc(var(--status-bar-height) + 360rpx);
    background-size: cover;
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    // background-image: url("https://crbzshop.oss-cn-hangzhou.aliyuncs.com/%E7%B4%A0%E6%9D%90/wxminiapppic/%E7%83%A7%E9%BA%A6%E5%A4%A7%E5%A4%B4%E8%B4%B4.jpg");
	// background-image: url("https://crbzshop.oss-cn-hangzhou.aliyuncs.com/%E7%B4%A0%E6%9D%90/wxminiapppic/%E7%83%A7%E9%BA%A6%E5%98%9F%E5%98%9F%E8%84%B8.jpg");
	// background-image: url("https://xbcdn.qgxbm.com/XBCDN/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE%E7%89%87/%E8%A5%BF%E9%83%A8%E8%83%9C%E6%B5%B7%E7%89%9B%E8%82%89%E9%9D%A2%20%E7%B2%BE%E9%80%89%E5%B0%8F%E9%BA%A6%E7%B2%89.png");
    background-image: url("https://xbcdn.qgxbm.com/XBMALL/images/xb-my.gif");
	background-position: bottom;
    background-repeat: no-repeat;
    color: #ffffff;
    display: flex;
    justify-content: space-between;

    .head-1 {
      text-align: center;
      width: 152rpx;
      position: relative;
      display: flex;
      align-items: center;

      image {
        width: 110rpx;
        height: 110rpx;
        border-radius: 50%;
        margin-bottom: 30rpx;
        border: 3px solid #fff;
      }

      .edti-head {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        top: 100rpx;
        right: 0;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .head-2 {
      flex: 1;
      margin-left: 10rpx;
      margin-top: 120rpx;
      line-height: 1;
    }

    /deep/ .u-icon,
    .u-icon {
      margin-top: 106rpx;
    }
  }

  .pointBox {
    width: 94%;
    margin: 0 3%;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);
  }

  .point {
    text-align: center;
    height: 160rpx;

    font-size: $font-sm;
    // #ifdef MP-WEIXIN
    padding: 24rpx;

    // #endif
    .u-col {
      view {
        color: $u-main-color;
        font-size: 28rpx;
      }

      view:last-child {
        margin-top: 8rpx;
        color: $main-color;
        font-size: $font-lg;
      }
    }
  }

  .order {
    height: 140rpx;
    text-align: center;
    font-size: $font-sm;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 3%;
    color: #999;

    .order-item {
      position: relative;
      line-height: 2em;
      width: 96rpx;

      :first-child {
        font-size: 48rpx;
        margin-bottom: 10rpx;
      }
    }
  }
}

.box {
  transform: translateY(-30rpx);
}

.user-name {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: bolder;
}

.bag {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin: 0 auto;
}

.bag1 {
  background: #aa5500;
}

.bag2 {
  background: #ff992f;
}

.bag3 {
  background: #009ee0;
}

.bag4 {
  background: #00d5d5;
}

.bag5 {
  background: #28ccb0;
}

.bag6 {
  background: #ff0000;
}
</style>
