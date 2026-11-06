import { $T } from "srm-mobile-ui";
//送样申请反馈列表
function sampleFeedbackListDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSLM.SAMPLE_DELIVERY_CALLBACK.TABLE_LIST",
      reqStatusNoCreate: "Y"
    },
    fields: [],
    fastQueryField: {
      fieldCode: "reqNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.sample.model.reqNum").$D("申请单号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sslm.sample.model.customer").$D("客户"),
        lovCode: "SPCM.USER_AUTH.CUSTOMER",
      },
      {
        fieldCode: "ouName",
        fieldType: "INPUT",
        fieldName: $T("sslm.sample.model.ouName").$D("业务实体")
      },
      {
        fieldCode: "organizationName",
        fieldType: "INPUT",
        fieldName: $T("sslm.sample.model.organization").$D("库存组织")
      },
      {
        fieldCode: "typeCode",
        fieldType: "SELECT",
        fieldName: $T("sslm.sample.model.typeCodeMeaning").$D("送样类型"),
        lovCode:"SSLM.TYPE_CODE",
      },
      {
        fieldCode: "urgencyDegree",
        fieldType: "SELECT",
        fieldName: $T("sslm.sample.model.urgencyDegreeMeaning").$D("紧急程度"),
        lovCode:"SSLM.SAMPLE_URGENCY_DEGREE",
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/sample-send-reqs/pageSampleSendReq/feedback`,
        method: "get",
      },
    },
  };
}
export default sampleFeedbackListDS;
