import { SrmUtil } from "srm-mobile-ui";

export const indexDS = () => {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter:{
    },
    fastQueryField: {
      fieldCode: "reqNum",
      fieldType: "TEXT",
      fieldName: "需求联络单号",
      langCode: "spuc.common.model.jala.demandContactNumber",
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "department",
        fieldType: "LOV",
        fieldName: "部门",
        lovCode: "SCUX.QSCHOU.SBUD_UNIT",
        langCode: "spfm.invitationRegister.model.invitation.department",
      },
      {
        fieldCode: "reqByName",
        fieldType: "TEXT",
        fieldName: "申请人",
        langCode: "hwfp.commom.model.apply.owner",
        disabled: true,
        defaultValue: SrmUtil.getUserInfo().realName
      },
      {
        fieldCode: "reqDate",
        fieldType: "DATE_PICKER",
        fieldName: "申请日期",
        langCode: "spfm.enterpriseRecovery.model.enterpriseRecovery.applyDate",
      },
    ],
    transport: {
      read: {
        url:`/scux/v1/${localStorage.getItem("organizationId")}/qschou-req-headers/mobile/list`,
        method: "get",
      },
    },
  };
};

export default indexDS;
