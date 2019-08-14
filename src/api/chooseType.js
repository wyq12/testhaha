import util from '@/libs/util.js'

const service = util.ajax

export function queryResAreaPort(params) {
    return service({
      url: '/cisp_res/wxp/WXPhouse.do?method=queryResArea',
      method: 'GET',
      params
    });
}
export function queryBuilding(params) {
    return service({
      url: '/cisp_res/wxp/WXPhouse.do?method=queryBuilding',
      method: 'GET',
      params
    });
}
export function queryHousePort(params) {
    return service({
      url: '/cisp_res/wxp/WXPhouse.do?method=queryHouse',
      method: 'GET',
      params
    });
}

