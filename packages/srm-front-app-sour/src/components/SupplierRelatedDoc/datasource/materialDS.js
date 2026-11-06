/*
 * @Date: 2023-01-31 09:49:37
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { SrmUtil, $T } from "srm-mobile-ui";

function materialDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldName: $T("hzero.common.status").$D("状态"),
        fieldCode: "authReqStatusCodeMeaning",
      },
      {
        fieldName: $T("sslm.material.model.material.num").$D("物料认证单号"),
        fieldCode: "reqHeaderNum",
      },
      {
        fieldName: $T("sslm.material.model.material.currentStage").$D("当前阶段"),
        fieldCode: "nodeCodeMeaning",
      },
      {
        fieldName: $T("sslm.material.model.material.category").$D("采购品类"),
        fieldCode: "categoryName",
      },
      {
        fieldName: $T("sslm.common.view.company.fieldCode").$D("公司"),
        fieldCode: "companyName",
      },
    ],
    transport: {
      read: {
        url: "/smdm/v1/{tenantId}/item-auth-req-headers/req_headder_recognition",
        method: "get",
      },
    },
  };
}

export default materialDS;