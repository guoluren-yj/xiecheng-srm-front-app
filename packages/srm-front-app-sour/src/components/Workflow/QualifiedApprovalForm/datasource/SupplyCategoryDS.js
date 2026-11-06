import { $T } from "srm-mobile-ui";
function supplyCategoryDS(vm) {
  return {
    paging:false,
    selection: 0,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldName: $T("sslm.commonApplication.model.coApp.processStatus").$D("状态"),
        fieldCode: "enabledFlag",
        fieldType: "TEXT",
        render(val) {
          return val ? vm.$T("hipspfm.common.status.enabledFlag.enable").$D("启用") : vm.$T("hipspfm.common.status.enabledFlag.disable").$D("禁用");
        },
      },
      {
        fieldName: $T("sslm.commonApplication.model.commonApplication.evaluationLevel").$D("分类评级"),
        fieldCode: "evaluationLevel",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.commonApplication.model.commonApplication.evaluationScore").$D("分类评分"),
        fieldCode: "evaluationScore",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.commonApplication.model.coApp.alterDate").$D("变更时间"),
        fieldCode: "alterDate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.commonApplication.model.coApp.alterUserName").$D("变更人"),
        fieldCode: "realName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.commonApplication.model.coApp.alterReason").$D("变更理由"),
        fieldCode: "alterReason",
        fieldType: "TEXT",
      },
    ],
    transport: {
      // read: {
      //     url: `/sslm/v1/${localStorage.getItem('organizationId')}/supplier-category-assign`,
      //     method: 'get',
      //     params: {},
      // },
    },
  };
}

export default supplyCategoryDS;
