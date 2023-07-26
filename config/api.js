/**
 * base    : 基础业务API
 * buyer   : 买家API
 */
// 开发环境
const dev = {
	im: "https://yqswgjz.mynatapp.cc",
	common: "https://yqswgjz.mynatapp.cc",
	buyer: "https://yqswgjz.mynatapp.cc",
  // im: "http://127.0.0.1:9111",
  // common: "http://127.0.0.1:9111",
  // buyer: "http://127.0.0.1:9111",
};
// 生产环境
const prod = {
  im: "https://im-api.qgxbm.com",
  common: "https://common-api.qgxbm.com",
  buyer: "https://buyer-api.qgxbm.com",
  // im: "http://127.0.0.1:9111",
  // common: "http://127.0.0.1:9111",
  // buyer: "http://127.0.0.1:9111",
  // im: "https://yqswgjz.mynatapp.cc",
  // common: "https://yqswgjz.mynatapp.cc",
  // buyer: "https://yqswgjz.mynatapp.cc",
};

//默认生产环境
let api = prod;
//如果是开发环境
if (process.env.NODE_ENV == "development") {
  api = dev;
} else {
  api = prod;
}
//微信小程序，app的打包方式建议为生产环境，所以这块直接条件编译赋值
// #ifdef MP-WEIXIN || APP-PLUS
api = prod;
// api = dev;
// #endif

api.buyer += "/buyer";
api.common += "/common";
api.im += "/im";
export default {
  ...api,
};
