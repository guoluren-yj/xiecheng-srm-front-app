/*
 * @Date: 2024-08-15 17:41:41
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { http, SrmUtil } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";

const organizationId = SrmUtil.getTenantId();

// 根据不同考评颗粒度+维度，查询维度数据
export const fetchDimensionList = ({ dimension, evalHeaderId, ...rest }) => {
  const type = dimension === "CA" ? "category" : dimension === "IT" ? "item" : "supplier";
  const url = `${SRM_SSLM}/v1/${organizationId}/eval-line/${type}/${evalHeaderId}`;
  return http.get(url, { params:rest });
};

// 查询基础信息
export const fetchBasic = ({ evalHeaderId, ...rest }) => {
  const url = `${SRM_SSLM}/v1/${organizationId}/eval-headers/detail/${evalHeaderId}`;
  return http.get(url, { params:{ customizeUnitCode: "SSLM.APPRAISAL_PURCHASER_DETAIL.BASIC", ...rest } });
};