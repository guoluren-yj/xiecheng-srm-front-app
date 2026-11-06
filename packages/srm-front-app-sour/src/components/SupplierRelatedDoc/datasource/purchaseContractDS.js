import { SrmUtil, $T } from "srm-mobile-ui";

function purchaseContractDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: { sourceTarget: "Eliminate", customizeUnitCode: "SSLM.SUPPLIER_LIFE_MANAGE.ELIMINATE_RELATED_DOC" },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "version",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.version").$D("版本号"),
      },
      {
        fieldCode: "pcStatusCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.pcStatusCode").$D("状态"),
      },
      {
        fieldCode: "pcNum",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.purchaseAgreementNum").$D("采购协议编号"),
      },
      {
        fieldCode: "pcName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.purchaseAgreementName").$D("采购协议名称"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.agreementObject").$D("协议对象"),
      },
      {
        fieldCode: "pcKindCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.pcKindCode").$D("协议性质"),
      },
      {
        fieldCode: "pcTypeCode",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.pcTypeId").$D("协议类型"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.companyName").$D("公司名称"),
      },
      {
        fieldCode: "supplierCompanyNum",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.supplierCode").$D("供应商编码"),
      },
      {
        fieldCode: "globalFlag",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.globalFlag").$D("是否全局协议"),
      },
      {
        fieldCode: "taxIncludeAmount",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.amount").$D("协议总额"),
      },
      {
        fieldCode: "executedAmount",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.executedAmount").$D("已执行金额"),
      },
      {
        fieldCode: "toExecuteAmount",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.toExecuteAmount").$D("待执行金额"),
      },
      {
        fieldCode: "acceptStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.contractAcceptStatus").$D("协议验收状态"),
      },
      {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.ouName").$D("业务实体"),
      },
      {
        fieldCode: "purchaseOrgName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.purchaseOrgName").$D("采购组织"),
      },
      {
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.export.purchaseAgentName").$D("采购员"),
      },
      {
        fieldCode: "pcTemplateId",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.pcTemplateId").$D("协议模板"),
      },
      {
        fieldCode: "createByRealName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.createByRealName").$D("创建人"),
      },
      {
        fieldCode: "signDate",
        fieldType: "TEXT",
        fieldName: $T("spcm.purchaseContractView.model.signDate").$D("签订日期"),
      },
      {
        fieldCode: "startDateActive",
        fieldType: "TEXT",
        fieldName: $T("spcm.purchaseContractView.model.startDateActive").$D("生效日期"),
      },
      {
        fieldCode: "endDateActive",
        fieldType: "TEXT",
        fieldName: $T("spcm.purchaseContractView.model.endDateActive").$D("失效日期"),
      },
      {
        fieldCode: "remainDate",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.remainDate").$D("剩余有效期"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("spcm.contractTemplate.model.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "agreementSource",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.agreementSource").$D("协议来源"),
      },
      {
        fieldCode: "mainAgreementCode",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.mainAgreementCode").$D("主协议编码"),
      },
      {
        fieldCode: "archiveCode",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.archiveCode").$D("归档码"),
      },
      {
        fieldCode: "releaseDate",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.releaseDate").$D("发布时间"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.attachmentUuid").$D("归档文件"),
      },
    ],
    transport: {
      read: {
        url: "/spcm/v1/{tenantId}/purchase-contract/purchase-view/page",
        method: "get",
      },
    },
  };
}

export default purchaseContractDS;
