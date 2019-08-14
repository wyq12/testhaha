import util from '@/libs/util.js';
const server = util.ajax;
export  function WXnickPort(params){
   return server ({
       url:'/cisp_res/wxp/WXPLogController.do?method=WXnick',
       methods:'GET',
       params
   }) 
}
export  function bindingPhonePort(params){
    return server ({
        url:'/cisp_res/wxp/WXPLogController.do?method=bindingPhone',
        methods:'GET',
        params
    }) 
 }