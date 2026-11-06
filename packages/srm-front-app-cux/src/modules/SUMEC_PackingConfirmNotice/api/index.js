/**
 * 与 【装箱/装柜通知】相关的业务接口
 */

import { http } from "srm-mobile-ui";
const storage = window.localStorage;

//装箱/装柜通知头信息
export const getPackConfirmNoticeHeadApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/cux/sumec/encasement-headers/create`;
    return http.get(url,{params});
}

//装箱/装柜通知行信息
export const getPackConfirmNoticeLineApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/cux/sumec/encasement-lines/detail`;
    return http.get(url,{params});
}

//装箱/装柜通知汇总信息
export const getPackConfirmNoticeSummaryLineApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/cux/sumec/encasement-lines/summary`;
    return http.get(url,{params});
}

//装箱/装柜通知汇总信息详情
export const getPackSummaryDetailLineApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/cux/sumec/encasement-lines/container`;
    return http.get(url,{params});
}

//装箱/装柜通知单操作记录信息
export const getPackConfirmNoticeOperationApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/cux/sumec/encasement-actions`;
    return http.get(url,{params});
}

//装箱/装柜通知单反馈
export const packConfirmNoticeFeedbackApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/cux/sumec/encasement-headers/feedback`;
    return http.post(url,params);
}

//装箱/装柜通知单确定
export const packConfirmNoticeConfirmApi = (params)=>{
    const url = `/scux/v1/${storage.getItem('organizationId')}/cux/sumec/encasement-headers/confirm`;
    return http.post(url,params);
}


