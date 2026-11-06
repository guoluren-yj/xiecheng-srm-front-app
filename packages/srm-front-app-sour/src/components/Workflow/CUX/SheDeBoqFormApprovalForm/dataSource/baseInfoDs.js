import { SrmUtil, $T } from "srm-mobile-ui";
import moment from "moment";
import { yesOrNoRenderer } from "@/utils/renderer.js";

function baseInfoDS() {
  return {
    editable: false,
    showTotalCount: false,
    forceValidate: true,
    autoQuery: true,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "createdByName",
        fieldName: $T("sprm.shede.cux.boqform.createdByName").$D("申请人"),
      },
      {
        fieldCode: "attributeDatetime1",
        editable: false,
        fieldName: $T("sprm.shede.cux.boqform.attributeDatetime1").$D("编制申请时间"),
      },
      {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: $T("sprm.shede.cux.boqform.title").$D("项目名称"),
      },
      {
        fieldCode: "amount",
        fieldType: "INPUT_NUMBER",
        precision: 3,
        editor: false,
        fieldName: $T("sprm.shede.cux.boqform.amount").$D("预算金额"),
      },
      {
        fieldCode: "attributeVarchar1",
        editor: false,
        fieldName: $T("sprm.shede.cux.boqform.attributeVarchar1").$D("需第三方编制"),
        render: (val) => yesOrNoRenderer(val),
      },
      {
        fieldCode: "attributeDate1",
        fieldName: $T("sprm.shede.cux.boqform.attributeDate1").$D("第三方编制计划完成日期"),
        editor: false,
        render: (val) => val?.split(" ")[0] || "-",
      },
      {
        fieldCode: "attributeLongtext1",
        fieldType: "TEXT",
        fieldName: $T("sprm.shede.cux.boqform.attributeLongtext1").$D("提报内容"),
      },
      {
        fieldCode: "attributeVarchar4",
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
        fieldName: $T("sprm.shede.cux.boqform.attributeVarchar4").$D("相关附件"),
      },
      {
        fieldCode: "attributeVarchar3",
        fieldType: "LOV",
        lovCode: "HPFM.EMPLOYEE",
        required: true,
        editor: true,
        transformRequest: (value) => value && value.employeeNum,
        fieldName: $T("sprm.shede.cux.boqform.attributeVarchar3").$D("指定复核人员"),
      },
    ],
    events: {
      afterQuery: (ds, data) => {
        const { approvRecords, attributeDatetime1, attributeVarchar1 } = data[0];
        const approvRecordsObj = {};
        approvRecords.forEach((ele) => {
          const { comment, time, attachmentId, type } = ele;
          if (type === "1") {
            approvRecordsObj.approveDate1 = time;
            approvRecordsObj.approveComment1 = comment;
            approvRecordsObj.approveFile1 = attachmentId;
          }
          if (type === "2") {
            approvRecordsObj.approveDate2 = time;
            approvRecordsObj.approveComment2 = comment;
            approvRecordsObj.approveFile2 = attachmentId;
          }
          if (type === "3") {
            approvRecordsObj.approveDate3 = time;
            approvRecordsObj.approveComment3 = comment;
            approvRecordsObj.approveFile3 = attachmentId;
          }
        });
        return [ { ...data[0], approvRecords: [ approvRecordsObj ], attributeDatetime1: attributeDatetime1 || moment().format("YYYY-MM-DD HH:mm:ss"), attributeVarchar1: attributeVarchar1 || "1" } ];
      },
    },
    transport: {
      read: {
        url: "/marmot/v1/{tenantId}/marmot-api/F8TpSeafIUjsUslicfgULyljQ4gLR7z53Jw7acNYKy1mkIeFHA6ZWGP6stibkzFbGp",
        method: "post",
      },
    },
  };
}

export default baseInfoDS;
