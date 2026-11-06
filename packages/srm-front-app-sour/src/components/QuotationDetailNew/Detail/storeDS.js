import { SrmUtil, $T } from "srm-mobile-ui";

const formDS = () => ({
  autoQuery: false,
  editable: false,
  paging: false,
  fields: [
    {
      fieldCode: "templateName",
      fieldName: $T("ssrc.common.model.common.templateName").$D("报价模板名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "quoDetailAttachmentUuid",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierAttachment").$D("供应商附件"),
      fieldType: "UPLOAD",
    },
    {
      fieldCode: "attachmentNeedFlag",
      fieldName: $T("ssrc.common.model.common.supplierAttachNeed").$D("供应商附件必传"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "allowCreateFlag",
      fieldName: $T("ssrc.common.model.common.allowCreateFlag").$D("允许供应商新建明细行"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "attachmentUuid",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件"),
      fieldType: "UPLOAD",
    },
  ],
});

const tableDS = ({ rowKeyId, queryParams = {}, handleDataSource, templateId }) => ({
  autoQuery: true,
  editable: false,
  paging: true,
  enableQuery: false,
  primaryKey: rowKeyId,
  hasMore: true,
  pageSize: 10,
  queryParameter: {
    ...queryParams || {},
    sourceFrom: queryParams.sourceFrom,
    rfxLineItemId: queryParams.rfxLineItemId,
    itemId: queryParams.itemId,
    itemCategoryId: queryParams.itemCategoryId,
    rfxHeaderId: queryParams.rfxHeaderId,
    quotationLineId: queryParams.quotationLineId,
    quotationHeaderId: queryParams.quotationHeaderId,
    quotationTemplateId: queryParams.quotationTemplateId,
    sourceResultId: queryParams.sourceResultId,
    level: queryParams.level,
    templateId,
  },
  fields: [
    {
      fieldCode: "configCode",
      fieldName: $T("ssrc.common.model.common.configCode").$D("报价明细项编码"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "configName",
      fieldName: $T("ssrc.common.model.common.configName").$D("报价明细项名称"),
      fieldType: "TEXT",
    },
  ],
  transport: {
    read: {
      url: queryParams?.sourceResultId ?
        `ssrc/v1/${SrmUtil.getTenantId()}/rfx/external/quotationTemplate/view` :
        `ssrc/v1/${SrmUtil.getTenantId()}/${queryParams?.sourceFrom === "RFX" ? "rfx" : "bid"}/${queryParams.rfxHeaderId}/quotationTemplate/view`,
      method: "get",
      transformResponse: ({ response }) => {
        if (response && !response.failed) {
          const {
            supQuotationDetailPage: { content = [], ...pages },
          } = response;
          const data = handleDataSource(content);
          return { ...pages, content: data };
        }
      },
    },
  },
});

const twoTableDS = ({ rowKeyId }) => ({
  autoQuery: false,
  editable: false,
  paging: false,
  enableQuery: false,
  primaryKey: rowKeyId,
  fields: [
    {
      fieldCode: "configCode",
      fieldName: $T("ssrc.common.model.common.configCode").$D("报价明细项编码"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "configName",
      fieldName: $T("ssrc.common.model.common.configName").$D("报价明细项名称"),
      fieldType: "TEXT",
    },
  ],
});

export { formDS, tableDS, twoTableDS };
