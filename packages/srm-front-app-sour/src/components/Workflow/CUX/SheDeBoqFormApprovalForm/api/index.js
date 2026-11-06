import { http, SrmUtil } from "srm-mobile-ui";

// 模具主数据明细
export const update = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/RVibVzx5fEp8Jx1HHbcjIiaHYg1VnUfEqo229AdHq0MMI`;
  return http.post(url, params);
};

// 【舍得】报错校验
export async function shedeCheckApplication(params) {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/ZbnQE6y7Y06awqPiaB1LUb9RibuibPIq4kLMWQhejqMAFY`;
  return http.get(url, params);
}