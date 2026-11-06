
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 供应商信息变更接口
// 供应商申请头信息
export const getHeadInfoApi = (changeReqId, params) => {
  if (!params) {
    // eslint-disable-next-line no-param-reassign
    params = {
      flexRuleCode: "SSLM.SUPPLIER_INFO_CHANGE",
      tenantId: storage.getItem("tenantId")
    };
  }
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/supplier-change-reqs/firm-detail?changeReqId=${changeReqId}`, { params });
};

// 获取OU层信息
export const getOuInfoApi = (supChangeAddId) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-ebs-ous?page=0&size=10&supChangeAddId=${supChangeAddId}`);

// 获取其他信息
export const getOtherInfoApi = (changeReqId) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-others/getSupChangeOther?changeReqId=${changeReqId}&customizeUnitCode=SSLM.SUPPLIER_INFORM_CHANGE_DETAIL.OTHER_INFO_FORM`);

// 获取地点层信息
export const getAddressInfoApi = (changeReqId) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/address?changeReqId=${changeReqId}`);

// 获取供货能力清单
export const getSupplyCapacityListApi = (changeReqId) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/ability?changeReqId=${changeReqId}`);
