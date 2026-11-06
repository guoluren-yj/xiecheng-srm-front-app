import { $T } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";
function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

// 基本信息
function basicDS({ evalHeaderId }) {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate: true,
    data: [],
    queryParameter: {
      page: 0,
      size: 10,
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_DETAIL.EX_ATT_FORM,SSLM.PURCHASER_ASSESS_DETAIL.IN_ATT_FORM,SSLM.PURCHASER_ASSESS_DETAIL.BASICINFO,SSLM.PURCHASER_ASSESS_DETAIL.SUPPLIER_INFO,SSLM.PURCHASER_ASSESS_DETAIL.COMPANY_INFO,SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_RESULT",
    },
    fastQueryField: {
      fieldCode: "evalNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
    },
    // 查询表单字段
    queryFields: [
    ],
    fields: [
      // 评估结果
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.form.label.finalScore").$D("最后得分"),
        fieldCode: "finalScore",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.form.label.level").$D("等级"),
        fieldCode: "grade",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.form.label.resultsFlag").$D("评估结果"),
        fieldCode: "resultsFlag",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.form.label.opinion").$D("综合意见"),
        fieldCode: "opinion",
      },
      {
        fieldName: $T("sslm.common.model.field.ratersSynthesizeOpinions").$D("评分人综合意见"),
        fieldCode: "respUserRemarks",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.form.label.copyTo").$D("抄送"),
        fieldCode: "informUserIds",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.form.label.sendTo").$D("抄送"),
        fieldCode: "sendTo",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.form.label.resultLinkAtt").$D("审查结果附件"),
        fieldCode: "resultLinkUuid",
      },
    ],
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-headers/eval-report/${evalHeaderId}`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        const newdata = data.map((e) => ({ ...e, dataId: e.supplierCompanyId || e.supplierId }));
        return newdata;
      },
    }
  };
}

function creatBasicDS() {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    data: [],
    queryParameter: {
      page: 0,
      size: 10,
    },
    fields: [
    ],
  };
}

// 评估物料/品类信息
function itemCategoryDS({ evalHeaderId }) {
  return {
    autoQuery: true,
    pageSize: 10,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate:true,
    queryParameter: {
      page: 0,
      size: 10,
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATE_MATERIALS_TABLE",
    },
    fields:[
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemName").$D("物料名称"),
        fieldCode: "itemName",
      },
      {
        fieldCode: "itemCategoryCode",
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryCode").$D("品类编码"),
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryName").$D("品类名称"),
        fieldCode: "itemCategoryName",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.brand").$D("品牌"),
        fieldCode: "brand",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.remark").$D("备注"),
        fieldCode: "remark",
      },
    ],
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-item-cates/${evalHeaderId}`,
        method: "get",
      },
      destroy: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-item-cates`,
        method: "delete",
      },
      submit: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-item-cates`,
        method: "post",
      }
    },
    events: {
      // beforeSubmit: (ds, datas) => {
      //   datas.forEach((element) => {
      //     element.evalHeaderId = evalHeaderId;
      //   });
      //   return datas.length;
      // },
      beforeDelete: (ds, datas) => {
        let ids = [];
        datas.forEach((element) => {
          if (element.evalItemCateId) {
            ids.push(element.evalItemCateId);
          }
        });
        datas.splice(0, datas.length);
        datas.push(...ids);
        return datas.length;
      },
    }
  };
}

// 评估小组信息
function assessmentPanelDS({ evalHeaderId }) {
  return {
    autoQuery: true,
    pageSize: 10,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate: true,
    queryParameter: {
      page: 0,
      size: 10,
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_TEAM",
    },
    fields:[
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.userType").$D("代表方"),
        fieldCode: "userType",
        required: true,
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierContacts").$D("供应商联系人"),
        fieldCode: "supplierUserId",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.Account").$D("账户"),
        fieldCode: "userId",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.member").$D("名称"),
        fieldCode: "member",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.department").$D("部门"),
        fieldCode: "department",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.station").$D("岗位"),
        fieldCode: "post",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierTelephone").$D("供应商联系电话"),
        fieldCode: "phone",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.email").$D("邮箱"),
        fieldCode: "email",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.isLeader").$D("是否组长"),
        fieldCode: "leaderFlag",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evaluationIndex").$D("评估指标"),
        fieldCode: "scoreStatus",
      },
      {
        fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.siteLocation").$D("现场定位"),
        fieldCode: "siteLocation",
      },
    ],
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-groups/eval-report/${evalHeaderId}`,
        method: "get",
      },
      destroy: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-groups/${evalHeaderId}/site-resp`,
        method: "delete",
      },
      submit: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-groups`,
        method: "post",
      }
    },
    events: {
      // beforeSubmit: (ds, datas) => {
      //   datas.forEach((element) => {
      //     element.evalHeaderId = evalHeaderId;
      //   });
      //   return datas.length;
      // },
      beforeDelete: (ds, datas) => {
        let ids = [];
        datas.forEach((element) => {
          if (element.evalGroupId) {
            ids.push(element.evalGroupId);
          }
        });
        datas.splice(0, datas.length);
        datas.push(...ids);
        return datas.length;
      },
    }
  };
}

// 评估信息
function assessmentDS({ evalHeaderId }) {
  const customizeUnitCodeList = [
    "SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_INFO",
    "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATION_INFORMATION",
  ];
  return {
    autoQuery: true,
    pageSize: 10,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    enableSelect: (record) => {
      // 判断行不可勾选
      const disenableSelect = record.data.scoreType === "SYSTEM" || record.data.completeFlag === 4;
      return !disenableSelect;
    },
    queryParameter: {
      page: 0,
      size: 10,
      customizeUnitCode: customizeUnitCodeList.join(","),
    },
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-lines/eval-report-line/tree/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

// 退回评分信息
function backScoreDS({ evalHeaderId }) {
  return {
    autoQuery: false,
    pageSize: 100000,
    selection: Infinity,
    editable: false,
    editFlag: true,
    enableQuery: true,
    showTotalCount: false,
    fastQueryField: {
      fieldCode: "evalNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
    },
    queryParameter: {
      page: 0,
      size: 100000,
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_DETAIL.BACK_SCORE_FILTER",
    },
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-line-resps/${evalHeaderId}/batch-query`,
        method: "get",
      },
    },
  };
}

// 质量整改
function reformDS({ evalHeaderId }) {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate: true,
    data: [],
    queryParameter: {
      page: 0,
      size: 10,
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_DETAIL.QUALITY_RECTIFICATION",
    },
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site_eval_external_orders/eval-report/${evalHeaderId}`,
        method: "post",
      },
      destroy: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site_eval_external_orders/${evalHeaderId}/batch-delete`,
        method: "delete",
      },
    },
  };
}

export {
  commonDs,
  basicDS,
  itemCategoryDS,
  assessmentPanelDS,
  assessmentDS,
  creatBasicDS,
  backScoreDS,
  reformDS,
};
