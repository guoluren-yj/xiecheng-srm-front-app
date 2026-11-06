
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

/**白家 索赔改判 接口*/

// 索赔改判头信息
export const getClaimFormHeaderApi = (id, params) => {
  const url = `/sqam/v1/${storage.getItem("organizationId")}/claim-form/approval/detail/${id}`;
  return http.get(url, { params });
};

// 索赔改判行信息
export const getClaimFormLineApi = (id, params) => {
  const url = `/sqam/v1/${storage.getItem("organizationId")}/claim-form-lines/approval/detail/${id}`;
  return http.get(url, { params });
};
