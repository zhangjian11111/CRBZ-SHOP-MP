const name = "西部手工牛肉面"; //全局商城name
const schemeName = '西部手工牛肉面' //唤醒app需要的schemeName
export default {
  name: name,
  schemeLink: `${schemeName}://`, //唤起app地址
  downloadLink: "https://www.qgxbm.com", //下载地址，下载app的地址
  shareLink: "https://www.qgxbm.com", //分享地址，也就是在h5中默认的复制地址
  appid: "wxcc79af48cf4c5d4a", //小程序唯一凭证，即 AppID，可在「微信公众平台 - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态）
  aMapKey: "8e77ce1de5070e3b216d42f88d236e77", //在高德中申请Web服务key
  aMapWxPKey: "aa7843fbb457b60e773c603dc2610b0d",//在高德中申请miniapp服务key
  scanAuthNavigation:['https://www.qgxbm.com'], //扫码认证跳转域名配置 会根据此处配置的路由进行跳转
  iosAppId:"", //AppStore的应用地址id 具体在分享->拷贝链接中查看
  logo:"https://crbzshop.oss-cn-hangzhou.aliyuncs.com/%E7%B4%A0%E6%9D%90/wxminiapppic/%E8%A5%BF%E9%83%A8%E8%83%9C%E6%B5%B7logo.png", //logo地址
  customerServiceMobile:"18943013950", //客服电话
  customerServiceEmail:"1097951193@qq.com", //客服邮箱
  imWebSrc:"https://im.qgxbm.com",//IM地址
  baseWsUrl: "wss://im-api.qgxbm.com/crbz/webSocket", // IM WS 地址
  // imWebSrc:"https://yqswgjz.mynatapp.cc",
  // baseWsUrl: "wss://yqswgjz.mynatapp.cc/crbz/webSocket",
  enableGetClipboard: false, //是否启用粘贴板获取 scanAuthNavigation 中的链接，如果匹配则会跳转到对应页面
  enableMiniBarStartUpApp: false, //是否在h5中右侧浮空按钮点击启动app
  /**
   * 如需更换主题请修改此处以及uni.scss中的全局颜色
   */
  mainColor: "#ff3c2a", // 主题色
  lightColor: "#ff6b35", // 高亮主题色
  aiderLightColor: "#ff9f28", // 辅助高亮颜色
  defaultUserPhoto: "https://xbcdn.qgxbm.com/XBMALL/images/missing-face.png", // 默认用户头像
  enableFetchMobileLogin: false // 是否启用获取手机号登录 如果微信小程序提示封禁手机号获取权限 可将此选项设置成false作为备用登录方案
};
