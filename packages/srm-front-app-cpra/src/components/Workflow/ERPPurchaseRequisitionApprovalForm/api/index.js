import { http, SrmUtil } from "srm-mobile-ui";

// 采购申请单请求
export const getPurchaseRequestApi = (id) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-request/${id}`;
  let params = {
    customizeUnitCode: "SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.HEADER,SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.HEARDER_ERP",
    workFlowFlag: 1,
  };
  return http.get(url, { params });
};

// 采购申请单行信息请求
export const getPurchaseRequestLinesApi = (id) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/${id}/lines`;
  let params = {
    customizeUnitCode: "SPRM.PURCHASE_PLAFORM_QUERY.PURCHASELINE,SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.LINE_ERP",
    page: 0,
    size: 1000,
    prSourcePlatformCode: "SRM",
    workFlowFlag: 1,
  };
  return http.get(url, { params });
};

// 获取操作记录
export const getOperatingRecordsApi = (id) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/${id}/actions`;
  let params = {
    page: 0,
    size: 1000,
    prHeaderId: id,
  };
  return http.get(url, { params });
};
