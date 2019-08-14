import util from '@/libs/util.js'

const service = util.ajax

export function noyicesDetail(params) {
    return service({
      url: '/cisp_res/wxp/WXP010100Notice.do?method=handle04',
      method: 'GET',
      params
    });
  }