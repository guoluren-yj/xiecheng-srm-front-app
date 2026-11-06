import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取基础信息
export const getBasisInfoApi = ({ sourceProjectId, customizeUnitCode }) => {
  const params = { customizeUnitCode };
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/source-projects/${sourceProjectId}`;
  return http.get(url, { params });
};

// 获取报价明细信息
export const getQuotaionDetailInfoApi = (sourceProjectId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${sourceProjectId}/quotationTemplate/view`;
  return http.get(url, { params });
};