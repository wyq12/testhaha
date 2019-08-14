import util from '@/libs/util.js'
const service = util.ajax
export function esQueryHistoryBill (params) {
  return service({
    url: '/cisp_res/wxp/WXP070100Bill.do?method=esQueryHistoryBill',
    method: 'GET',
    params
  });
}
//开票
export function esInvoice (params) {
  return service({
    url: '/cisp_res/wxp/WXP070100Bill.do?method=esInvoice',
    method: 'GET',
    params
  });
}

//开票重发电子发票到邮箱
export function esReSendInvoice (params) {
  return service({
    url: '/cisp_res/wxp/WXP070100Bill.do?method=esReSendInvoice',
    method: 'GET',
    params
  });
}

//开票填单历史
export function esInvoiceHistoryForm (params) {
  return service({
    url: '/cisp_res/wxp/WXP070100Bill.do?method=esInvoiceHistoryForm',
    method: 'GET',
    params
  });
}

//查询开票历史(本地)
export function queryInvoiceHistory (params) {
  return service({
    url: '/cisp_res/wxp/WXP070100Bill.do?method=queryInvoiceHistory',
    method: 'GET',
    params
  });
}

//查询开票详情
export function queryInvoiceDetail (params) {
  return service({
    url: '/cisp_res/wxp/WXP070100Bill.do?method=queryInvoiceDetail',
    method: 'GET',
    params
  });
}

//根据我方订单ID获取易软平台订单ID
export function queryEsRecordFeeId (params) {
  return service({
    url: '/cisp_res/wxp/WXP070200Pay.do?method=queryEsRecordFeeId',
    method: 'GET',
    params
  });
}

//模糊查询发票抬头历史
export function queryInvoiceCname (params) {
  return service({
    url: '/cisp_res/wxp/WXP070100Bill.do?method=queryInvoiceCname',
    method: 'GET',
    params
  });
}