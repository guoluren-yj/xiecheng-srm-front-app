import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取监控列表
export const fetchSaveSupQuo = (params) => {
  const url = `/marmot/v1/${storage.getItem("organizationId")}/marmot-api/VoCDUwk4OesoYm9MbFqaGU6OjpeZS1vhZkicI8RZicCcMTiahDph05Jw6ZvrFaHxk0u`;
  return http.post(url, params);
};

// AI智能审核
export const intelligentReviewSearch = (params) => {
  const url = `/marmot/v1/${storage.getItem("organizationId")}/marmot-api/LzyBXJVialASiaLuY2UgcPNY8DdQYUABPhiaUH9kTibS4nA4L2FsgFas0u0gxyHRrrS9`;
  return http.post(url, params);
};