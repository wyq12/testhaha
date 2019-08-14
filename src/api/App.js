import util from '@/libs/util.js'

const service = util.ajax
let AppAxios = {}
AppAxios.WXPuser= function (params) {
  return service({
    url: '/cisp_res/wxp/WXPLogController.do?method=WXPuser',
    method: 'get',
    params
  })
}
export default AppAxios
export function WXPuser(params) {
  return service({
    url: '/cisp_res/wxp/WXPLogController.do?method=WXPuser',
    method: 'GET',
    params
  });
}
