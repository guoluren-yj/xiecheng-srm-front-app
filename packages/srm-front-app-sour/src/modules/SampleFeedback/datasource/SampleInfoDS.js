import { SrmUtil, $T } from "srm-mobile-ui";

function sampleInfoDS(id) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 20,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSLM.SAMPLE_DELIVERY_CALLBACK.SAMPLE_INFO",
    },
    fields: [
      {
        fieldName: $T("sslm.sample.model.sendTypeCodeMeaning").$D("送样方式"),
        fieldCode: "sendTypeCode",
        fieldType: "SELECT",
        required:true,
        lovCode:"SSLM.SEND_TYPE_CODE",
        displayField:"sendTypeCodeMeaning",
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/sample-infos/${id}/list`,
        method: "get",
      },
    },
  };
}

export default sampleInfoDS;