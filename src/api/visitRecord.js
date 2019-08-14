import util from '@/libs/util.js'

const service = util.ajax

/**
 * 访客申请记录列表
 */
export function queryVisitRecord(params) {
  return service({
    url: '/cisp_ppt/wxp/WXP160100VisitApply.do?method=handle05',
    method: 'GET',
    params
  })
}




