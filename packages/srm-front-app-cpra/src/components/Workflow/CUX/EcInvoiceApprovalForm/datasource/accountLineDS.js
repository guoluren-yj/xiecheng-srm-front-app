
import { $T, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

export default (invoiceHeaderId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "smallBusinessName",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.smallBusinessName").$D("业务小类"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.companyName").$D("公司名称"),
    },
    {
      fieldCode: "departmentName",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.departmentName").$D("部门名称"),
    },
    {
      fieldCode: "projectName",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.projectName").$D("项目名称"),
    },
    {
      fieldCode: "capitalName",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.capitalName").$D("资金来源"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "licenseCar",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.licenseCar").$D("车牌号"),
    },
    {
      fieldCode: "amount",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.amount").$D("不含税金额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "taxRate",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxRate").$D("税率"),
    },
    {
      fieldCode: "taxAmount",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxAmount").$D("税额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "taxAmountSum",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxAmountSum").$D("价税合计"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "dfiag",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.dfiag").$D("是否可抵扣"),
      render: (val) => val === "false" ? $T("smbl.common.view.no").$D("否") : $T("smbl.common.view.yes").$D("是"),
    },
    {
      fieldCode: "rflag",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.rflag").$D("是否转出"),
      render: (val) => val === "false" ? $T("smbl.common.view.no").$D("否") : $T("smbl.common.view.yes").$D("是"),
    },
    {
      fieldCode: "remake",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.remake").$D("备注"),
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${tenantId}/yx-invoice-accounts-detail/page-ec?asyncCountFlag=DEFAULT&headId=${invoiceHeaderId}`,
      method: "GET",
    },
  },
});