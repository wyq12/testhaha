import util from '@/libs/util.js'

const service = util.ajax
// 获取投诉表扬详情
export function infoDetailPort(params) {
    return service({
      url: '/cisp_res/wxp/WXP080100ComAdvice.do?method=getCmpOrderDetail',
      method: 'GET',
      params
    });
  }
  // 联系物业
  export function relationWyPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP090300PublicPerson.do?method=lookContact',
      method: 'GET',
      params
    });
  }
  // 评价
  export function submitEvaluatesPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP080100ComAdvice.do?method=reBack',
      method: 'GET',
      params
    });
  }
  // 提醒物业
  export function zhuHuRemindPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP080100ComAdvice.do?method=getCmpOrderPush',
      method: 'GET',
      params
    });
  }
  // 工单进度详情
  export function processPort (params) {
    return service({
      url: '/cisp_res/wxp/WXP080100ComAdvice.do?method=getProcess',
      method: 'GET',
      params
    });
  }

