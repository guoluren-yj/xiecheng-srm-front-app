/**
 * 与【验货通知单】相关的业务接口
 */

import { http } from "srm-mobile-ui";
const storage = window.localStorage;


// 获取供货明细列表
// export const getSupplyDetailListApi = (params) => {
//     const url = `/scux/v1/${storage.getItem('organizationId')}/sanjiang-supply-details/list`;
//     return http.get(url, {params});
// }

//验货通知列表
export const getInspectNoticeListApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/sumec-qqc-lines/qc-wait-submit`;
    return http.get(url,{params});
}

//验货头信息
export const getInspectNoticeHeaderApi = (qqcHeaderId,params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/sumec-qqc-headers/single/${qqcHeaderId}`;
    return http.get(url,{params});
}

//验货单行信息
export const getInspectNoticeLineApi = (qqcHeaderId,params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/sumec-qqc-lines/${qqcHeaderId}`;
    return http.get(url,{params});
}
//验货单操作记录信息
export const getInspectOperationApi = (qqcReqId,params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/sumec-qqc-actions/${qqcReqId}`;
    return http.get(url,{params});
}

//验货保存
export const saveInspectApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/sumec-qqc-lines/qc-update`;
    return http.post(url,params);
}

//验货提交
export const submitInspectApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/sumec-qqc-lines/qa-submit`;
    return http.post(url,params);
}

