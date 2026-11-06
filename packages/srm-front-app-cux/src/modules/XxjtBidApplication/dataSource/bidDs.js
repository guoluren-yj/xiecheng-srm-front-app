import { SrmUtil, $T } from "srm-mobile-ui";

function bidInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    // queryParameter: {
    //   ...params
    // },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.bidApplication.model.bidApplication.targetCode").$D(
          "标的编码"
        ),
        fieldCode: "targetCode",
        fieldType: "TEXT",
      },
      {
        fieldCode: "targetName",
        fieldType: "TEXT",
        fieldName: $T("scux.bidApplication.model.bidApplication.targetName").$D(
          "标的名称"
        ),
      },
      {
        fieldCode: "lastFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.bidApplication.model.bidApplication.lastFlag").$D(
          "是否为末级"
        ),
      },
      {
        fieldCode: "lastUpdateUserMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.lastUpdateUserMeaning"
        ).$D("发起人"),
      },
      {
        fieldCode: "enableFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.bidApplication.model.bidApplication.enableFlag").$D(
          "启用/禁用"
        ),
      },
      {
        fieldCode: "targetStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.bidApplication.model.bidApplication.status").$D(
          "状态"
        ),
      },
      {
        fieldCode: "approveStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.approveStatus"
        ).$D("审批状态"),
      },
      {
        fieldCode: "approvelComment",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.approvelComment"
        ).$D("最新审批意见"),
      },
      {
        fieldCode: "modifyReason",
        fieldType: "TEXT",
        fieldName: $T("scux.bidApplication.model.bidApplication.remark").$D(
          "备注"
        ),
      },
    ],
    // transport: {
    //   read: {
    //     url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/judq9RDFJl0tISzwTN1mq4clicACBFRUMgKib6F2ylRhA?targetInfoId={targetInfoId}&targetCode={targetCode}`,
    //     method: "get",
    //   },
    // },
    // events: {
    //   afterQuery: (ds, data) => {
    //     if (data) {
    //       return data[0].targetInfoList;
    //     }
    //   },
    // },
  };
}

export { bidInfoDs };
