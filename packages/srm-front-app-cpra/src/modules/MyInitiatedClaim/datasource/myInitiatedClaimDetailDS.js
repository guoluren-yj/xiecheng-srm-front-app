import { SrmUtil, $T } from "srm-mobile-ui";
const tenantId = SrmUtil.getTenantId();

const amountPrecision = (val, record) => val && record.amountPrecision;
const pricePrecision = (val, record) => val && record.pricePrecision;

export const claimHeaderDS = (formHeaderId) => ({
  autoQuery: true,
  fields: [
    {
      fieldCode: "formNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.claimNum").$D("索赔单号"),
    },
    {
      fieldCode: "statusCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.status").$D("状态"),
    },
    {
      fieldCode: "formTitle",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.formTitle").$D("索赔单标题"),
    },
    {
      fieldCode: "createName",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.entity.creator").$D("创建人"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.date.creation").$D("创建时间"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("entity.company.tag").$D("公司"),
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
      fieldCode: "purchaseAgentName",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.common.purchaseAgent").$D("采购员"),
    },
    {
      fieldCode: "claimDesc",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.claimState").$D("索赔说明"),
    },
    {
      fieldCode: "feedbackDate",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.date.requireFeedbackDate").$D("要求反馈日期"),
    },
    {
      fieldCode: "dataSourceCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.claimOrigin").$D("索赔来源"),
    },
    {
      fieldCode: "dataSourceNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.originNum").$D("来源单号"),
    },
    {
      fieldCode: "totalAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("sqam.common.model.common.claimAmount").$D("索赔金额"),
    },
    {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.MoneyType").$D("币种"),
    },
    {
      fieldCode: "expenseProcessTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.expenseProcessType").$D("费用处理方式"),
    },
    {
      fieldCode: "actualFeedbackDate",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.date.realFeedbackDate").$D("实际反馈日期"),
    },
    {
      fieldName: $T("sqam.common.model.applyTimes").$D("申诉次数"),
      fieldCode: "applyTimes",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.date.statementDate").$D("申诉日期"),
      fieldCode: "appealedDate",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.panel.appealHandledDate").$D("申诉处理日期"),
      fieldCode: "appealHandledDate",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.panel.statementContent").$D("申诉内容"),
      fieldCode: "appealContentMeaning",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.panel.supplierAppealAttachment").$D("供应商申诉附件"),
      fieldCode: "supplierAttachmentUuid",
      fieldType: "UPLOAD",
      title: $T("hzero.common.button.view").$D("查看"),
      showCount: false,
    },
    {
      fieldName: $T("sqam.common.model.statementOption").$D("申诉意见"),
      fieldCode: "appealOpinion",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.dealAction").$D("处理动作"),
      fieldCode: "appealHandleActionMeaning",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.statementResolution").$D("决议说明"),
      fieldCode: "appealHandleOpinion",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.feedbackOpinion").$D("反馈意见"),
      fieldCode: "feedbackOpinion",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.supplierConfirm").$D("供应商确认附件"),
      fieldCode: "supplierConfirmUuid",
      fieldType: "UPLOAD",
      title: $T("hzero.common.button.view").$D("查看"),
      showCount: false,
    },
    {
      fieldName: $T("sqam.common.model.resultRemark").$D("执行结果说明"),
      fieldCode: "resultRemark",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.resultExcuteFile").$D("索赔结果执行附件"),
      fieldCode: "resultAttachmentUuid",
      fieldType: "UPLOAD",
      title: $T("hzero.common.button.view").$D("查看"),
      showCount: false,
    },
  ],
  queryParameter: {
    tenantId,
    formHeaderId,
    customizeUnitCode: [ "SQAM.CLAIM_FORM_DETAIL.BASIC_INFO", "SQAM.CLAIM_FORM_DETAIL.CLAIM_INFO", "SQAM.CLAIM_FORM_DETAIL.STATEMENT" ].join(),
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/claim-form/purchase/detail/${formHeaderId}`,
      method: "get",
    },
  },
});

export const claimLineDS = (formHeaderId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldName: $T("ssta.common.model.common.displayNumber").$D("行号"),
      fieldCode: "displayLineNum",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.common.model.claimItemCode").$D("索赔项目编码"),
      fieldCode: "claimItemNum",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.common.model.claimItemDesc").$D("索赔项目描述"),
      fieldCode: "claimItemDesc",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.common.date.happenDate").$D("发生日期"),
      fieldCode: "occurDate",
      fieldType: "DATE_PICKER",
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldName: $T("entity.item.code").$D("物料编码"),
      fieldCode: "itemCode",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("entity.item.name").$D("物料名称"),
      fieldCode: "itemName",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.common.model.unit").$D("单位"),
      fieldCode: "uomCodeAndName",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.common.model.common.quantity").$D("数量"),
      fieldCode: "quantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldName: $T("sqam.common.model.claimInvoiceBill.netPrice").$D("索赔单价（不含税）"),
      fieldCode: "netPrice",
      fieldType: "INPUT_NUMBER",
      editor: false,
      precision: pricePrecision,
    },
    {
      fieldName: $T("sqam.common.model.claimInvoiceBill.taxIncludedPrice").$D("索赔单价（含税）"),
      fieldCode: "taxIncludedPrice",
      fieldType: "INPUT_NUMBER",
      editor: false,
      precision: pricePrecision,
    },
    {
      fieldName: $T("ssta.common.model.claimState").$D("索赔说明"),
      fieldCode: "lineExplain",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.common.taxRate").$D("税率(%)"),
      fieldCode: "taxRate",
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldName: $T("sqam.common.model.claimInvoiceBill.noTaxBill").$D("索赔行金额（不含税）"),
      fieldCode: "lineAmount",
      fieldType: "INPUT_NUMBER",
      editor: false,
      precision: amountPrecision,
    },
    {
      fieldName: $T("sqam.common.model.claimInvoiceBill.hasTaxBill").$D("索赔行金额（含税）"),
      fieldCode: "taxIncludedLineAmount",
      fieldType: "INPUT_NUMBER",
      editor: false,
      precision: amountPrecision,
    },
    {
      fieldName: $T("ssta.common.model.common.jointCode").$D("连带物品编码"),
      fieldCode: "associateItemCode",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.common.model.common.jointUnit").$D("连带物品单位"),
      fieldCode: "associateItemUomCodeAndName",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.common.model.common.jointNum").$D("连带物品数量"),
      fieldCode: "associateItemQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldName: $T("hzero.common.remark").$D("备注"),
      fieldCode: "lineRemark",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.common.inspection").$D("关联质检单"),
      fieldCode: "fromInspectionNum",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.qualityRectification.specifications").$D("规格"),
      fieldCode: "specifications",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("sqam.common.model.qualityRectification.model").$D("型号"),
      fieldCode: "model",
      fieldType: "TEXT",
    },
  ],
  queryParameter: {
    tenantId,
    formHeaderId,
    customizeUnitCode: [ "SQAM.CLAIM_FORM_DETAIL.CLAIM_ITEM", "SQAM.CLAIM_FORM_DETAIL.CLAIM_ITEM_FILTER" ].join(),
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/claim-form-lines/purchase/detail/${formHeaderId}/items`,
      method: "get",
    }
  }
});