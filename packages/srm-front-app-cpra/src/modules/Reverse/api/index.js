
import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

// 获取送货单列表
export const getAsnListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/rcv-trx-header/permit-reverse-asn-line`;
  return http.get(url, { params });
};

// 获取送货单类型
export const getAsnTypeApi = () => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/value?lovCode=SINV.ASN_TYPE`;
  return http.get(url);
};

// 冲销预览校验
export const writeVerificationApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/rcv-trx-header/writeVerification`;
  return http.get(url, { params });
};

// 获取送货单行信息
export const getListDetailApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/rcv-trx-line/permit-reverse`;
  return http.get(url, { params });
};

// 冲销
export const reverseApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/rcv-trx-header/reverse-rcv-trx?customizeUnitCode=SODR.WRITE_OFF_DETAIL.GRID`;
  return http.post(url, params);
};
