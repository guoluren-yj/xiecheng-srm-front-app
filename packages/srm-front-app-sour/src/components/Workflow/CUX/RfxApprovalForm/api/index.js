
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取询价单/招投标专家分配信息
export const getExpertAssignedApi = (evaluateIndicCategory, evaluateIndicId, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-assigns?evaluateIndicCategory=${evaluateIndicCategory}&evaluateIndicId=${evaluateIndicId}&sourceHeaderId=${sourceHeaderId}`;
  return http.get(url);
};
