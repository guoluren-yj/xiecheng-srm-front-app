import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取基础信息
export const getBasicInfoApi = (params) => {
  const url = `marmot/v1/${storage.getItem("organizationId")}/marmot-api/W8LtictUd7LktFCMA7vibydPuibr2pvA21RqibFoIOvvlhsjEh3NzKkkh3XaIjA1MFEm`;
  return http.get(url, { params });
};