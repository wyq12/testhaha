import util from '@/libs/util.js'

const service = util.ajax
export function bindingHousePort(params){
    return service({
        url:'/cisp_res/wxp/WXPhouse.do?method=bindingHouse',
        method:'GET',
        params
    })
}
export function WXPuserPort(params){
    return service({
        url:'/cisp_res/wxp/WXPLogController.do?method=WXPuser',
        method:'GET',
        params
    })
}
export function changeDefaultHousePort(params){
    return service({
        url:'/cisp_res/wxp/WXPhouse.do?method=changeDefaultHouse',
        method:'GET',
        params
    })
}