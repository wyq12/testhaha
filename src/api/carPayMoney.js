import util from '@/libs/util.js'

const service = util.ajax
// 车牌绑定、修改车牌
export function getVehiclePort (params) {
    return service({
      url: '/cisp_res/wxp/WXPwxVehicle.do?method=handle01',
      method: 'GET',
      params
    });
  }
// 删除车牌绑定  
  export function delectVehiclePort (params) {
    return service({
      url: '/cisp_res/wxp/WXPwxVehicle.do?method=handle03',
      method: 'GET',
      params
    });
  }
//   查询用户绑定车牌列表
export function getVehicleInfoPort (params) {
    return service({
      url: '/cisp_res/wxp/WXPwxVehicle.do?method=handle05',
      method: 'GET',
      params
    });
  }
// 查询入场信息
export function getParkOrderPort (params) {
    return service({
      url: '/cisp_res/wxp/WXPParkOrder.do?method=getParkOrder',
      method: 'GET',
      params
    });
  }
 