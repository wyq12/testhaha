import util from '@/libs/util.js'

const service = util.ajax

export function queryResConfig(params) {
  return service({
    url: '/cisp_res/wxp/WXP070200Pay.do?method=queryResConfig',
    method: 'GET',
    params
  });
}
export function queryPptBillPort(params) {
    return service({
      url: '/cisp_res/wxp/WXP070100Bill.do?method=queryPptBill',
      method: 'GET',
      params
    });
  }
  // 易软
  export function queryEsQueryBill(params) {
    return service({
      url: '/cisp_res/wxp/WXP070100Bill.do?method=esQueryBill',
      method: 'GET',
      params
    });
  }
export function isPayPort(params){
    return service({
        url:'/cisp_res/wxp/WXP070100Bill.do?method=isPay',
        method:'GET',
        params
    })
}
export function paySourceWay(params){
    return service({
        url:'/cisp_res/wxp/WXP070200Pay.do?method=paySourceWay',
        method:'GET',
        params
    })
}

