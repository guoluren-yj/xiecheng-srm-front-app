import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取基础信息
export const getBasisInfoApi = (params) => {
  const url = `/ssta/v1/${storage.getItem(
    "organizationId"
  )}/deposits/workflow/detail`;
  return http.get(url, { params });
};
