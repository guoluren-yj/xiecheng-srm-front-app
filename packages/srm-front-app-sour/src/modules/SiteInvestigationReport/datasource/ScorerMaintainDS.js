import { $T, SrmUtil } from "srm-mobile-ui";
function scorerMaintainDS(editable) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    selection: 100,
    enableQuery: false,
    showTotalCount: false,
    fields: [ {
      fieldName: $T("sslm.siteInvestigateReport.modal.scorer.scoreUser").$D("评分用户"),
      fieldCode: "respUserId",
      displayField: "loginName",
      fieldType: "LOV",
      lovCode: "SSLM.KPI_USER",
      editor: editable,
      options: {
        displayField: "loginName",
        subDisplayField: "userName",
        onClear: (ds) => {
          const realName = ds.current && ds.current.getField("realName");
          realName.setData(null);
        },
        callback: (val, fieldCode, display, ds) => {
          let item = {};
          if (val.length) {
            item = val[0];
          }
          const realName = ds.current && ds.current.getField("realName");
          realName.setData(item.userName);
        },
      },
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.scorer.scoreUser").$D("评分用户"),
      fieldCode: "realName",
      fieldType: "INPUT",
      disabled: true,
      editor: editable,
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.scorer.weight").$D("权重（%）"),
      fieldCode: "respWeight",
      fieldType: "INPUT_NUMBER",
      editor: editable,
    }, ],
    transport: {
      destroy: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-resps`,
        method: "delete",
      },
    },
    events: {
      beforeDelete: (ds, datas) => {
        let deleteDatas = [];
        datas.forEach((element) => {
          if (element.evalLineId) {
            deleteDatas.push({
              ...element,
            });
          }
        });
        datas.splice(0, datas.length);
        datas.push(...deleteDatas);
        return true;
      },
    }
  };
}

export {
  scorerMaintainDS
};
