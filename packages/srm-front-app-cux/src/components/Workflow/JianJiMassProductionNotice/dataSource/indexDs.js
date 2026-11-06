import { SrmUtil, $T } from "srm-mobile-ui";

function headerInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.massProductionNotice.model.noticeNum").$D("通知单号"),
        fieldCode: "noticeNum",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.status").$D("状态"),
        fieldCode: "statusMeaning",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.fileNum").$D("来源"),
        fieldCode: "dataSourceMeaning",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.itemCertificationNum").$D("品质认证单号"),
        fieldCode: "icNum",
      },
      {
        fieldName:$T("scux.massProductionNotice.model.itemCertificationDate").$D("物料认证日期"),
        fieldCode: "itemCertificationDate",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.creationDate").$D("创建时间"),
        fieldCode: "creationDate",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.createdByMeaning").$D("创建人"),
        fieldCode: "createdByMeaning",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.supplierCompanyName").$D("供应商"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.title").$D("标题"),
        fieldCode: "title",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.model").$D("机型"),
        fieldCode: "model",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.fileNumber").$D("文件编号"),
        fieldCode: "fileNumber",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.applicationContent").$D("申请内容"),
        fieldCode: "applicationContent",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.attachmentUuid").$D("附件上传"),
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/MANVfekDS5V2mDsTq9ib0SiaEuSkIo3JcPChpDJLT7ibmW3Je2O4daOIPty0LLia2o3u`,
        method: "GET",
      },
    },
  };
}

function lineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.massProductionNotice.model.figureNumber").$D("图号"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.name").$D("名称"),
        fieldCode: "itemName",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.supplierCompany").$D("供应商"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.supplierCompanyNum").$D("供应商编码"),
        fieldCode: "supplierNum",
      },
      {
        fieldName: $T("scux.massProductionNotice.model.model").$D("机型"),
        fieldCode: "model",
      },
      {
        fieldName:$T("scux.massProductionNotice.model.attachmentUuid").$D("附件"),
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/MANVfekDS5V2mDsTq9ib0SiaEuSkIo3JcPChpDJLT7ibmVciaho4AfqEY1iboWzs9gOKr`,
        method: "GET",
      },
    },
  };
}
export { lineInfoDs, headerInfoDs };
