import { http, SrmUtil } from "srm-mobile-ui";

// 收货汇总确认
const toConfirm = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/CfYoAicBDhm5c9yuUFiat2gkj5icKrJnlWYrPnjK8yIvh8`;

  return http.post(url, params);
};

// 收货汇总取消确认
const toCencal = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/CfYoAicBDhm5c9yuUFiat2greIvyoHcttzVPv63LjoDNgTiahDph05Jw6ZvrFaHxk0u`;

  return http.post(url, params);
};

// 收货汇总不良项保存
const toSave = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/CfYoAicBDhm5c9yuUFiat2guL1J12xoNrwWMpG3elrkJg`;

  return http.post(url, params);
};

// 收货汇总不良项删除
const toDelete = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/CfYoAicBDhm5c9yuUFiat2gkMFw9cyB4icHmxNOvVHCoR0TiahDph05Jw6ZvrFaHxk0u`;

  return http.post(url, params);
};

export {
  toConfirm,
  toCencal,
  toSave,
  toDelete,
};
