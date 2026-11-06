import { $T, SrmUtil } from "srm-mobile-ui";

function scorerDS(evalDtlId = 0, evalDtlIds, evalHeaderId, selectAllFlag, averageFlag) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    pathParameter: {
      evalDtlId: evalDtlId || 0,
      tenantId: SrmUtil.getTenantId(),
      evalHeaderId,
    },
    fields: [
      {
        fieldCode: "respUserId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreUser").$D("评分用户"),
        lovCode: "SSLM.KPI_CHOOSE_USER",
        displayField: "loginName",
        required: true,
        options: {
          displayField: "userName",
          subDisplayField: "loginName",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              const { userName, unitName } = val[0];
              ds.current.set("userName", userName);
              ds.current.set("userDepartment", unitName);
            }
          },
        }
      },
      {
        fieldCode: "userName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.userName").$D("评分人描述"),
      },
      {
        fieldCode: "userDepartment",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.department").$D("部门"),
      },
      {
        fieldCode: "respWeight",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreWeight").$D("权重"),
        precision: 2,
        disabled: Boolean(averageFlag),
        required: !averageFlag,
      },
      {
        fieldCode: "defaultScore",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.defaultScore").$D("缺省分值"),
      },
      {
        fieldCode: "isStandard",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.isStandard").$D("符合评分标准"),
      },
      {
        fieldCode: "isVeto",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.isVeto").$D("否决该项"),
      },
      {
        fieldCode: "indOptName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.archiveFilled.indOptName").$D("评分选项"),
      },
      {
        fieldCode: "score",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.feedbackDescription").$D("反馈备注"),
      },
      {
        fieldCode: "scorerAttachmentUuid",
        fieldType: "UPLOAD",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scorerAttachmentUuid").$D("附件上传"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-dtl-resps/{evalDtlId}",
        method: "get",
      },
      update: {
        url: "/sslm/v1/{tenantId}/eval-dtl-resps/{evalDtlId}/operate",
        method: "POST",
      },
      submit: {
        url: "/sslm/v1/{tenantId}/eval-dtl-resps/batch-save/{evalHeaderId}",
        method: "POST",
      }
    },
    events: {
      beforeSubmit: (ds, data) => ({
        customizeUnitCode: "SSLM.EVALUATION_DOC_MANAGE_DETAIL.HEADER",
        evalDtlIds,
        kpiEvalDtlRespList: data,
        selectAllFlag: selectAllFlag ? 1 : 0,
      })
    }
  };
}

export default scorerDS;
