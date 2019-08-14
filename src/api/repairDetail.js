import util from '@/libs/util.js'

const service = util.ajax
// 获取报修详情(公共、个人公用、个人报修支付页面)
export function infoDetailPort(params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=handle04',
      method: 'GET',
      params
    });
  }
  // 联系物业(公共、个人公用)
  export function relationWyPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=lookContact',
      method: 'GET',
      params
    });
  }
  // 获取图片(公共、个人公用)
  export function imgInfoPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=queryRepairImg',
      method: 'GET',
      params
    });
  }
// 取消订单(公共、个人公用)
  export function cancelPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=handle02',
      method: 'GET',
      params
    });
  }
  // 评价
  export function submitEvaluatesPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=handle02',
      method: 'GET',
      params
    });
  }
  // 提醒物业
  export function zhuHuRemindPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=remindProperty',
      method: 'GET',
      params
    });
  }
  // 工单进度详情
  export function processPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=handle07',
      method: 'GET',
      params
    });
  }

