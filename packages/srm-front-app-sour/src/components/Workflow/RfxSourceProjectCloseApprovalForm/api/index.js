import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取基础信息
export const getBasicInfoApi = ({ sourceProjectId, customizeUnitCode }) => {
  const params = { customizeUnitCode };
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/source-projects/project/close/detail/${sourceProjectId}`;
  return http.get(url, { params });
};