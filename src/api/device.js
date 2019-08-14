import util from '@/libs/util.js'

const service = util.ajax
// 巡检报告提交页面加载接口
export function devicePagePort(params){
    return service({
        url:'/cisp_ppt/wxp/WXP290400ScheduleLog.do?method=devicePage',
        method:'GET',
        params
    })
}
// 巡检报告提交接口
export function reportSubmitPort(params){
    return service({
        url:'/cisp_ppt/wxp/WXP290400ScheduleLog.do?method=handle01',
        method:'GET',
        params
    })
}
// 设备巡检历史记录接口
export function reportListPort(params){
    return service({
        url:'/cisp_ppt/wxp/WXP290400ScheduleLog.do?method=reportList',
        method:'GET',
        params
    })
}
// 巡检报告提交成功，加载个人提交记录
export function reportUserPort(params){
    return service({
        url:'/cisp_ppt/wxp/WXP290400ScheduleLog.do?method=reportUser',
        method:'GET',
        params
    })
}