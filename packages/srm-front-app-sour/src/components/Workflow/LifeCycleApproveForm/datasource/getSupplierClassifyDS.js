/*
 * @Date: 2022-12-08 15:12:22
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

export const getSupplierClassifyDS = ({ requisitionId }) => ({
  selection: Infinity,
  pageSize: 5,
  autoQuery: true,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "categoryDescription",
      fieldName: $T("sslm.commonApplication.model.coApp.SupplierCategoryDes").$D("供应商分类描述"),
      fieldType: "TREE",
      required:true,
      lovCode: "SSLM.SUPPLIER_CATEGORY_TREE",
      options: {
        displayField: "categoryDescription",
        valueField: "categoryDescription",
        callback:(val, fieldCode, display, ds) => {
          if (val) {
            ds.current.setField("supplierCategoryId", val[0].supplierCategoryId);
            ds.current.setField("categoryCode", val[0].categoryCode);
            ds.current.setField("evaluationLevelFlag", val[0].evaluationLevelFlag);
            ds.current.setField("evaluationScoreFlag", val[0].evaluationScoreFlag);
          }
        },
        onClear:(ds) => {
          const supplierCategoryId = ds.current.getField("supplierCategoryId");
          const categoryCode = ds.current.getField("categoryCode");
          const evaluationLevelFlag = ds.current.getField("evaluationLevelFlag");
          const evaluationScoreFlag = ds.current.getField("evaluationScoreFlag");
          supplierCategoryId.setData(null);
          categoryCode.setData(null);
          evaluationLevelFlag.setData(null);
          evaluationScoreFlag.setData(null);
        },
      },
    },
    {
      fieldCode: "evaluationLevel",
      fieldType: "SELECT",
      lovCode: "SSLM.EVALUATION_LEVEL",
      required: (val, item) => Boolean(item.evaluationLevelFlag),
      fieldName: $T("sslm.commonApplication.model.coApp.level").$D("评级"),
    },
    {
      fieldCode: "evaluationScore",
      fieldType:"INPUT_NUMBER",
      required: (val, item) => Boolean(item.evaluationScoreFlag),
      fieldName: $T("sslm.commonApplication.model.coApp.score").$D("评分"),
    },
    {
      fieldCode: "enabledFlag",
      fieldType:"SWITCH",
      fieldName: $T("hzero.common.status.enable").$D("启用"),
    },
    {
      fieldCode: "alterDate",
      fieldName: $T("sslm.commonApplication.model.coApp.alterDate").$D("变更时间"),
    },
    {
      fieldCode: "alterReason",
      fieldName: $T("sslm.commonApplication.model.coApp.alterReason").$D("变更理由"),
    },
    {
      fieldCode: "realName",
      fieldName: $T("sslm.commonApplication.model.coApp.alterUserName").$D("变更人"),
    },
  ],
  transport: {
    read: {
      url: `sslm/v1/${organizationId}/life-cycle-change-ctg-alter-lines/${requisitionId}`,
      method: "GET",
      params:{ customizeUnitCode:"SSLM.LIFE_CYCLE.DOCUMENTS_DETAIL.SUPPLIER_CLASSIFY" }
    },
  },
});
