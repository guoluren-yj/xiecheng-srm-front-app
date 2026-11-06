/*
 * @Date: 2024-08-29 15:52:11
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { isEmpty } from "lodash";
import { $T, SrmUtil } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";
const tenantId = SrmUtil.getTenantId();

export const getParticipSupplierDs = ({ evalHeaderId, evalGranularity }) => ({
  autoQuery:true,
  editable: false,
  enableQuery: false,
  pageSize: 5,
  queryParameter:{
    customizeUnitCode: "SSLM.APPRAISAL_PURCHASER_DETAIL.PARTICIP_SUPPLIER_LIST"
  },
  fields: [
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.venderCode").$D("供应商编码"),
      fieldCode: "supplierNum",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.venderName").$D("供应商名称"),
      fieldCode: "supplierName",
    },
    {
      fieldCode: "itemOrCategoryVOS",
      fieldName:
        evalGranularity === "SU+CA" ?
          $T("spfm.supplierKpiIndicator.view.button.category").$D("参评品类") :
          $T("spfm.supplierKpiIndicator.view.button.item").$D("参评物料"),
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${tenantId}/eval-line/eval-manage/${evalHeaderId}`,
      method: "GET",
    },
  },
});

export const getParticipSupplierColumns = (evalGranularity) => [
  {
    fieldCode: "supplierNum",
  },
  {
    fieldCode: "supplierName",
  },
  {
    fieldCode: "itemOrCategoryVOS",
    visible:[ "SU+CA", "SU+IT" ].includes(evalGranularity),
    render:(val, data) => {
      const { itemOrCategoryList } = data;
      if (!isEmpty(itemOrCategoryList)) {
        return itemOrCategoryList.map((n) => n.itemName || n.categoryName).join("、");
      }
      return "-";
    }
  },
];
