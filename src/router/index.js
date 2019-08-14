import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode:'history',
    routes: [

        {
            path: '/index',
            name: 'index',
            component: () => import('@/views/index'),
            meta: {
                title: '首页',
                index: 1
            }
        },
        {
            path: '/repair',
            name: 'repair',
            component: () => import('@/views/repair/repair'),
            meta: {
                title: '报事报修',
                index: 2
            }
        },
        {
            path: '/myRepair',
            name: 'myRepair',
            component: () => import('@/views/repair/myRepair'),
            meta: {
                title: '我的报修',
                index: 2
            }
        },
        {
            path: '/repairSuccess',
            name: 'repairSuccess',
            component: () => import('@/views/repair/repairSuccess'),
            meta: {
                title: '报修成功',
                index: 3
            }
        },
        {
            path: '/publicRepairDetail',
            name: 'publicRepairDetail',
            component: () => import('@/views/repair/publicRepairDetail'),
            meta: {
                title: '公共报修详情',
                index: 4
            }
        },
        {
            path: '/personRepairDetail',
            name: 'personRepairDetail',
            component: () => import('@/views/repair/personRepairDetail'),
            meta: {
                title: '个人报修详情',
                index: 4
            }
        },
        {
            path: '/personRepairPay',
            name: 'personRepairPay',
            component: () => import('@/views/repair/personRepairPay'),
            meta: {
                title: '支付',
                index: 5
            }
        },
        {
            path: '/progressDetail',
            name: 'progressDetail',
            component: () => import('@/views/repair/progressDetail'),
            meta: {
                title: '进度详情',
                index: 5
            }
        },
        {
            path: '/complainAndSuggest',
            name: 'complainAndSuggest',
            component: () => import('@/views/suggestAndComplain/complainAndSuggest'),
            meta: {
                title: '投诉建议',
                index: 3
            }
        },
        {
            path: '/complainSuccess',
            name: 'complainSuccess',
            component: () => import('@/views/suggestAndComplain/complainSuccess'),
            meta: {
                title: '提交成功',
                index: 4
            }
        },
        {
            path: '/myComplain',
            name: 'myComplain',
            component: () => import('@/views/suggestAndComplain/myComplain'),
            meta: {
                title: '我的投诉建议',
                index: 2
            }
        },
        {
            path: '/complainDetail',
            name: 'complainDetail',
            component: () => import('@/views/suggestAndComplain/complainDetail'),
            meta: {
                title: '投诉建议详情',
                index: 4
            }
        },
        {
            path: '/myPraise',
            name: 'myPraise',
            component: () => import('@/views/suggestAndComplain/myPraise'),
            meta: {
                title: '表扬详情',
                index: 4
            }
        },
        {
            path: '/ComProcessDetail',
            name: 'ComProcessDetail',
            component: () => import('@/views/suggestAndComplain/ComProcessDetail'),
            meta: {
                title: '进度详情',
                index: 5
            }
        },
        {
            path: '/propertyPay',
            name: 'propertyPay',
            component: () => import('@/views/propertyPay'),
            meta: {
                title: '物业缴费',
                index: 2
            }
        },
        {
            path: '/myHouse',
            name: 'myHouse',
            component: () => import('@/views/myHouse'),
            meta: {
                title: '我的房屋',
                index: 2
            }
        },
        {
            path: '/myInfo',
            name: 'myInfo',
            component: () => import('@/views/myInfo'),
            meta: {
                title: '个人资料',
                index: 2
            }
        },
        {
            path: '/chooseCommunity',
            name: 'chooseCommunity',
            component: () => import('@/views/chooseCommunity'),
            meta: {
                title: '选择小区',
                index: 3
            }
        },
        {
            path: '/chooseHouse',
            name: 'chooseHouse',
            component: () => import('@/views/chooseHouse'),
            meta: {
                title: '选择房屋',
                index: 4
            }
        },
        {
            path: '/upLoadFace',
            name: 'upLoadFace',
            component: () => import('@/views/upLoadFace'),
            meta: {
                title: '上传人脸图片',
                index: 3
            }
        },
        // 物业
        {
            path: '/deviceState',
            name: 'deviceState',
            component: () => import('@/views/res_ppt/device_check/deviceState'),
            meta: {
                title: '巡检报告',
                index: 4
            }
        },
        {
            path: '/deviceSuccess',
            name: 'deviceSuccess',
            component: () => import('@/views/res_ppt/device_check/deviceSuccess'),
            meta: {
                title: '巡检报告',
                index: 4
            }
        },
        {
            path: '/deviceReport',
            name: 'deviceReport',
            component: () => import('@/views/res_ppt/device_check/deviceReport'),
            meta: {
                title: '巡检报告',
                index: 4
            }
        },
        {
            path: '/carNumber',
            name: 'carNumber',
            component: () => import('@/views/carNumber'),
            meta: {
                title: '绑定车牌号',
                index: 2
            }
        },
        {
            path: '/carPayMoney',
            name: 'carPayMoney',
            component: () => import('@/views/carPayMoney'),
            meta: {
                title: '停车缴费',
                index: 2
            }
        },
        {
            path: '/notices',
            name: 'notices',
            component: () => import('@/views/notices'),
            meta: {
                title: '消息公告',
                index: 1
            }
        },
        {
            path: '/applyVisit',
            name: 'applyVisit',
            component: () => import('@/views/applyVisit'),
            meta: {
                title: '访客申请',
                index: 2
            }
        },
        {
            path: '/visitRecord',
            name: 'visitRecord',
            component: () => import('@/views/visitRecord'),
            meta: {
                title: '访客记录',
                index: 2
            }
        },
        {
            path: '/passPermit',
            name: 'passPermit',
            component: () => import('@/views/passPermit'),
            meta: {
                title: '通行证',
                index: 2
            }
        },
        {
            path: '/visitDetail',
            name: 'visitDetail',
            component: () => import('@/views/visitDetail'),
            meta: {
                title: '访客记录详情',
                index: 2
            }
        },
        {
            path: '/productCode',
            name: 'productCode',
            component: () => import('@/views/productCode'),
            meta: {
                title: '二维码生成',
                index: 2
            }
        },
        {
            path:'/invoiceProviding',
            name:'invoiceProviding',
            component: () => import('@/views/invoice/invoiceProviding'),
            meta:{
                title:'开具发票',
                index:3
            }
        },
        {
            path:'/invoiceHistory',
            name:'invoiceHistory',
            component: () => import('@/views/invoice/invoiceHistory'),
            meta:{
                title:'开票历史',
                index:3
            }
        },
        {
            path:'/onlineInvoicing',
            name:'onlineInvoicing',
            component: () => import('@/views/invoice/onlineInvoicing'),
            meta:{
                title:'在线开票',
                index:4
            }
        },
        {
            path:'/billingInformation',
            name:'billingInformation',
            component: () => import('@/views/invoice/billingInformation'),
            meta:{
                title:'开票信息',
                index:5
            }
        },
        {
            path:'/invoiceDetails',
            name:'invoiceDetails',
            component: () => import('@/views/invoice/invoiceDetails'),
            meta:{
                title:'开票详情',
                index:6
            }
        }
    ]
})
