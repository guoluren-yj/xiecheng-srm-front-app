/*
 * @Description: 费用结算工作流-核算明细 DataSet
 * @Date: 2022-04-27 09:57:01
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
 */

import { $T, SrmUtil } from "srm-mobile-ui";
import { isNil } from "lodash";
import { yesOrNoRender } from "@/utils";

const tenantId = SrmUtil.getTenantId();

export default (headId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  queryParameter: { headId },
  fields: [
    {
      fieldCode: "smallBusinessName",
      fieldName: $T("scux.contractorAssessKpi.created.model.smallBusinessName").$D("业务小类"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "companyName",
      fieldName: $T("scux.contractorAssessKpi.created.model.companyName").$D("公司名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "departmentName",
      fieldName: $T("scux.contractorAssessKpi.created.model.departmentName").$D("部门名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "projectName",
      fieldName: $T("scux.contractorAssessKpi.created.model.projectName").$D("项目名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "capitalName",
      fieldName: $T("scux.contractorAssessKpi.created.model.capitalName").$D("资金来源"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "licenseCar",
      fieldName: $T("scux.contractorAssessKpi.created.model.licenseCar").$D("车牌号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "amount",
      fieldName: $T("scux.contractorAssessKpi.created.model.amount").$D("不含税金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxRate",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxRate").$D("税率"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxAmount").$D("税额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxAmountSum",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxAmountSum").$D("价税合计"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "dfiagMeaning",
      fieldName: $T("scux.contractorAssessKpi.created.model.dfiag").$D("是否可抵扣"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "rflagMeaning",
      fieldName: $T("scux.contractorAssessKpi.created.model.rflag").$D("是否转出"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "remake",
      fieldName: $T("scux.contractorAssessKpi.created.model.remake").$D("备注"),
      fieldType: "TEXT",
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${tenantId}/yxCostInvoice/detail/accounts`,
      method: "GET",
    },
  },
  events: {
    afterQuery: (_, data) => data.map((item) => {
      const meaningData = {};
      [ "dfiag", "rflag" ].forEach((valueField) => {
        const value = item[valueField];
        if (!isNil(value)) {
          meaningData[`${valueField}Meaning`] = yesOrNoRender(value === "true");
        }
      });
      return { ...item, ...meaningData };
    })
  }
});