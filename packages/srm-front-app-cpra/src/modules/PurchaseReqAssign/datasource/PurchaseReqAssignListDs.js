/*
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-04 16:39:37
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-22 15:19:02
 */
// 分配列表
import { SrmUtil, $T } from "srm-mobile-ui";

function purchaseRequisitionListDS() {
  return {
    autoQuery: false,
    pageSize: 10,
    selection: Infinity,
    editable: true,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    filterCustomizeCode: "SMBL.PURCHASEREQ.ASSIGN.SEARCH",
    queryParameter: {
      customizeUnitCode: "SPRM.PURCHASE_EXECUTION.NOTASSIGN.LIST,SPRM.PURCHASE_EXECUTION.NOTASSIGN.FILTER",
      prCustomizeFilterFlag: 1,
      erpControlFlag: 1,
    },
    fastQueryField: {
      fieldCode: "multiSelectHeaderAndLineNums",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.prNumAndLineNum").$D("采购申请单号-行号"),
    },
    queryFields: [
      {
        fieldCode: "tempKey",
        fieldName: $T("sprm.common.model.common.supplierName").$D("供应商名称"),
        fieldType: "LOV",
        lovCode: "SPRM.SUPPLIER_REFORM_KEY",
        displayField: "displaySupplierName",
        options: {
          multiple: false,
          subDisplayField: "displaySupplierName",
          valueField: "tempKey",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              if (val[0].supplierId) {
                ds.addQueryParameter("supplierId", val[0].supplierId || null);
              }
              if (val[0].supplierCompanyId) {
                ds.addQueryParameter("supplierCompanyId", val[0].supplierCompanyId || null);
              }
              ds.addQueryParameter("tempkey", val[0].tempKey || null);
              ds.addQueryParameter("supplierTenantId", val[0].supplierTenantId || null);
              ds.addQueryParameter("displaySupplierName", val[0].displaySupplierName || null);
            }
          },
          onClear: (ds) => {
            ds.addQueryParameter("supplierId", null);
            ds.addQueryParameter("supplierCompanyId", null);
            ds.addQueryParameter("tempkey", null);
            ds.addQueryParameter("supplierTenantId", null);
            ds.addQueryParameter("displaySupplierName", null);
          }
        }
      },
    ],
    transport: {
      read: {
        url: `/sprm/v1/${SrmUtil.getTenantId()}/purchase-request/line/can-assign/page?waitAssignRequestFlag={waitAssignRequestFlag}&prLineStatusCode={prLineStatusCode}`,
        method: "get",
      },
    },
  };
}

export {
  purchaseRequisitionListDS,
};