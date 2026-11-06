import { http, SrmUtil } from "srm-mobile-ui";

// 获取头部数据
export const getOrderAcceptApprovalHeadDetail = (acceptHeaderId) => {
    return http.get(`/scux2/v1/${SrmUtil.getTenantId()}/ldjt/header-detail/${acceptHeaderId}`);
};

// 获取行数据
export const getAcceptLineDetail = (acceptHeaderId) => {
    return http.get(`/scux2/v1/${SrmUtil.getTenantId()}/ldjt/line-detail/${acceptHeaderId}`);
};

