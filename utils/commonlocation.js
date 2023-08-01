//将获取用户当前位置，到自提点的驾车距离抽取
import { amapPlugin } from '@/utils/tools';

// 获取用户位置到自提点的驾车距离
export async function getDriveDistance(longitude, latitude, val) {
  return new Promise(async (resolve, reject) => {
    console.log("我要调用高德地图驾车数据MPapi了！！！")
    try {
      const dres = await amapPlugin.getDrivingRoute({
        origin: '' + longitude + ',' + latitude + '',
        destination: '' + val + '', //destination的格式为'经度,纬度'
        success(res) { // 成功回调
          console.log("驾车信息: ", res.paths[0]);
          resolve(res.paths[0]);
        },
        fail(err) { // 失败回调
          console.log("驾车信息错误: ", err);
          reject(err);
        }
      });
    } catch (error) {
      console.error("getDriveDistance 函数发生错误:", error);
      reject(error);
    }
  });
}



// 获取用户当前位置
export async function getCurrentLocation() {
  console.log("当前位置我要调用高德地图MPapi了！！！");
  return new Promise(async (resolve, reject) => {
    try {
      const gclres = await amapPlugin.getRegeo({
        success(res) { // 成功回调
          console.log("当前位置信息: ", res[0]);
          resolve(res[0]);
        },
        fail(err) { // 失败回调
          console.log("当前位置信息错误: ", err);
          reject(err);
        }
      });
    } catch (error) {
      console.error("getCurrentLocation 函数发生错误:", error);
      reject(error);
    }
  })
}



// 获取用户位置到自提点的驾车距离列表
export async function getDriveDistanceList(longitude, latitude, longlaList) {
  const driveDistanceList = [];
  for (let i = 0; i < longlaList.length; i++) {
    try {
      const res = await getDriveDistance(longitude, latitude, longlaList[i]);
      console.log("最终数据:::", res);
      const driveDistance = parseFloat((res.distance / 1000).toFixed(1));
      driveDistanceList.push(driveDistance);
    } catch (error) {
      console.error("getDriveDistanceList 函数发生错误:", error);
      // 在发生错误时返回 null，保持数组长度一致
      driveDistanceList.push(null);
    }
  }
  return driveDistanceList;
}



// 获取排序后的地址列表包含距离
export async function getDriveAddressList(longitude, latitude, storeAddressList) {
  const driveAddressList = [];
  
  for (let i = 0; i < storeAddressList.length; i++) {
    try {
		
		  const longla = storeAddressList[i].center.split(",").reverse();
		  const singleDriveAddressList = new Map();
		  console.log("要添加的地址数据：：：",storeAddressList[i])
		  console.log("传入经纬度：：：",longla)
		  const res = await getDriveDistance(longitude, latitude, longla);
		  console.log("最终数据:::", res);
		  const driveDistance = parseFloat((res.distance / 1000).toFixed(1));
		  singleDriveAddressList.set('storeId',storeAddressList[i].id);
		  singleDriveAddressList.set('addressName',storeAddressList[i].addressName);
		  singleDriveAddressList.set('address',storeAddressList[i].address);
		  singleDriveAddressList.set('mobile',storeAddressList[i].mobile);
		  singleDriveAddressList.set('driveDistance',driveDistance);
		  driveAddressList.push(singleDriveAddressList);
		  console.log("单条地址：：：：",singleDriveAddressList)
    } catch (error) {
      console.error("getDriveDistanceList 函数发生错误:", error);
      // 在发生错误时返回 null，保持数组长度一致
      driveAddressList.push(null);
    }
  }
  
 
 // 根据 driveDistance 属性排序数组
   driveAddressList.sort((a, b) => {
     const distanceA = a.get('driveDistance');
     const distanceB = b.get('driveDistance');
     return distanceA - distanceB;
   }); 
   
  
  return driveAddressList;
}
