/* eslint-disable no-undefined */
import { SrmUtil, $T } from "srm-mobile-ui";
const tenantId = SrmUtil.getTenantId();
import { yesOrNoRender } from "@/utils";

const amountPrecision = (val, record) => val && record.amountPrecision;
const meaningRender = (_, record, { fieldCode }) => record[`${fieldCode}Meaning`];
const computedDaysRender = (_, record) => {
  const { statusCode, cancelDate, approvedDate, confirmedDate } = record;
  if (approvedDate) {
    if (confirmedDate) {
      const beforeDate = new Date(approvedDate).getTime();
      const currentDate = new Date(confirmedDate);
      const diffDay = currentDate.getTime() - beforeDate;
      return Math.floor(diffDay / 24 / 3600 / 1000);
    } else if (statusCode === "CANCELLED") {
      const beforeDate = new Date(approvedDate).getTime();
      const currentDate = new Date(cancelDate).getTime();
      const diffDay = currentDate - beforeDate;
      return Math.floor(diffDay / 24 / 3600 / 1000);
    }
    const beforeDate = new Date(approvedDate).getTime();
    const currentDate = new Date();
    const diffDay = currentDate.getTime() - beforeDate;
    return Math.floor(diffDay / 24 / 3600 / 1000);

  }
};

