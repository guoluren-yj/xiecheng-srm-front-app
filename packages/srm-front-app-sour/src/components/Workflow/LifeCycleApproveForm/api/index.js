/*
 * @Date: 2023-10-10 11:51:39
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 基础信息查询
export const fetchBasicInfoApi = (requisitionId) => {
  const url = `sslm/v1/${storage.getItem("organizationId")}/life-cycle-change-reqss/${requisitionId}`;
  return http.get(url, { params:{ customizeUnitCode:[
    "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.BASE_INFO",
    "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.OTHER_INFO",
    "SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.STATUS_INFO",
  ].join() } });
};

// 查询供货能力清单行附件
export const fetchAbilityAttachment = ({ requisitionId, supplyRecordId }) => {
  const url = `sslm/v1/${storage.getItem("organizationId")}/life-cycle-change-ability-item-ln-atts/${requisitionId}/${supplyRecordId}`;
  return http.get(url, { params:{ page:0, size:0 } });
};

// 查询采购财务头信息
export const fetchPurchaseHeader = (requisitionId) => {
  const url = `sslm/v1/${storage.getItem("organizationId")}/life-cycle-change-syncs/${requisitionId}`;
  return http.get(url, { params:{ customizeUnitCode:"SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.PURCHASE_INFO" } });
};

// 删除供应商分类
export const deleteClassify = (params) => {
  const { requisitionId, data } = params;
  const url = `sslm/v1/${storage.getItem("organizationId")}/life-cycle-change-ctg-alter-lines/${requisitionId}?customizeUnitCode=SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.SUPPLIER_CLASSIFY`;
  return http.delete(url, data);
};

// 保存申请单
export async function saveApplication(params) {
  const { customizeUnitCode, ...rest } = params;
  const url = `sslm/v1/${storage.getItem("organizationId")}/life-cycle-change-reqss?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, rest);
}

// 【舍得】报错校验
export async function shedeCheckApplication(params) {
  const url = `/marmot/v1/${storage.getItem("organizationId")}/marmot-api/LfzjbdlutPD5aTlAPcbTl5qn2F2ibUuNNJ0b81kCtMmA`;
  return http.get(url, params);
}

