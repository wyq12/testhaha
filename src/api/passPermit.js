import util from '@/libs/util.js'

const service = util.ajax

export function getQRCode(params) {
  return service({
    url: '/cisp_ppt/wxp/WXP160100VisitApply.do?method=productCode',
    method: 'GET',
    params
  });
}