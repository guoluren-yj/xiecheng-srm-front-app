import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 查询开标
export const getTenderApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/${bidHeaderId}/open`;

  return http.get(url);
};