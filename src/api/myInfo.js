import util from '@/libs/util.js'

const service = util.ajax

export function WXnickPort(params) {
    return service({
      url: '/cisp_res/wxp/WXPLogController.do?method=WXnick',
      method: 'GET',
      params
    });
  }


