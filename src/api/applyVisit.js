import util from '@/libs/util.js'
const service = util.ajax

// 提交访客数据
export function submitVisitorInfo(params) {
  return service({
    url: '/cisp_ppt/wxp/WXP160100VisitApply.do?method=handle01',
    method: 'GET',
    params
  })
}

// 查询小区是否有人脸数据库
export function isFaceDb(params) {
  return service({
    url: '/cisp_ppt/wxp/WXP160100VisitApply.do?method=checkDb',
    method: 'GET',
    params
  })
}

// 上传人脸
export function uploadFace(params) {
  return service({
    url: '/cisp_ppt/wxp/WXP160100VisitApply.do?method=uploadImageFace',
    method: 'GET',
    params
  })
}

// 获取数据字典
export function queryDict(params) {
  return service({
    url: '/cisp_ppt/wxp/WXP160100VisitApply.do?method=dictForVisit',
    method: 'GET',
    params
  })
}


