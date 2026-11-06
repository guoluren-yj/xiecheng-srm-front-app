
import { http } from "srm-mobile-ui";

// const bucketName = "private-bucket";
const storage = window.localStorage;

/**现场考察审批接口*/

// 获取现场考察报告基本信息、考察结果信息
export const getSiteInspectionBaseApi = (id) => {
  const customizeUnitCode = "SSLM_SITEINVESTIGATEREPORT.BASICINFO,SSLM_SITEINVESTIGATEREPORT.INSPECTRESULTS";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-headers/${id}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};

// 获取现场考察报告物料/品类信息
export const getSiteInspectionItemApi = (id, page = 0, size = 10) => {
  const params = { page, size };
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-item-cates/${id}`;
  return http.get(url, { params });
};

// 获取现场考察小组信息
export const getSiteInspectionGroupsApi = (id, page = 0, size = 10) => {
  const params = { page, size };
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-groups/${id}`;
  return http.get(url, { params });
};

// 获取评分信息
export const getSiteInspectionLinesApi = (id) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-lines/${id}`;
  return http.get(url);
};

// 获取评分人、评分状态信息
export const getSiteInspectionRespsApi = (evalLineId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-line-resps/${evalLineId}`;
  return http.get(url);
};

// 获取现场考察详情页附件数据
export const getFileInfoApi = (id, params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-att-lns/${id}`;
  return http.get(url, { params });
};

