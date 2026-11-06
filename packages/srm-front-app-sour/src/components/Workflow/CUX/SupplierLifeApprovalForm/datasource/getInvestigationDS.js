/*
 * @Date: 2022-11-24 19:51:52
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

export const getInvestigationDS = () => ({
  editable: false,
  enableQuery: false,
  fields:[
    {
      fieldCode: "investgNumber",
      fieldName: $T("scux.supplierQuery.modal.investigation.number").$D("调查表编号"),
    },
  ],
  transport:{
    read:{
      url: `/sslm/v1/${organizationId}/life-cycle/qualified/supplier-investg-info`,
      method: "GET"
    },
  },
});