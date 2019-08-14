import util from '@/libs/util.js'

const service = util.ajax
let indexAxios = {}
indexAxios.WXnick= function (openId) {
  const params = {
    openId
  }
  return service({
    url: '/cisp_res/wxp/WXPLogController.do?method=WXnick',
    method: 'get',
    params
  })
}
/**
 * 获取门禁列表
 */
indexAxios.myDoorDevice= function (openId)  {
  const params = {
    openId
  }
  return service({
    url: '/cisp_res/wxp/WXP050100Unlock.do?method=myDoorDevice',
    method: 'get',
    params
  })
}
/**
 * 绑定手机号
 */
indexAxios.bindingPhone= function (userName,code,openId,headImage,nickName,loginType)  {
    const params = {
        userName,
        code,
        openId,
        headImage,
        nickName,
        loginType
    }
    return service({
      url: '/cisp_res/wxp/WXPLogController.do?method=bindingPhone',
      method: 'get',
      params
    })
}
// 绑定房屋
indexAxios.bindingHouse= function (resUserId,houseId,myStatus)  {
  const params = {
    resUserId,
    houseId,
    myStatus
  }
  return service({
    url: '/cisp_res/wxp/WXPhouse.do?method=bindingHouse',
    method: 'get',
    params
  })
}
/**
 * 实名认证
 */
indexAxios.RealNameAuthentication= function (trueName,sex,resUserId)  {
    const params = {
        trueName,
        sex,
        resUserId,
    }
    return service({
      url: '/cisp_res/wxp/WXPhouse.do?method=RealNameAuthentication',
      method: 'get',
      params
    })
}

// 验证码
indexAxios.sendCode= function (userName,loginType)  {
  const params = {
    userName,
    loginType:1//住户（1）or物业（2）当前为住户注册所以写死为1
  }
  return service({
    url: '/cisp_res/wxp/WXPLogController.do?method=sendCode',
    method: 'get',
    params
  })
}
// 手机开门
indexAxios.openDoor= function (id,idStatus,openId)  {
  const params = {
    id,
    idStatus,
    openId
  }
  return service({
    url: '/cisp_res/wxp/WXP050100Unlock.do?method=openDoor',
    method: 'get',
    params
  })
}
export default indexAxios