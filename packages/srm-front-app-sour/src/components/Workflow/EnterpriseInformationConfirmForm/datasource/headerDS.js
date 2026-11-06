import { SrmUtil, $T } from "srm-mobile-ui";

function headerDS() {
  return {
    selection: Infinity,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.HEADER"
    },
    fields: [
      {
        fieldName: $T("sslm.enterpriseInform.model.application.applicationNum").$D("申请单号"),
        fieldCode: "changeReqNumber",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.latitudeChange").$D("变更维度"),
        fieldCode: "changeLevelMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.approvalStatus").$D("申请状态"),
        fieldCode: "reqStatusMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.companyNum").$D("企业编码"),
        fieldCode: "companyNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.companyName").$D("企业名称"),
        fieldCode: "companyName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.creator").$D("创建人"),
        fieldCode: "createUserRealName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.submitDate").$D("提交日期"),
        fieldCode: "submitDate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.view.model.changeAttachment").$D("变更附件"),
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.creationDate").$D("创建日期"),
        fieldCode: "creationDate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.changeRemark").$D("变更备注"),
        fieldCode: "remark",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.partnerCompanyNum").$D("采购方公司编码"),
        fieldCode: "partnerCompanyNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.enterpriseInform.model.application.partnerCompanyName").$D("采购方公司名称"),
        fieldCode: "partnerCompanyName",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/enterprise-change/firm-detail`,
        method: "get",
      },
    },
  };
}

export default headerDS;
