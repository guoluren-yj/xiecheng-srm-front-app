import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const organizationId = storage.getItem("organizationId");

/*
查询操作记录数据
*/
export const fetchHistory = (planId) => {
  const url = `/spuc/v1/${organizationId}/plan-actions/${planId}`;
  return http.get(url);
};

