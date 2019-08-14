import util from '@/libs/util.js'

const service = util.ajax
/**
 * 访客申请记录详情
 */
export function queryVisitDetail(params) {
  return service({
    url: '/cisp_ppt/wxp/WXP160100VisitApply.do?method=handle04',
    method: 'GET',
    params
  })
}

/**
 * 获取门禁二维码
 */
export function getQRCode(params) {
  return service({
    url: '/cisp_ppt/wxp/WXP160100VisitApply.do?method=productCode',
    method: 'GET',
    params
  });
}