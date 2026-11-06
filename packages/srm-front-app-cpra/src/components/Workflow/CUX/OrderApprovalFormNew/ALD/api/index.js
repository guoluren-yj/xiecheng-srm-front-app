import { http, SrmUtil } from "srm-mobile-ui";
const storage = window.localStorage;
// 订单审批明细头查询
export const getOrderHeaderApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-header/${poHeaderId}/detail`;
  return http.get(url, { params });
};

// 操作记录
export const getPoProcessActions = (headerId) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-process-actions/${headerId}`;
  return http.get(url, {
    params: {
      page: 0,
      size: 100000,
      tenantId: SrmUtil.getTenantId(),
    },
  });
};

/**
 * 查询是否开启双单位配置
 * @function queryDoubleUomConfig
 * @returns {object} fetch Promise 0不开启双单位，1上下游和订单都开启，2仅订单开启
 */
export const queryDoubleUomConfigApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/secondary/getcnf`;
  return http.get(url, { params });
};

/**
 * 获取是否有最新价格
 * @param {String} poHeaderId 订单头id
 * @returns {object} fetch Promise
 */
export const getLastPrice = ({ poHeaderId, params }) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/price-update-list`;
  return http.get(url, { params });
};