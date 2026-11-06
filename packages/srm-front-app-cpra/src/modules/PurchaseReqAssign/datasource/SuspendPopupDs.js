/*
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-04 16:39:37
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-08 10:42:54
 */
// 分配列表
import { $T } from "srm-mobile-ui";

function suspendPopupDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: true,
    editFlag: true,
    enableQuery: false,
    fields: [
      {
        fieldCode: "suspendRemark",
        fieldName: $T("sprm.purchaseRequisitionAssign.model.common.assignedRemark").$D("分配说明"),
        fieldType: "TEXT_AREA",
      },
    ],
    // transport: {
    //   read: {
    //     url: `/sprm/v1/${SrmUtil.getTenantId()}/purchase-request/line/can-assign/page`,
    //     method: "get",
    //   },
    // },
  };
}

export {
  suspendPopupDS,
};