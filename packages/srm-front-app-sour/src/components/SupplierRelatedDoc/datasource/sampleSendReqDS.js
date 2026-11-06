import { SrmUtil, $T } from "srm-mobile-ui";

function sampleSendReqDS() {

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: { customizeUnitCode: "SSLM.SUPPLIER_LIFE_MANAGE.ELIMINATE_RELATED_DOC" },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "reqNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.reqNum").$D("申请单号"),
      },
      {
        fieldCode: "reqStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.reqStatus").$D("单据状态"),
      },
      {
        fieldCode: "invOrganizationId",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.invOrganization").$D("库存组织"),
      },
      {
        fieldCode: "supplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.supplierNum").$D("供应商编码"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.company").$D("公司"),
      },
      {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.ou").$D("业务实体"),
      },
      {
        fieldCode: "supplierTypeCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.supplyType").$D("供应商类型"),
      },
      {
        fieldCode: "originFactoryName",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.originFactoryName").$D("原厂名称"),
      },
      {
        fieldCode: "typeCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.typeCode").$D("送样类型"),
      },
      {
        fieldCode: "reqUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.reqUserName").$D("申请人"),
      },
      {
        fieldCode: "reqUserPhone",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.reqUserPhone").$D("申请人联系电话"),
      },
      {
        fieldCode: "recUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.recUserName").$D("接样人"),
      },
      {
        fieldCode: "recUserPhone",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.recUserPhone").$D("接样人联系电话"),
      },
      {
        fieldCode: "sampleSendAddress",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.sampleSendAddress").$D("送样地址"),
      },
      {
        fieldCode: "sendUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.sendUserName").$D("送样人"),
      },
      {
        fieldCode: "sendUserPhone",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.sendUserPhone").$D("送样人联系电话"),
      },
      {
        fieldCode: "sendTypeCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.sendTypeCode").$D("送样方式"),
      },
      {
        fieldCode: "trackingNumber",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.trackingNumber").$D("快递单号"),
      },
      {
        fieldCode: "expectedDeliveryDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.expectedDeliveryDate").$D("预计送达时间"),
      },
      {
        fieldCode: "urgencyDegreeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.urgencyDegree").$D("紧急程度"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "releaseDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.releaseDate").$D("发布时间"),
      },
      {
        fieldCode: "feedbackDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.feedbackDate").$D("反馈时间"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("sslm.sample.model.remark").$D("备注"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/sample-send-reqs/pageSampleSendReq/fetch/purchase",
        method: "get",
      },
    },
  };
}

export default sampleSendReqDS;
