/**
 * @Author: 杨一昊 yihao.yang@going-link.com
 * @Date: 2022-12-20 10:26:24
 * @Copyright (c) 2022 by ZhenYun, All Rights Reserved.
 */
import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// 获取供应商基本信息
const getBasicInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem(
    "organizationId"
  )}/supplier-quota-headers/${params.quotaHeaderId}`;

  return http.get(url, { params });
};

export { getBasicInfoApi };
