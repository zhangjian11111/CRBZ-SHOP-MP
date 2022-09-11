<template>
  <div class="wrapper">
    <!-- 楼层装修组件 -->
    <tpl ref="tpl" />
  </div>
</template>
<script>
import tpl from "@/pages/tabbar/home/views.vue";

export default {
  data() {
    return {
      background: {
        backgroundColor: "#fff",
      },
    };
  },
  onPullDownRefresh() {
	// uni.showToast({
	// 	title: '努力加载中...',
	// 	duration: 3000,
	// 	icon: "loading",
	// })
    this.$refs.tpl.init();
	// setTimeout(function () {
	// 			uni.stopPullDownRefresh();
	// 		}, 5000);
    uni.stopPullDownRefresh();
  },
  components: {
    tpl,
  },
};
</script>

<style lang="scss" scoped>
</style>
