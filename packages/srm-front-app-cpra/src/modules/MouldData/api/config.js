// 获取pc端业务规则配置
import { http, SrmUtil } from "srm-mobile-ui";
const { getTenantId } = SrmUtil;
const tenantId = getTenantId();

// 查询状态机配置表信息和初始状态对应的操作
export const queryInitialStateCorrespondingOperation = (params) => {
    let url = `/siec/v1/${tenantId}/status-interaction/queryInitialStateCorrespondingOperation`;
    return http.get(url, { params: params });
};

// 获取界面展示的相关信息
export const queryPageInfo = (params) => {
  let url = `/siec/v1/${tenantId}/status-interaction/queryPageInfo`;
  return http.get(url, { params: params });
};