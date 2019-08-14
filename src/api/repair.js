import util from '@/libs/util.js'

const service = util.ajax
// 获取微信签名
export function getSignature (params) {
    return service({
      url: '/cisp_res/wxp/WXPCommunal.do?method=getSignature',
      method: 'GET',
      params
    });
  }
  // 获取获取公共报修类型
  export function getPubRepairType (params) {
    return service({
      url: '/cisp_res/wxp/WXP090100Public.do?method=queryRepairType',
      method: 'GET',
      params
    });
  }
  // 获取公共报修默认地址
  export function getPubRepairAdd (params) {
    return service({
      url: '/cisp_res/wxp/WXP090100Public.do?method=queryDefaultAddr',
      method: 'GET',
      params
    });
  }
  // 根据报修类型获取报修内容
  export function nextPubRepair (params) {
    return service({
      url: '/cisp_res/wxp/WXP090100Public.do?method=loadRepairContent',
      method: 'GET',
      params
    });
  }
  // 提交公共报修
  export function subPublish (params) {
    return service({
      url: '/cisp_res/wxp/WXP090100Public.do?method=handle01',
      method: 'GET',
      params
    });
  }
  // 查询个人报修地址
  export function personAddr (params) {
    return service({
      url: '/cisp_res/wxp/WXP090200Person.do?method=queryHouse',
      method: 'GET',
      params
    });
  }
  // 查询个人报修类型
  export function personRepairType (params) {
    return service({
      url: '/cisp_res/wxp/WXP090200Person.do?method=queryDict',
      method: 'GET',
      params
    });
  }
   // 个人报修提交
   export function subpersonRepair (params) {
    return service({
      url: '/cisp_res/wxp/WXP090200Person.do?method=handle01',
      method: 'GET',
      params
    });
  }

  // 我的报修列表
  export function myRepair (params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=handle05',
      method: 'GET',
      params
    });
  }
