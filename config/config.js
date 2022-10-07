const name = "春日半盏"; //全局商城name
const schemeName = '春日半盏' //唤醒app需要的schemeName
export default {
  name: name,
  schemeLink: `${schemeName}://`, //唤起app地址
  downloadLink: "https://yqswgjz.mynatapp.cc", //下载地址，下载app的地址
  shareLink: "https://yqswgjz.mynatapp.cc", //分享地址，也就是在h5中默认的复制地址
  appid: "wxb660c158f0f9c8ac", //小程序唯一凭证，即 AppID，可在「微信公众平台 - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态）
  aMapKey: "2ffb3bf9fe600c584a6fd6b64b7d4791", //在高德中申请Web服务key
  scanAuthNavigation:['https://yqswgjz.mynatapp.cc/'], //扫码认证跳转域名配置 会根据此处配置的路由进行跳转
  iosAppId:"id1564638363", //AppStore的应用地址id 具体在分享->拷贝链接中查看
  logo:"https://crbzshop.oss-cn-hangzhou.aliyuncs.com/%E7%B4%A0%E6%9D%90/%E6%98%A5%E6%97%A5%E5%8D%8A%E7%9B%8Flogo-%E4%B8%AD%E5%9B%BD%E7%BA%A2%E9%85%8D%E6%89%B6%E5%85%89%E8%89%B2.png", //logo地址
  customerServiceMobile:"18943013950", //客服电话
  customerServiceEmail:"1097951193@qq.com", //客服邮箱
  imWebSrc:"https://yqswgjz.mynatapp.cc" //IM地址
};
