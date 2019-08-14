import util from '@/libs/util.js'

const service = util.ajax
// 获取签名
export function getSignaturePort(params) {
    return service({
      url: '/cisp_res/wxp/WXPCommunal.do?method=getSignature',
      method: 'GET',
      params
    });
  }
  //当前小区
  export function getcurrentAreaPort (params) {
    return service({
      url: '/cisp_res/wxp/WXPhouse.do?method=queryResAreaByResUser',
      method: 'GET',
      params
    });
  }
  // 获取投诉事项
  export function getSdicPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP080100ComAdvice.do?method=getTSdic',
      method: 'GET',
      params
    });
  }
//提交工单
  export function comSubmitPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP080100ComAdvice.do?method=handle01',
      method: 'GET',
      params
    });
  }
//   我的投诉建议列表
export function  getMyRepairPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP080100ComAdvice.do?method=getMyComAdvice',
      method: 'GET',
      params
    });
  }
 