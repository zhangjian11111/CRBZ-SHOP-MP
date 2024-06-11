<template>
  <div class="page">
    <u-navbar :custom-back="back" back-icon-color="#fff" :background="background" :border-bottom="false" >
    </u-navbar>
    <div class="wrapper">
      <!-- 砍价列表 -->
      <div class="box">
        <!-- 已砍的商品 -->
        <goodsTemplate type="kanJia" v-if="bargainList.length!=0" :res="bargainList" />
        <div class="bargain empty" v-else>
          <u-empty text="暂无活动" mode="list"></u-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBargainList } from "@/api/promotions";
import goodsTemplate from '@/components/m-goods-list/promotion'
export default {
  components:{goodsTemplate},
  data() {
    return {
      background: {
        backgroundColor: "transparent",
      },
      params: {
        promotionStatus: "START", //开始/上架
        pageNumber: 1,
        pageSize: 20,
      },
      bargainList: [], //砍价活动列表
    };
  },
  onShow() {
    this.params.pageNumber = 1;
    this.bargainList = [];
    this.init();
  },
  onReachBottom() {
    this.params.pageNumber++;
    this.init();
  },
  methods: {
    // 返回上一级
    back() {
      uni.switchTab({
        url: "/pages/tabbar/home/index",
      });
    },
    /**
     * 初始化砍价列表
     */
    async init() {
      let res = await getBargainList(this.params); //砍价列表
      if (res.data.success) {
        this.bargainList.push(...res.data.result.records);
      }
    },

    // 跳转到砍价详情
    navigateToBargainDetail(val) {
      uni.navigateTo({
        url: `/pages/promotion/bargain/detail?id=${val.id}`,
      });
    },
  },
};
</script>
<style lang="scss">
page {
  background-color: $light-color !important;
}
</style>
<style lang="scss" scoped>
.wrapper {
  background: url("https://xbcdn.qgxbm.com/XBMALL/images/%E8%A5%BF%E9%83%A8%E8%83%9C%E6%B5%B7%E7%89%9B%E8%82%89%E9%9D%A2%20%E7%A0%8D%E4%BB%B7.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 342rpx;
  width: 100%;
  border-radius: 2%;
}

.box {
  background: #fff;
  border-radius: 20rpx;
  position: relative;
  top: 380rpx;
  width: 94%;
  margin: 0 auto;
  > .bargain {
    padding: 32rpx;
  }
}
.bargain-item {
  align-items: center;
  border-bottom: 1rpx solid #f6f6f6;
  padding: 32rpx 0;
}
.goods-config {
  flex: 8;
  margin-left: 20rpx;
  > .goods-title {
    height: 80rpx;
    font-weight: bold;
  }
}
.max-price {
  color: $main-color;
  font-size: 24rpx;
  > span {
    font-size: 32rpx;
    font-weight: bold;
  }
}
.goods-buy {
  margin: 10rpx 0;
  align-items: center;
  justify-content: space-between;
}
.bargaining {
  font-size: 24rpx;
  color: #fff;
  background: $light-color;
  padding: 10rpx 24rpx;
  border-radius: 100px;
}
.empty {
  height: 400rpx;
}
</style>