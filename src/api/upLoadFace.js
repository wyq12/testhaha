import util from '@/libs/util.js'

const service = util.ajax

export function WXPfacePort(params) {
    return service({
      url: '/cisp_res/wxp/WXP220100Face.do?method=WXPface',
      method: 'GET',
      params
    });
}
export function faceUrlPort(params) {
  return service({
    url: '/cisp_res/wxp/WXP220100Face.do?method=faceUrl',
    method: 'GET',
    params
  });
}
// 未审核钱上传人脸图片接口
export function lockApplyFace(params) {
  return service({
    url: '/cisp_res/wxp/WXP220100Face.do?method=lockApplyFace',
    method: 'GET',
    params
  });
}


