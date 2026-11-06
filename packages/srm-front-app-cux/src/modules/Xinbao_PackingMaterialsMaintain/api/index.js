
import { http } from "srm-mobile-ui";

const storage = window.localStorage;


// 获取供货明细列表
export const savePackingMaterialApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/donlim-asn-items/save`;

  return http.post(url, params);
};
