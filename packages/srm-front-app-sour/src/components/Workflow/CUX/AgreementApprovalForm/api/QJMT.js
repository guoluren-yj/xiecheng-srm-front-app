
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const getJumpDataList = (params) => {
  const url = `/marmot/v1/${storage.getItem("organizationId")}/marmot-api/UGtKIIdBGD81mdAbxciaN16HAUa0icxcHmfPYxBqabvqk`;
  return http.post(url, params);
};