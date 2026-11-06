// 存放公共api
import { http, SrmUtil } from "srm-mobile-ui";
import { SRM_HPFM } from "@/utils/utils";

// import { SRM_SSRC, SRM_PLATFORM } from "_utils/config";

const SRM_PLATFORM = "/spfm";
const SRM_SSRC = "/ssrc";

const storage = window.localStorage;

// 判断是否开启双单位
export const queryEnableDoubleUnit = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/secondary/uom/isEnable`;
  return http.get(url, {
    params
  });
};

// 双单位计算基本数量
export async function calculateQuantity(params) {
  const { tenantId = storage.getItem("organizationId") } = params[0];
  const url = `/smdm/v1/${storage.getItem("organizationId")}/items/uom/calculate/quantity?tenantId=${tenantId}`;
  return http.post(url, params);
}

// 查询个性化
export const queryCustomize = (params) => {
  let url = `/hpfm/v1/${SrmUtil.getTenantId()}/ui-customize`;
  return http.get(url, { params });
};

// 查询个性化配置
export async function queryCustomizePost(params) {
  const url = `${SRM_HPFM}/v1/${storage.getItem("organizationId")}/ui-customize`;
  return http.post(url, params);
}

// 查业务规则定义-批量
export const batchBusinessRules = (params = {}) => {
  const { organizationId, query = {}, data, } = params || {};
  const url = `${SRM_PLATFORM}/v1/${organizationId}/cnf/do-execute/batch`;
  return http.post(url, data, { params: query, });
};

// ssrc 查业务规则定义-批量
export const ssrcBatchBusinessRules = (params = {}) => {
  const { organizationId, data, query = {}, } = params || {};
  const url = `${SRM_SSRC}/v1/${organizationId}/share/common/do-execute/batch`;
  return http.post(url, data, { params: query, });
};

// 查询精度
export async function queryPrecision(params) {
  const url = `${SRM_SSRC}/v1/${SrmUtil.getOrganizationId()}/precision`;
  return http.get(url, { params });
}

export const getLovApi = (params) => http.get(`/hpfm/v1/${SrmUtil.getTenantId()}/lovs/value/batch`, { params });

/**
 * 获取建立WebSocket所需要的_sac值
 * @return {String} _sac   _sac值
 */
// 竞价大厅 供应商 节点
export const getSRMAccessCode = (params = {}) => {
  const url = "/oauth/public/_sac/generate";
  return http.get(url, { params, }).then((res) => {
    if (res && !res.failed) {
      const { _sac } = res;
      return _sac;
    }
  });
};

// 查询配置表
export const fetchConfigSheet = (params = {}) => {
  const { configCode, query = {}, data = {}, } = params || {};
  const url = `/spfm/v1/${SrmUtil.getOrganizationId()}/rel-table-records/${configCode}/list-from-site`;
  return http.post(url, data, { params: query, });
};