export const claimListDS = () => ({
  autoQuery: true,
  selection: Infinity,
  editable: true,
  fields: [
    {
      fieldCode: "statusCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.status").$D("状态"),
    },
    {
      fieldCode: "formNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.claimNum").$D("索赔单号"),
    },
    {
      fieldCode: "formTitle",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.formTitle").$D("索赔单标题"),
    },
    {
      fieldCode: "supplierCode",
      fieldType: "TEXT",
      fieldName: $T("entity.supplier.code").$D("供应商编码"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("entity.supplier.name").$D("供应商名称"),
    },
    {
      fieldCode: "claimTypeName",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.claimType").$D("索赔类型"),
    },
    {
      fieldCode: "currencyName",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.MoneyType").$D("币种"),
    },
    {
      fieldCode: "totalAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("sqam.common.model.claimSum").$D("索赔总额"),
    },
    {
      fieldCode: "appealedFlag",
      fieldName: $T("sqam.common.model.isToState").$D("是否申诉"),
      fieldType: "TEXT",
      render: yesOrNoRender,
    },
    {
      fieldCode: "appealedSum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.applyTimes").$D("申诉次数"),
    },
    {
      fieldCode: "appealContent",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.panel.statementContent").$D("申诉内容"),
      render: meaningRender,
    },
    {
      fieldCode: "appealHandleActionMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.applyDeal").$D("申诉处理"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("entity.company.name").$D("公司名称"),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("entity.business.tag").$D("业务实体"),
    },
    {
      fieldCode: "invOrganizationName",
      fieldType: "TEXT",
      fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
    },
    {
      fieldCode: "feedbackDate",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.date.requireFeedbackTime").$D("要求反馈时间"),
    },
    {
      fieldCode: "actualFeedbackDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.common.date.realFeedbackDate").$D("实际反馈日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "approvedDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("hzero.common.date.release").$D("发布日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "releaseDays",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.common.releaseDays").$D("已发布天数"),
      render: computedDaysRender,
    },
    {
      fieldCode: "confirmedDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.common.model.common.confirmedDate").$D("确认日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "appealedDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.common.date.statementDate").$D("申诉日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "appealHandledDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.common.date.statementDealDate").$D("申诉处理日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "feedbackOpinion",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.common.feedbackOpinion").$D("确认说明"),
    },
    {
      fieldCode: "syncStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.syncStatusMeaning").$D("同步状态"),
      render: (val, record) => {
        const { syncStatus } = record || {};
        return syncStatus && syncStatus === "SYNC_FAILURE" ?
          <div style={{ color: "#FE2E2E" }}>{val}</div> :
          <div>{val}</div>
        ;
      },
    },
    {
      fieldCode: "syncResponseMsg",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.syncResponseMsg").$D("同步反馈"),
    },
    {
      fieldCode: "dataSourceNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.common.dataSourceCode").$D("来源单号"),
    },
    {
      fieldCode: "executionBillNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.common.executionBillNums").$D("索赔执行单据"),
    },
    {
      fieldCode: "resultDate",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.resultDate").$D("索赔完成时间"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.date.creation").$D("创建时间"),
    },
    {
      fieldCode: "createName",
      fieldType: "TEXT",
      fieldName: $T("entity.roles.creator").$D("创建人"),
    },
    {
      fieldCode: "executeCondition",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.button.watchDetails").$D("查看执行情况"),
    },
  ],
  fastQueryField: [
    {
      fieldCode: "formNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.claimNum").$D("索赔单号"),
    }
  ],
  queryFields: [
    {
      fieldCode: "formTitle",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.formTitle").$D("索赔单标题"),
    },
    {
      fieldCode: "supplierRowNumId",
      fieldType: "LOV",
      fieldName: $T("entity.supplier.tag").$D("供应商"),
      lovCode: "SQAM.CLAIM_SUPPLIER_COMPANY",
      displayField: "erpSupplierName",
      options: {
        queryParams: { tenantId },
        callback: ([ item ], _, __, dataSet) => {
          const { supplierCompanyId, supplierId } = item || {};
          dataSet.addQueryParameter("supplierCompanyId", supplierCompanyId);
          dataSet.addQueryParameter("supplierId", supplierId);
        },
        onClear: (dataSet) => {
          dataSet.addQueryParameter("supplierCompanyId", undefined);
          dataSet.addQueryParameter("supplierId", undefined);
        },
      }
    },
    {
      fieldCode: "claimTypeId",
      fieldType: "LOV",
      fieldName: $T("sqam.common.model.claimType").$D("索赔类型"),
      lovCode: "SQAM.CLAIM_TYPE",
      valueField: "claimTypeId",
      displayField: "typeDesc",
      options: {
        queryParams: { tenantId },
      }
    },
    {
      fieldCode: "ouId",
      fieldType: "LOV",
      fieldName: $T("entity.business.tag").$D("业务实体"),
      lovCode: "SPRM.OU",
      valueField: "ouId",
      displayField: "ouName",
      options: {
        queryParams: { tenantId },
      }
    },
    {
      fieldCode: "companyId",
      fieldType: "LOV",
      fieldName: $T("entity.company.tag").$D("公司"),
      lovCode: "SPFM.USER_AUTH.COMPANY",
    },
    {
      fieldCode: "invOrganizationId",
      fieldType: "LOV",
      fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
      lovCode: "SPRM.INV_ORG",
    },
    {
      fieldCode: "creationDateFrom",
      fieldType: "DATE_PICKER",
      fieldName: $T("hzero.common.date.creation").$D("创建日期"),
      selectType: "start-end",
      endDateFieldCode: "creationDateTo",
    },
    {
      fieldCode: "feedbackDateFrom",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.common.date.requireFeedbackDate").$D("要求反馈日期"),
      selectType: "start-end",
      endDateFieldCode: "creationDateTo",
    },
    {
      fieldCode: "claimStatusList",
      fieldType: "SELECT",
      fieldName: $T("hzero.common.status").$D("状态"),
      lovCode: "SQAM.CLAIM_STATUS_CODE",
      options: { multiple: true },
    },
    {
      fieldCode: "currencyCode",
      fieldType: "LOV",
      fieldName: $T("sqam.common.model.MoneyType").$D("币种"),
      lovCode:"SPRM.EXCHANGE_RATE.CURRENCY",
      displayField: "currencyName",
      options: {
        queryParams: { tenantId },
      }
    },
    {
      fieldCode: "createName",
      fieldType: "TEXT",
      fieldName: $T("entity.roles.creator").$D("创建人"),
    },
    {
      fieldCode: "syncStatus",
      fieldType: "SELECT",
      fieldName: $T("hzero.common.syncStatus").$D("同步状态"),
      lovCode: "SQAM.CLAIM_SYNC_STATUS",
    },
    {
      fieldCode: "dataSourceNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.common.dataSourceCode").$D("来源单号"),
    },
    {
      fieldCode: "executionBillNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.executionBillNums").$D("索赔执行单据"),
    },
  ],
  queryParameter: {
    tenantId,
    customizeUnitCode: [ "SQAM.CLAIM_FORM_LIST.FILTER", "SQAM.CLAIM_FORM_LIST.GRID" ].join(),
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/claim-form/purchase/page`,
      method: "get",
    },
    update: {
      url: `/sqam/v1/${tenantId}/claim-form/sync`,
      method: "post",
    },
  },
  events: {
    beforeUpdate: (_, data) => data.map((item) => item.formHeaderId),
  },
});