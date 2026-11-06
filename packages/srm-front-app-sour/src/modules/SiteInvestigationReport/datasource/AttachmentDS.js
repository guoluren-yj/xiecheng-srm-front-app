import { SrmUtil, $T } from "srm-mobile-ui";

function attachmentDS(id) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    selection: 20,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    fields: [ {
      fieldCode: "lnEvalStatusMeaning",
      fieldType: "EMPTY",
      render: (val) => <srm-list-header show-open-tag={false}>
        { $T("sslm.siteInvestigateReport.modal.mange.lnEvalStatusMeaning").$D("上传节点") }：{ val }
      </srm-list-header>,
    }, {
      fieldName: $T("sslm.common.view.attachment.type").$D("附件类型"),
      fieldCode: "attachmentlType",
      displayField: "attachmentlTypeMeaning",
      fieldType: "SELECT",
      lovCode: "SSLM.SITE_EVALATT_LN_TYPE",
      editor: (val, item) => item.localEditable,
    }, {
      fieldName: $T("sslm.common.model.attachment.name").$D("附件名称"),
      fieldCode: "attachmentDesc",
      fieldType: "TEXT",
    }, {
      fieldName: $T("sslm.common.model.attachment.size").$D("附件大小"),
      fieldCode: "attachmentSize",
      fieldType: "EMPTY",
      render: (val) => {
        let num = Number(val) / 1024.0 / 1024.0;
        let res = `${String(num.toFixed(3))}${"MB"}`;
        return <span>
          {$T("sslm.common.model.attachment.size").$D("附件大小")}：{res}
        </span>;
      },
    }, {
      fieldName: $T("sslm.common.model.attachment.uploadDate").$D("上传时间"),
      fieldCode: "uploadDate",
      fieldType: "TEXT",
    }, {
      fieldName: $T("sslm.common.model.attachment.uploadName").$D("上传人"),
      fieldCode: "uploadUserName",
      fieldType: "TEXT",
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.inside").$D("内部附件(供应商不可见)"),
      fieldCode: "insideFlag",
      displayField: "insideFlagMeaning",
      fieldType: "SELECT",
      clearButton: false,
      editor: (val, item) => item.localEditable,
      options: {
        displayField: "meaning",
        valueField: "value",
        listData: [ {
          meaning: $T("smbl.common.view.yes").$D("是"),
          value: "1",
        }, {
          meaning: $T("smbl.common.view.no").$D("否"),
          value: "0",
        }, ],
      },
    }, {
      fieldType: "INPUT",
      fieldCode: "remark",
      fieldName: $T("sslm.common.remark").$D("备注"),
      editor: (val, item) => item.localEditable,
    } ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-att-lns/${id}`,
        method: "get",
      },
      destroy: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-att-lns`,
        method: "delete",
      },
      submit: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-att-lns`,
        method: "post",
      }
    },
    events: {
      beforeDelete: (ds, datas) => {
        let ids = [];
        datas.forEach((element) => {
          if (element.attId) {
            ids.push(element.attId);
          }
        });
        datas.splice(0, datas.length);
        datas.push(...ids);
        return datas.length;
      },
      beforeSubmit: (ds, datas) => datas.length,
      afterQuery: (ds, datas) => {
        datas.forEach((e) => {
          e.localEditable = false;
          if (e.insideFlag === 0 || e.insideFlag === 1 || e.insideFlag === "0" || e.insideFlag === "1") {
            e.insideFlag = String(e.insideFlag);
          } else {
            e.insideFlag = null;
          }
        });
      }
    }
  };
}

export {
  attachmentDS
};